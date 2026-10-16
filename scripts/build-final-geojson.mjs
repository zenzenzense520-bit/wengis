// 最终数据构建：合并 seed 属性 + 47 点权威样例坐标 + 天地图坐标，输出全量 GeoJSON
// 坐标优先级：47 点样例（人工权威，山岳取山顶地标）> 天地图地理编码（省界校验）
// 用法：node scripts/build-final-geojson.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { geojsonGcjToWgs, pointInGeometry } from './geo-utils.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const seed = JSON.parse(readFileSync(join(root, 'data/works/ancient_5a_seed.json'), 'utf8'));
const spots = seed.spots;
const cache = JSON.parse(readFileSync(join(root, 'data/works/geocode_cache.json'), 'utf8'));
const sample = JSON.parse(readFileSync(join(root, 'data/geojson/ancient_5a.sample.geojson'), 'utf8')).features;
const provRaw = JSON.parse(readFileSync(join(root, 'data/geojson/china_provinces.geojson'), 'utf8'));
const outGeoJson = join(root, 'data/geojson/ancient_5a_full.geojson');
const reviewPath = join(root, 'data/works/geocode_review.csv');

// 省界（纠偏 WGS84）
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
for (const f of geojsonGcjToWgs(provRaw).features) {
  if (f.properties?.name) {
    provGeom.set(f.properties.name, f.geometry);
    const pts = [];
    collectPoints(f.geometry, pts);
    const lngs = pts.map((p) => p[0]);
    const lats = pts.map((p) => p[1]);
    provBbox.set(f.properties.name, [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)]);
  }
}
const inProvince = (lon, lat, prov) => {
  const g = provGeom.get(prov);
  return g ? pointInGeometry(lon, lat, g) : false;
};
const inBbox = (lon, lat, prov) => {
  const b = provBbox.get(prov);
  return b ? lon >= b[0] && lon <= b[2] && lat >= b[1] && lat <= b[3] : false;
};
// 人工确认：省界 polygon 未覆盖的离岸岛，但坐标为正确的核心纪念地（名称高度匹配）
const MANUAL_HIGH = new Set([84]); // 刘公岛：中国甲午战争博物院（全国重点文保）

// 人工复核修正：样例坐标经核实有误的点，以天地图权威 POI 坐标覆盖（最高优先级）
// 水洞沟（id145）：样例点 106.521,38.325 偏北约 3.6km 且落入内蒙古界；
// 改为水洞沟遗址博物馆（南门文化核心），落在宁夏界（2026-10-08 复核）
const MANUAL_COORDS = new Map([
  [145, { lon: 106.504299, lat: 38.290987, source: 'tianditu', poiName: '水洞沟遗址博物馆' }],
]);

// 已确认离岸海岛：坐标经人工核实正确，仅因省界几何未含海岛而点面检查失败
const OFFSHORE_CONFIRMED = new Set([66, 84]); // 鼓浪屿（厦门）、刘公岛（威海）

// 名称规范化 + 最长公共子串
function stripGeneric(s) {
  return (s || '')
    .replace(/旅游区|旅游景区|风景名胜区|名胜区|风景区|景区|公园|博物馆|博物院/g, '')
    .replace(/自治州|地区|市|省|县|街道/g, '')
    .replace(/[（）()·—–－\-、\s]/g, '');
}
function lcs(a, b) {
  let m = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      let k = 0;
      while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;
      if (k > m) m = k;
    }
  }
  return m;
}

// 样例侧驱动：每个权威样例找全量中最匹配的 spot，建立 spot.id -> 样例坐标
const sampleMap = new Map();
const matchLog = [];
for (const sf of sample) {
  const sn = stripGeneric(sf.properties.name);
  let bestId = null;
  let bl = 0;
  for (const sp of spots) {
    const l = lcs(sn, stripGeneric(sp.name));
    if (l > bl) { bl = l; bestId = sp.id; }
  }
  if (bl >= 2 && bestId !== null) {
    sampleMap.set(bestId, { coords: sf.geometry.coordinates, sampleName: sf.properties.name, score: bl });
    matchLog.push(`${bestId}\t${sf.properties.name} -> ${spots.find((s) => s.id === bestId).name} (${bl})`);
  } else {
    matchLog.push(`!! 未匹配样例: ${sf.properties.name}`);
  }
}

// 组装最终要素
const features = [];
const reviewRows = [['id','name','province','source','confidence','poiName','lon','lat','note']];
let nSample = 0;
let nManual = 0;
let nTdtHigh = 0;
let nTdtOther = 0;
let fail = 0;
for (const sp of spots) {
  const sm = sampleMap.get(sp.id);
  const manual = MANUAL_COORDS.get(sp.id);
  let lon;
  let lat;
  let source;
  let confidence;
  let poiName;
  if (manual) {
    lon = manual.lon;
    lat = manual.lat;
    source = manual.source;
    confidence = 'high';
    poiName = manual.poiName;
    nManual++;
  } else if (sm) {
    [lon, lat] = sm.coords;
    source = 'sample';
    confidence = 'high';
    poiName = sm.sampleName;
    nSample++;
  } else {
    const c = cache[String(sp.id)];
    if (!c || c.status !== 'ok') {
      fail++;
      reviewRows.push([sp.id, sp.name, sp.province, 'tianditu', 'FAIL', '', '', '', c?.status || 'missing']);
      continue;
    }
    lon = c.lon;
    lat = c.lat;
    source = 'tianditu';
    poiName = c.poiName;
    if (MANUAL_HIGH.has(sp.id)) confidence = 'high';
    else if (inProvince(lon, lat, sp.province)) confidence = c.sim >= 1 ? 'high' : 'medium';
    else if (inBbox(lon, lat, sp.province) && c.sim >= 5) confidence = 'medium';
    else confidence = 'low';
    if (confidence === 'high') nTdtHigh++;
    else {
      nTdtOther++;
      reviewRows.push([sp.id, sp.name, sp.province, source, confidence, poiName, lon, lat, '']);
    }
  }
  if (!inProvince(lon, lat, sp.province) && !reviewRows.some((row) => row[0] === sp.id)) {
    const offshoreNote = '离岸海岛，坐标已人工核实正确，省界几何未含海岛（2026-10-08 复核）';
    const defaultNote = '坐标未落入匹配省界几何，需人工核验坐标或行政边界';
    reviewRows.push([
      sp.id, sp.name, sp.province, source, confidence, poiName, lon, lat,
      OFFSHORE_CONFIRMED.has(sp.id) ? offshoreNote : defaultNote,
    ]);
  }
  features.push({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [Number(lon.toFixed(6)), Number(lat.toFixed(6))] },
    properties: {
      id: sp.id, name: sp.name, province: sp.province, city: sp.city, ratingYear: sp.ratingYear,
      category: sp.category, dynasty: sp.dynasty, dynastyGroup: sp.dynastyGroup,
      worldHeritage: sp.worldHeritage, majorSite: sp.majorSite, note: sp.note || '',
      coordSource: source, geocodeConfidence: confidence, geocodePoi: poiName || '',
    },
  });
}

const geojson = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'EPSG:4326' } }, features };
mkdirSync(dirname(outGeoJson), { recursive: true });
writeFileSync(outGeoJson, JSON.stringify(geojson, null, 1), 'utf8');
writeFileSync(reviewPath, '﻿' + reviewRows.map((r) => r.map((x) => String(x).replace(/,/g, '，')).join(',')).join('\n'), 'utf8');

console.log('===== 样例匹配（47 应为 47）=====');
matchLog.forEach((m) => console.log('  ' + m));
console.log('\n===== 最终数据 =====');
console.log(`总点数 ${features.length}（样例权威 ${nSample} + 人工修正 ${nManual} + 天地图高置信 ${nTdtHigh} + 天地图其他 ${nTdtOther}），失败 ${fail}`);
console.log(`输出: data/geojson/ancient_5a_full.geojson`);
if (fail || nTdtOther) console.log(`待复核: data/works/geocode_review.csv（${nTdtOther + fail} 项）`);
if (fail) process.exit(1);
