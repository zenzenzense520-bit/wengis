import type { SpotCollection } from '../types/spot';
import type { EvidenceRecord, FieldSource, RatingSource } from '../types/evidence';
import type { SpotProperties } from '../types/spot';

// 拒绝可执行协议、账号密码链接及错误的证据关联。
export function safeSourceUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('资料来源链接必须是无账号密码的 HTTPS 地址');
  }
  return url.href;
}

// 原文只能是官方列示年份；多个年份必须升序且显式采用最早列示口径。
function ratingMatches(source: RatingSource, properties: SpotProperties): boolean {
  if (!source.officialName?.trim() || !/^(20\d{2})(\/20\d{2})*年$/.test(source.officialYearText)) return false;
  const years = source.officialYearText.slice(0, -1).split('/').map(Number);
  const hasDetail = source.detailYearText !== undefined || source.detailUrl !== undefined;
  const detailMatches = !hasDetail || (typeof source.detailYearText === 'string' &&
    /^20\d{2}年(?:\/20\d{2}年)*$/.test(source.detailYearText) &&
    source.detailYearText !== source.officialYearText &&
    typeof source.detailUrl === 'string' &&
    new URL(safeSourceUrl(source.detailUrl)).hostname === 'sjfw.mct.gov.cn');
  return years.every((year, i) => year >= 2007 && year <= 2026 && (i === 0 || year > years[i - 1])) &&
    detailMatches &&
    source.yearBasis === (years.length === 1 ? 'single-listed' : 'earliest-listed') &&
    source.expectedValue === years[0] && source.expectedValue === properties.ratingYear;
}

export function ratingYearStatus(properties: SpotProperties): 'single' | 'multiple' | 'conflict' | 'pending' {
  const ratings = properties.evidence?.ratingSources ?? [];
  if (ratings.some(source => source.detailYearText)) return 'conflict';
  if (ratings.some(source => source.yearBasis === 'earliest-listed')) return 'multiple';
  return ratings.length ? 'single' : 'pending';
}

function sourceMatches(source: FieldSource, properties: SpotProperties): boolean {
  if (source.field === 'worldHeritage') return source.expectedValue === properties.worldHeritage;
  if (source.field === 'ratingYear') return ratingMatches(source, properties);
  if (source.field !== 'coordinates') return false;
  const point = source.referencePoint;
  return source.role === 'candidate' && source.crs === 'EPSG:4326' &&
    Array.isArray(point) && point.length === 2 && point.every(Number.isFinite) &&
    point[0] >= 73 && point[0] <= 136 && point[1] >= 3 && point[1] <= 54 &&
    source.license === 'ODbL-1.0' && source.attribution === '© OpenStreetMap contributors' &&
    source.attributionUrl === 'https://www.openstreetmap.org/copyright';
}

export function attachEvidence(data: SpotCollection, records: EvidenceRecord[]): SpotCollection {
  const features = new Map(data.features.map(feature => [feature.properties.id, feature]));
  const evidence = new Map<number, EvidenceRecord>();
  for (const record of records) {
    const feature = features.get(record.spotId);
    if (!feature || feature.properties.name !== record.spotName || evidence.has(record.spotId)) {
      throw new Error(`证据关联错误：景区 ${record.spotId}`);
    }
    if (!record.sources.length) throw new Error(`证据缺少来源：景区 ${record.spotId}`);
    for (const source of record.sources) {
      safeSourceUrl(source.url);
      if (!sourceMatches(source, feature.properties) ||
          !source.title.trim() || !source.publisher.trim() || !source.scope.trim() ||
          !/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt) ||
          new Date(`${source.checkedAt}T00:00:00Z`).toISOString().slice(0, 10) !== source.checkedAt) {
        throw new Error(`证据字段不匹配或来源不完整：景区 ${record.spotId}`);
      }
    }
    evidence.set(record.spotId, record);
  }
  return {
    type: 'FeatureCollection',
    features: data.features.map(feature => ({
      ...feature, properties: {
        ...feature.properties,
        evidence: {
          heritageSources: (evidence.get(feature.properties.id)?.sources ?? []).filter(s => s.field === 'worldHeritage'),
          ratingSources: (evidence.get(feature.properties.id)?.sources ?? []).filter(s => s.field === 'ratingYear'),
          coordinateSources: (evidence.get(feature.properties.id)?.sources ?? []).filter(s => s.field === 'coordinates'),
          coordinateStatus: 'approximate',
        },
      },
    })),
  };
}
