// 省界 GeoJSON -> PostgreSQL INSERT 脚本生成器（只取 adcode/name/geom，几何统一为 MultiPolygon）
// 用法：node scripts/provinces2sql.mjs [输入.geojson] [输出.sql]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const input = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(__dirname, '../data/geojson/china_provinces_wgs84.geojson');
const output = process.argv[3]
  ? resolve(process.argv[3])
  : resolve(__dirname, '../sql/05_insert_provinces.generated.sql');

const collection = JSON.parse(readFileSync(input, 'utf-8'));
if (collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
  console.error('[FAIL] 输入不是 FeatureCollection');
  process.exit(1);
}

/** 坐标数值保留 6 位小数，减小 SQL 体积 */
function roundCoordinates(value) {
  if (typeof value === 'number') {
    return Number(value.toFixed(6));
  }
  if (Array.isArray(value)) {
    return value.map(roundCoordinates);
  }
  return value;
}

function sqlString(value) {
  if (value === undefined || value === null || value === '') return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

const lines = [
  '-- 本文件由 scripts/provinces2sql.mjs 自动生成，请勿手工编辑',
  `-- 数据源：${input.split(/[\\/]/).pop()}，共 ${collection.features.length} 个面要素`,
  '-- 执行：psql -U postgres -h localhost -d wengis -f sql/05_insert_provinces.generated.sql',
  "SET client_encoding = 'UTF8';",
  'BEGIN;',
  'TRUNCATE wengis.provinces;',
];

for (const f of collection.features) {
  const p = f.properties || {};
  if (!p.adcode || !p.name) {
    console.error(`[FAIL] 省界要素缺少 adcode/name：${JSON.stringify(p)}`);
    process.exit(1);
  }
  const geometry = { type: f.geometry.type, coordinates: roundCoordinates(f.geometry.coordinates) };
  const geoJson = JSON.stringify(geometry);
  lines.push(
    `INSERT INTO wengis.provinces (adcode, name, geom)
VALUES (${sqlString(String(p.adcode))}, ${sqlString(p.name)},
        ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON('${geoJson}'), 4326)))
ON CONFLICT (adcode) DO NOTHING;`,
  );
}

lines.push('COMMIT;');
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, lines.join('\n') + '\n', 'utf-8');
console.log(`[OK] 生成 ${collection.features.length} 条 INSERT：${output}`);
