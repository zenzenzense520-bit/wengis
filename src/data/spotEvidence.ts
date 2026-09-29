import type { SpotCollection } from '../types/spot';
import type { EvidenceRecord, FieldSource } from '../types/evidence';
import type { SpotProperties } from '../types/spot';

// 拒绝可执行协议、账号密码链接及错误的证据关联。
export function safeSourceUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('资料来源链接必须是无账号密码的 HTTPS 地址');
  }
  return url.href;
}

function sourceMatches(source: FieldSource, properties: SpotProperties): boolean {
  if (source.field === 'worldHeritage') return source.expectedValue === properties.worldHeritage;
  if (source.field === 'ratingYear') return source.expectedValue === properties.ratingYear;
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
