// 对比全量坐标与 47 点样例坐标，量化地理编码偏差
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const full = JSON.parse(readFileSync(join(root, 'data/geojson/ancient_5a_full.geojson'), 'utf8')).features;
const sample = JSON.parse(readFileSync(join(root, 'data/geojson/ancient_5a.sample.geojson'), 'utf8')).features;

function haversine(a, b) {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a[1] * Math.PI) / 180) * Math.cos((b[1] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
// 剔除通用词，避免“旅游区/景区”等造成跨景点误匹配
function stripGeneric(s) {
  return s
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

let matched = 0;
let max = 0;
const big = [];
const dists = [];
for (const s of sample) {
  const sn = stripGeneric(s.properties.name);
  let best = null;
  let bl = 0;
  for (const f of full) {
    const l = lcs(sn, stripGeneric(f.properties.name));
    if (l > bl) { bl = l; best = f; }
  }
  if (bl < 2 || !best) { console.log('未匹配:', s.properties.name); continue; }
  matched++;
  const d = haversine(s.geometry.coordinates, best.geometry.coordinates);
  dists.push(d);
  if (d > max) max = d;
  if (d > 3) big.push(`${d.toFixed(1)}km  ${s.properties.name} -> ${best.properties.name}`);
}
dists.sort((a, b) => a - b);
const median = dists[Math.floor(dists.length / 2)];
console.log(`匹配 ${matched}/${sample.length}；中位偏差 ${median.toFixed(2)}km；最大偏差 ${max.toFixed(2)}km`);
console.log('偏差 > 3km 的点：');
if (big.length) big.forEach((x) => console.log('  ' + x));
else console.log('  无');
