// 天地图地名搜索 V2 批量地理编码：为 148 家古代类 5A 景区获取 WGS84 坐标
// 特性：QPS 限速、失败重试、断点续跑、省界点面包含校验（自动纠同名错误）、多查询词回退、待复核清单
// 用法：node scripts/geocode-tianditu.mjs            # 编码（断点续跑）
//      node scripts/geocode-tianditu.mjs --build    # 仅由缓存生成 GeoJSON
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { geojsonGcjToWgs, pointInGeometry } from './geo-utils.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const seedPath = join(root, 'data/works/ancient_5a_seed.json');
const provPath = join(root, 'data/geojson/china_provinces.geojson');
const cachePath = join(root, 'data/works/geocode_cache.json');
const outGeoJson = join(root, 'data/geojson/ancient_5a_full.geojson');
const reviewPath = join(root, 'data/works/geocode_review.csv');

const envText = readFileSync(join(root, '.env.local'), 'utf8');
const KEY = envText.match(/VITE_TIANDITU_KEY\s*=\s*([^\s\r\n]+)/)?.[1];
if (!KEY) { console.error('未找到 VITE_TIANDITU_KEY'); process.exit(1); }

const QPS_INTERVAL_MS = 300;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 省界（GCJ-02 纠偏为 WGS84），构建 province -> geometry
const provRaw = JSON.parse(readFileSync(provPath, 'utf8'));
const provWgs = geojsonGcjToWgs(provRaw);
const provGeom = new Map();
const provBbox = new Map();
const GEOM_DEPTH = { Point: 0, MultiPoint: 1, LineString: 1, MultiLineString: 2, Polygon: 2, MultiPolygon: 3 };
function collectPoints(geom, out) {
  const walk = (coords, depth) => {
    if (depth === 0) { out.push(coords); return; }
    coords.forEach((c) => walk(c, depth - 1));
  };
  const d = GEOM_DEPTH[geom.type];
  if (d !== undefined) walk(geom.coordinates, d);
}
for (const f of provWgs.features) {
  if (f.properties && f.properties.name) {
    provGeom.set(f.properties.name, f.geometry);
    const pts = [];
    collectPoints(f.geometry, pts);
    const lngs = pts.map((p) => p[0]);
    const lats = pts.map((p) => p[1]);
    provBbox.set(f.properties.name, [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)]);
  }
}
function inProvince(lon, lat, province) {
  const g = provGeom.get(province);
  return g ? pointInGeometry(lon, lat, g) : false;
}
function inBbox(lon, lat, province) {
  const b = provBbox.get(province);
  return b ? lon >= b[0] && lon <= b[2] && lat >= b[1] && lat <= b[3] : false;
}
// 置信度：polygon 内含为硬约束；bbox 内且名称高度匹配用于离岸岛/省界精度兜底
function judge(inProv, inBox, sim) {
  if (inProv) return sim >= 1 ? 'high' : 'medium';
  if (inBox && sim >= 5) return 'medium';
  return 'low';
}

function cityShort(c) {
  const state = ['北京','天津','上海','重庆'];
  for (const s of state) if (c.startsWith(s)) return s;
  const auto = ['黔东南','黔南','黔西南','大理','延边','湘西','恩施','临夏','甘南','凉山','阿坝','甘孜','红河','西双版纳','德宏','怒江','迪庆','文山','楚雄','巴音郭楞','博尔塔拉','昌吉','伊犁','克孜勒苏','海西','海北','黄南','果洛','玉树'];
  for (const a of auto) if (c.startsWith(a)) return a;
  return c.replace(/市$|地区$|盟$/, '');
}
// 名称 2 字滑窗相似度
function commonChars(a, b) {
  let n = 0;
  for (let i = 0; i < a.length - 1; i++) if (b.includes(a.slice(i, i + 2))) n++;
  return n;
}

async function search(query) {
  const postStr = { keyWord: query, queryType: '7', start: '0', mapBound: '-180,-90,180,90', level: '12', count: '8' };
  const url = `https://api.tianditu.gov.cn/v2/search?postStr=${encodeURIComponent(JSON.stringify(postStr))}&type=query&tk=${KEY}`;
  const res = await fetch(url, { headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    'Referer': 'http://localhost:43200/', 'Accept': 'application/json, text/plain, */*',
  } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.pois || [];
}
async function withRetry(fn, times = 3) {
  for (let i = 0; i < times; i++) {
    try { return await fn(); } catch (e) { if (i === times - 1) throw e; await sleep(800 * (i + 1)); }
  }
}

// 在候选 POI 中选最佳：省界包含为硬约束，名称相似度辅助
function pickBest(pois, spot) {
  const cShort = cityShort(spot.city);
  const q = spot.geocodeQuery;
  const cands = [];
  for (const poi of pois) {
    if (!poi.lonlat) continue;
    const [lon, lat] = poi.lonlat.split(',').map(Number);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    const inProv = inProvince(lon, lat, spot.province);
    const inBox = !inProv && inBbox(lon, lat, spot.province);
    const text = `${poi.name || ''}${poi.address || ''}`;
    const sim = commonChars(q, text) + commonChars(spot.name.slice(-6), text);
    const score = (inProv ? 100 : inBox ? 40 : 0) + Math.min(sim, 8) + (text.includes(cShort) ? 3 : 0);
    cands.push({ lon, lat, poiName: poi.name || '', address: poi.address || '', inProv, inBox, sim, score });
  }
  if (!cands.length) return null;
  cands.sort((a, b) => b.score - a.score);
  const best = cands[0];
  best.confidence = judge(best.inProv, best.inBox, best.sim);
  return best;
}

// 候选查询词序列
function buildQueries(spot) {
  const qs = [spot.geocodeQuery];
  const c = cityShort(spot.city);
  if (!spot.geocodeQuery.includes(c)) qs.push(c + spot.geocodeQuery);
  qs.push(spot.name);
  return [...new Set(qs)];
}

const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
const spots = seed.spots;
let cache = {};
try { cache = JSON.parse(readFileSync(cachePath, 'utf8')); } catch {}
const buildOnly = process.argv.includes('--build');

if (!buildOnly) {
  let done = 0;
  for (const spot of spots) {
    const key = String(spot.id);
    const prev = cache[key];
    // 缓存命中：high 且坐标确在省内则跳过
    if (prev && prev.status === 'ok' && prev.inProv && prev.confidence === 'high') { done++; continue; }

    let result = null;
    const queries = buildQueries(spot);
    for (let qi = 0; qi < queries.length; qi++) {
      try {
        const pois = await withRetry(() => search(queries[qi]));
        const best = pickBest(pois, spot);
        if (best && (best.confidence === 'high' || !result)) result = { ...best, query: queries[qi], tried: qi + 1 };
        if (best && best.confidence === 'high') break;
      } catch (e) {
        result = { status: 'error', error: String(e.message || e), query: queries[qi] };
      }
      await sleep(QPS_INTERVAL_MS);
    }
    cache[key] = result ? { status: 'ok', ...result } : { status: 'no_result', query: spot.geocodeQuery };
    done++;
    if (done % 10 === 0 || done === spots.length) writeFileSync(cachePath, JSON.stringify(cache, null, 1), 'utf8');
    process.stdout.write(`\r编码中 ${done}/${spots.length}`);
  }
  writeFileSync(cachePath, JSON.stringify(cache, null, 1), 'utf8');
  process.stdout.write('\n');
}

// 生成 GeoJSON 与复核清单
const features = [];
const reviewRows = [['id','name','province','city','query','status','confidence','poiName','address','lon','lat']];
let high = 0, med = 0, low = 0, fail = 0;
for (const spot of spots) {
  const c = cache[String(spot.id)];
  if (!c || c.status !== 'ok') { fail++; reviewRows.push([spot.id,spot.name,spot.province,spot.city,spot.geocodeQuery,c?.status||'missing','','','','','']); continue; }
  // 用省界复核，统一置信度口径
  const inProv = inProvince(c.lon, c.lat, spot.province);
  const inBox = !inProv && inBbox(c.lon, c.lat, spot.province);
  const conf = judge(inProv, inBox, c.sim);
  if (conf === 'high') high++; else if (conf === 'medium') med++; else { low++; reviewRows.push([spot.id,spot.name,spot.province,spot.city,c.query,'ok','low',c.poiName,c.address,c.lon,c.lat]); }
  features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [c.lon, c.lat] },
    properties: { id: spot.id, name: spot.name, province: spot.province, city: spot.city, ratingYear: spot.ratingYear,
      category: spot.category, dynasty: spot.dynasty, dynastyGroup: spot.dynastyGroup,
      worldHeritage: spot.worldHeritage, majorSite: spot.majorSite, note: spot.note || '',
      geocodeConfidence: conf, geocodePoi: c.poiName } });
}
const geojson = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'EPSG:4326' } }, features };
mkdirSync(dirname(outGeoJson), { recursive: true });
writeFileSync(outGeoJson, JSON.stringify(geojson, null, 1), 'utf8');
writeFileSync(reviewPath, '﻿' + reviewRows.map((r) => r.map((x) => String(x).replace(/,/g, '，')).join(',')).join('\n'), 'utf8');

console.log('===== 地理编码结果 =====');
console.log(`总数 ${spots.length}：高置信 ${high}，中置信 ${med}，低置信(跨省/待复核) ${low}，失败 ${fail}`);
console.log(`GeoJSON: data/geojson/ancient_5a_full.geojson（${features.length} 点）`);
console.log(`待复核清单: data/works/geocode_review.csv`);
if (fail || low) process.exit(1);
