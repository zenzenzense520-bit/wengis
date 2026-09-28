import type { SpotCollection, SpotFeature, SpotProperties } from '../types/spot';

// 新增严格检查，拒绝非法枚举、越界坐标与重复主键。
const categories = new Set(['宫殿坛庙', '古典园林', '古城古镇', '古村落', '宗教寺观',
  '历史名山', '石窟石刻', '古遗址', '陵寝墓葬', '关隘长城', '历史街区', '复合人文']);
function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
function propertiesValid(value: unknown): value is SpotProperties {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return finite(p.id) && Number.isInteger(p.id) && p.id > 0 &&
    nonEmpty(p.name) && nonEmpty(p.province) && nonEmpty(p.city) &&
    finite(p.ratingYear) && Number.isInteger(p.ratingYear) && p.ratingYear >= 2007 && p.ratingYear <= 2026 &&
    typeof p.category === 'string' && categories.has(p.category) && nonEmpty(p.dynasty) &&
    typeof p.worldHeritage === 'boolean' && typeof p.majorSite === 'boolean' &&
    (p.note === undefined || typeof p.note === 'string');
}
function featureValid(value: unknown): value is SpotFeature {
  if (typeof value !== 'object' || value === null) return false;
  const f = value as Record<string, unknown>;
  if (f.type !== 'Feature' || typeof f.geometry !== 'object' || f.geometry === null) return false;
  const g = f.geometry as Record<string, unknown>;
  const c = g.coordinates;
  return g.type === 'Point' && Array.isArray(c) && c.length === 2 &&
    finite(c[0]) && c[0] >= 73 && c[0] <= 136 && finite(c[1]) && c[1] >= 3 && c[1] <= 54 &&
    propertiesValid(f.properties);
}
export function validateSpots(value: unknown): SpotCollection {
  if (typeof value !== 'object' || value === null) throw new Error('数据格式错误：根节点不是对象');
  const collection = value as Record<string, unknown>;
  if (collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
    throw new Error('数据格式错误：不是 FeatureCollection');
  }
  const ids = new Set<number>();
  for (const [index, feature] of collection.features.entries()) {
    if (!featureValid(feature)) throw new Error(`数据格式错误：第 ${index + 1} 个要素结构不合法`);
    if (ids.has(feature.properties.id)) throw new Error(`数据格式错误：重复 id=${feature.properties.id}`);
    ids.add(feature.properties.id);
  }
  return { type: 'FeatureCollection', features: collection.features as SpotFeature[] };
}
