import type { CoordinateSource, RatingSource } from '../../src/types/evidence';

// 2026-09-29 查阅文旅部名单并检索 OSM；只增加证据，不替换样例点。
function reviewedPair(
  locator: string, osmType: 'node' | 'way', osmId: number,
  referencePoint: [number, number], mapName: string,
): [RatingSource, CoordinateSource] {
  return [{
    field: 'ratingYear', expectedValue: 2007, title: '国家5A级旅游景区名单（2025-03-11 口径）',
    publisher: '文化和旅游部', url: 'https://sjfw.mct.gov.cn/site/dataservice/rural?type=10',
    checkedAt: '2026-09-29', scope: `名单定位：${locator}。对应评定年份为 2007 年；不用于证明当前所有景区的有效评级。`,
  }, {
    field: 'coordinates', role: 'candidate', referencePoint, crs: 'EPSG:4326',
    title: `OSM 坐标候选：${mapName}`, publisher: 'OpenStreetMap 社区（Nominatim 检索）',
    url: `https://www.openstreetmap.org/${osmType}/${osmId}`, checkedAt: '2026-09-29',
    scope: `${osmType === 'way' ? '面对象参考中心' : '地图点对象'}；已核对同城名称，但入口含义与位置精度仍待人工核验。未替换地图样例点。`,
    license: 'ODbL-1.0', attribution: '© OpenStreetMap contributors',
    attributionUrl: 'https://www.openstreetmap.org/copyright',
  }];
}

const reviewed = new Map<number, [RatingSource, CoordinateSource]>([
  [1, reviewedPair('北京 / 故宫博物院', 'node', 3884441391, [116.3907817, 39.9174311], '故宫博物院')],
  [2, reviewedPair('北京 / 天坛公园', 'way', 24824550, [116.4028716, 39.8799066], '天坛公园')],
  [5, reviewedPair('北京 / 颐和园', 'way', 29228773, [116.2647403, 39.9900983], '颐和园')],
  [26, reviewedPair('山西 / 大同市云冈石窟景区', 'way', 366453832, [113.1304412, 40.1126526], '云冈石窟')],
  [30, reviewedPair('陕西 / 西安市秦始皇帝陵博物院景区', 'way', 71235670, [109.2776730, 34.3873627], '秦始皇兵马俑博物馆')],
]);

export function getReviewedSources(spotId: number): [RatingSource, CoordinateSource] {
  const sources = reviewed.get(spotId);
  if (!sources) throw new Error(`缺少首批年份与坐标来源：${spotId}`);
  return sources;
}
