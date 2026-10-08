import type { CoordinateSource } from '../../src/types/evidence';

// 2026-09-29 检索 OSM 坐标候选；只增加候选，不替换样例点。
function reviewedCandidate(
  osmType: 'node' | 'way', osmId: number,
  referencePoint: [number, number], mapName: string,
): [CoordinateSource] {
  return [{
    field: 'coordinates', role: 'candidate', referencePoint, crs: 'EPSG:4326',
    title: `OSM 坐标候选：${mapName}`, publisher: 'OpenStreetMap 社区（Nominatim 检索）',
    url: `https://www.openstreetmap.org/${osmType}/${osmId}`, checkedAt: '2026-09-29',
    scope: `${osmType === 'way' ? '面对象参考中心' : '地图点对象'}；已核对同城名称，但入口含义与位置精度仍待人工核验。未替换地图样例点。`,
    license: 'ODbL-1.0', attribution: '© OpenStreetMap contributors',
    attributionUrl: 'https://www.openstreetmap.org/copyright',
  }];
}

const reviewed = new Map<number, [CoordinateSource]>([
  [1, reviewedCandidate('node', 3884441391, [116.3907817, 39.9174311], '故宫博物院')],
  [2, reviewedCandidate('way', 24824550, [116.4028716, 39.8799066], '天坛公园')],
  [5, reviewedCandidate('way', 29228773, [116.2647403, 39.9900983], '颐和园')],
  [26, reviewedCandidate('way', 366453832, [113.1304412, 40.1126526], '云冈石窟')],
  [30, reviewedCandidate('way', 71235670, [109.2776730, 34.3873627], '秦始皇兵马俑博物馆')],
]);

export function getCoordinateSources(spotId: number): [CoordinateSource] {
  const sources = reviewed.get(spotId);
  if (!sources) throw new Error(`缺少首批坐标来源：${spotId}`);
  return sources;
}
