import type { SpotCollection } from '../types/spot';
import type { EvidenceRecord } from '../types/evidence';

// 拒绝可执行协议、账号密码链接及错误的证据关联。
export function safeSourceUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('资料来源链接必须是无账号密码的 HTTPS 地址');
  }
  return url.href;
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
      if (source.field !== 'worldHeritage' || source.expectedValue !== feature.properties.worldHeritage ||
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
        evidence: { heritageSources: evidence.get(feature.properties.id)?.sources ?? [], coordinateStatus: 'approximate' },
      },
    })),
  };
}
