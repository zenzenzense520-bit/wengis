import type { SpotFeature } from '../types/spot';

// 新增组合筛选：朝代按原始标签精确匹配，评定年份采用累计截止口径。
export interface SpotFilters {
  keyword: string;
  province: string;
  category: string;
  dynasty: string;
  untilYear: number;
}

export function filterSpots(features: SpotFeature[], filters: SpotFilters): SpotFeature[] {
  const keyword = filters.keyword.trim().toLocaleLowerCase();
  return features.filter(({ properties: p }) =>
    (!keyword || `${p.name} ${p.city} ${p.note ?? ''}`.toLocaleLowerCase().includes(keyword)) &&
    (!filters.province || p.province === filters.province) &&
    (!filters.category || p.category === filters.category) &&
    (!filters.dynasty || p.dynasty === filters.dynasty) &&
    p.ratingYear <= filters.untilYear,
  );
}

export function categoryCounts(features: SpotFeature[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const { properties } of features) {
    counts.set(properties.category, (counts.get(properties.category) ?? 0) + 1);
  }
  return new Map([...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN')));
}
