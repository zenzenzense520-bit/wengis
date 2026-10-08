// 保存官方年份原文与累计口径；年份证据不代表入口或逐年有效等级。
export interface SourceMetadata {
  title: string;
  publisher: string;
  url: string;
  checkedAt: string;
  scope: string;
}

export interface HeritageSource extends SourceMetadata {
  field: 'worldHeritage';
  expectedValue: boolean;
}

export interface RatingSource extends SourceMetadata {
  field: 'ratingYear';
  expectedValue: number;
  officialName: string;
  officialYearText: string;
  yearBasis: 'single-listed' | 'earliest-listed';
  detailYearText?: string;
  detailUrl?: string;
}

export interface CoordinateSource extends SourceMetadata {
  field: 'coordinates';
  role: 'candidate';
  referencePoint: [number, number];
  crs: 'EPSG:4326';
  license: 'ODbL-1.0';
  attribution: '© OpenStreetMap contributors';
  attributionUrl: 'https://www.openstreetmap.org/copyright';
}

export type FieldSource = HeritageSource | RatingSource | CoordinateSource;

export interface EvidenceRecord {
  spotId: number;
  spotName: string;
  sources: FieldSource[];
}

export interface SpotEvidence {
  heritageSources: HeritageSource[];
  ratingSources: RatingSource[];
  coordinateSources: CoordinateSource[];
  coordinateStatus: 'approximate';
}
