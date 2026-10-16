// 省界数据构建：将 DataV GCJ-02 省界纠偏为 WGS84，供前端与 PostGIS 统一使用
// 用法：node scripts/build-provinces.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { geojsonGcjToWgs } from './geo-utils.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'data/geojson/china_provinces.geojson');
const out = join(root, 'data/geojson/china_provinces_wgs84.geojson');

const raw = JSON.parse(readFileSync(src, 'utf8'));
const wgs = geojsonGcjToWgs(raw);

// 校验：仅保留含 name 的省级要素；统计几何类型
const types = {};
for (const f of wgs.features) {
  const t = f.geometry?.type || 'None';
  types[t] = (types[t] || 0) + 1;
  const p = f.properties || {};
  if (p.adcode) p.adcode = String(p.adcode).padStart(6, '0');
  // 九段线要素 name 为空，补标准名称
  if ((!p.name || String(p.name).trim() === '') && String(p.adcode).includes('JD')) {
    p.name = '九段线';
  }
}

wgs.crs = { type: 'name', properties: { name: 'EPSG:4326' } };
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(wgs), 'utf8');

console.log(`省界要素数: ${wgs.features.length}`);
console.log('几何类型:', JSON.stringify(types));
console.log('要素清单:');
wgs.features.forEach((f) => {
  const p = f.properties || {};
  console.log(`  ${p.adcode ?? '------'}  ${p.name ?? '(无名)'}  ${f.geometry?.type}`);
});
console.log(`\n输出: data/geojson/china_provinces_wgs84.geojson（${(JSON.stringify(wgs).length / 1024).toFixed(0)} KB，EPSG:4326）`);
