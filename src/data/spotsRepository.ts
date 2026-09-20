import type { SpotCollection, SpotFeature, SpotProperties } from '../types/spot';

// 景区数据加载与结构校验（任何解析失败都显式抛出，禁止静默吞异常）

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function validateProperties(props: unknown): props is SpotProperties {
  if (typeof props !== 'object' || props === null) {
    return false;
  }
  const p = props as Record<string, unknown>;
  return (
    isNumber(p.id) &&
    isNonEmptyString(p.name) &&
    isNonEmptyString(p.province) &&
    isNonEmptyString(p.city) &&
    isNumber(p.ratingYear) &&
    isNonEmptyString(p.category) &&
    isNonEmptyString(p.dynasty) &&
    typeof p.worldHeritage === 'boolean' &&
    typeof p.majorSite === 'boolean'
  );
}

function validateFeature(feature: unknown): feature is SpotFeature {
  if (typeof feature !== 'object' || feature === null) {
    return false;
  }
  const f = feature as Record<string, unknown>;
  if (f.type !== 'Feature' || typeof f.geometry !== 'object' || f.geometry === null) {
    return false;
  }
  const geometry = f.geometry as Record<string, unknown>;
  const coordinates = geometry.coordinates;
  const validPoint =
    geometry.type === 'Point' &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    isNumber(coordinates[0]) &&
    isNumber(coordinates[1]);
  return validPoint && validateProperties(f.properties);
}

/** 加载并校验 GeoJSON 数据 */
export async function loadSpots(url: string): Promise<SpotCollection> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`数据请求失败（网络错误）：${url}`, { cause: error });
  }
  if (!response.ok) {
    throw new Error(`数据请求失败：HTTP ${response.status} ${response.statusText}`);
  }

  const json: unknown = await response.json();
  if (typeof json !== 'object' || json === null) {
    throw new Error('数据格式错误：根节点不是对象');
  }
  const collection = json as Record<string, unknown>;
  if (collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
    throw new Error('数据格式错误：不是 FeatureCollection');
  }
  const invalidIndex = collection.features.findIndex((f) => !validateFeature(f));
  if (invalidIndex >= 0) {
    throw new Error(`数据格式错误：第 ${invalidIndex + 1} 个要素结构不合法`);
  }
  return {
    type: 'FeatureCollection',
    features: collection.features as SpotFeature[],
  };
}
