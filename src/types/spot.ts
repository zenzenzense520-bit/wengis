// 古代类 5A 景区数据类型定义
import type { SpotEvidence } from './evidence';

/** 景区文化类别（初版分类口径，详见 docs/01_数据口径与分类.md） */
export type SpotCategory =
  | '宫殿坛庙'
  | '古典园林'
  | '古城古镇'
  | '古村落'
  | '宗教寺观'
  | '历史名山'
  | '石窟石刻'
  | '古遗址'
  | '陵寝墓葬'
  | '关隘长城'
  | '历史街区'
  | '复合人文';

/** GeoJSON 要素属性（强类型，禁止使用 any 或未结构化对象） */
export interface SpotProperties {
  /** 景区唯一编号（与原始名单序号对应） */
  id: number;
  /** 样例展示名称；完整官方名称记录在年份证据中 */
  name: string;
  /** 省级行政区 */
  province: string;
  /** 地级市/州/盟 */
  city: string;
  /** 官方最早列示年份，用于累计筛选；多年份原文另存证据 */
  ratingYear: number;
  /** 文化类别 */
  category: SpotCategory;
  /** 始建或主体遗存所属朝代（跨代用顿号分隔） */
  dynasty: string;
  /** 是否为世界文化遗产（含扩展项目、文化景观） */
  worldHeritage: boolean;
  /** 是否为全国重点文物保护单位（景区核心遗存） */
  majorSite: boolean;
  /** 备注（复建、复合景区等说明） */
  note?: string;
  /** 字段级核验信息由独立证据记录关联生成，未核验字段仍属样例。 */
  evidence?: SpotEvidence;
}

/** 景区点要素 */
export interface SpotFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [经度, 纬度]，WGS84
  };
  properties: SpotProperties;
}

/** GeoJSON 要素集合 */
export interface SpotCollection {
  type: 'FeatureCollection';
  features: SpotFeature[];
}
