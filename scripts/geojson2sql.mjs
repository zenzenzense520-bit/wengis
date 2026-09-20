// GeoJSON -> PostgreSQL INSERT 脚本生成器（无外部依赖，GDAL 不可用时的兜底通道）
// 用法：node scripts/geojson2sql.mjs [输入.geojson] [输出.sql]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const input = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(__dirname, '../data/geojson/ancient_5a.sample.geojson');
const output = process.argv[3]
  ? resolve(process.argv[3])
  : resolve(__dirname, '../sql/04_insert_ancient_5a.generated.sql');

const collection = JSON.parse(readFileSync(input, 'utf-8'));
if (collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
  console.error('[FAIL] 输入不是 FeatureCollection');
  process.exit(1);
}

/** SQL 字符串转义 */
function sqlString(value) {
  if (value === undefined || value === null) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

const lines = [
  '-- 本文件由 scripts/geojson2sql.mjs 自动生成，请勿手工编辑',
  '-- 执行：psql -U postgres -h localhost -d wengis -f sql/04_insert_ancient_5a.generated.sql',
  'BEGIN;',
  'TRUNCATE wengis.ancient_5a;',
];

for (const f of collection.features) {
  const p = f.properties;
  const [lng, lat] = f.geometry.coordinates;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    console.error(`[FAIL] id=${p.id} 坐标非法`);
    process.exit(1);
  }
  lines.push(
    `INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (${p.id}, ${sqlString(p.name)}, ${sqlString(p.province)}, ${sqlString(p.city)}, ${p.ratingYear},
   ${sqlString(p.category)}, ${sqlString(p.dynasty)}, ${p.worldHeritage}, ${p.majorSite},
   ${sqlString(p.note)}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))
ON CONFLICT (id) DO NOTHING;`,
  );
}

lines.push('COMMIT;');
writeFileSync(output, lines.join('\n') + '\n', 'utf-8');
console.log(`[OK] 生成 ${collection.features.length} 条 INSERT：${output}`);
