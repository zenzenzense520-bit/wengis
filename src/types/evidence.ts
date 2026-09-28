// 新增字段级证据类型；本轮只核验世界遗产关联身份。
export interface HeritageSource {
  field: 'worldHeritage';
  expectedValue: boolean;
  title: string;
  publisher: string;
  url: string;
  checkedAt: string;
  scope: string;
}

export interface EvidenceRecord {
  spotId: number;
  spotName: string;
  sources: HeritageSource[];
}

export interface SpotEvidence {
  heritageSources: HeritageSource[];
  coordinateStatus: 'approximate';
}
