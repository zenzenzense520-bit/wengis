// GeoJSON 数据校验脚本：结构合法性、主键唯一、坐标范围检查
// 用法：node scripts/validate-data.mjs [文件路径]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(__dirname, '../data/geojson/ancient_5a.sample.geojson');

const REQUIRED_FIELDS = [
  'id', 'name', 'province', 'city', 'ratingYear',
  'category', 'dynasty', 'worldHeritage', 'majorSite',
];
const CATEGORIES = new Set([
  '宫殿坛庙', '古典园林', '古城古镇', '古村落', '宗教寺观', '历史名山',
  '石窟石刻', '古遗址', '陵寝墓葬', '关隘长城', '历史街区', '复合人文',
]);

let collection;
try {
  collection = JSON.parse(readFileSync(target, 'utf-8'));
} catch (error) {
  console.error(`[FAIL] 文件无法解析：${target}\n${error.message}`);
  process.exit(1);
}

const errors = [];
if (collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
  errors.push('根节点不是 FeatureCollection');
}

const ids = new Set();
(collection.features ?? []).forEach((feature, index) => {
  const where = `第 ${index + 1} 个要素`;
  if (feature?.type !== 'Feature') {
    errors.push(`${where}：type 不是 Feature`);
    return;
  }
  if (feature.geometry?.type !== 'Point' || !Array.isArray(feature.geometry.coordinates)) {
    errors.push(`${where}：几何不是 Point`);
    return;
  }
  const [lng, lat] = feature.geometry.coordinates;
  if (typeof lng !== 'number' || lng < 73 || lng > 136) {
    errors.push(`${where}：经度 ${lng} 超出中国范围`);
  }
  if (typeof lat !== 'number' || lat < 3 || lat > 54) {
    errors.push(`${where}：纬度 ${lat} 超出中国范围`);
  }
  const p = feature.properties ?? {};
  for (const field of REQUIRED_FIELDS) {
    if (p[field] === undefined || p[field] === null || p[field] === '') {
      errors.push(`${where}：缺少字段 ${field}`);
    }
  }
  if (!CATEGORIES.has(p.category)) {
    errors.push(`${where}：未知类别 "${p.category}"`);
  }
  if (typeof p.ratingYear === 'number' && (p.ratingYear < 2007 || p.ratingYear > 2026)) {
    errors.push(`${where}：评定年份 ${p.ratingYear} 不合理`);
  }
  if (ids.has(p.id)) {
    errors.push(`${where}：id=${p.id} 重复`);
  }
  ids.add(p.id);
});

if (errors.length > 0) {
  console.error(`[FAIL] 校验未通过，共 ${errors.length} 个问题：`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

const categoryCount = {};
for (const f of collection.features) {
  categoryCount[f.properties.category] = (categoryCount[f.properties.category] ?? 0) + 1;
}
console.log(`[OK] 校验通过：${collection.features.length} 个要素，${ids.size} 个唯一 id`);
console.log('类别分布：', JSON.stringify(categoryCount, null, 0));
