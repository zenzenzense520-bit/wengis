// 古代类 5A 景区数据类型定义

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

/** 朝代主时间轴分组（按最早始建朝代归组，顺序即时间顺序） */
export type DynastyGroup =
  | '先秦'
  | '秦'
  | '汉'
  | '魏晋南北朝'
  | '隋唐'
  | '宋'
  | '元'
  | '明'
  | '清'
  | '清末民国';

/** 坐标来源：47 点权威样例 / 天地图地理编码 */
export type CoordSource = 'sample' | 'tianditu';

/** 地理编码置信度 */
export type CoordConfidence = 'high' | 'medium' | 'low';

/** GeoJSON 要素属性（强类型，禁止使用 any 或未结构化对象） */
export interface SpotProperties {
  /** 景区唯一编号（与原始名单序号对应） */
  id: number;
  /** 景区官方名称 */
  name: string;
  /** 省级行政区 */
  province: string;
  /** 地级市/州/盟 */
  city: string;
  /** 5A 评定年份（复评年份以 note 标注） */
  ratingYear: number;
  /** 文化类别 */
  category: SpotCategory;
  /** 始建或主体遗存所属朝代（跨代用顿号分隔） */
  dynasty: string;
  /** 朝代主时间轴分组（按最早始建朝代归组） */
  dynastyGroup: DynastyGroup;
  /** 是否为世界文化遗产（含扩展项目、文化景观、双遗产的文化部分） */
  worldHeritage: boolean;
  /** 是否为全国重点文物保护单位（景区核心遗存） */
  majorSite: boolean;
  /** 备注（复建、复合景区等说明） */
  note?: string;
  /** 坐标来源 */
  coordSource?: CoordSource;
  /** 地理编码置信度 */
  geocodeConfidence?: CoordConfidence;
  /** 地理编码命中的 POI 名称 */
  geocodePoi?: string;
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

/** 省界要素属性 */
export interface ProvinceProperties {
  adcode: string;
  name: string;
  center?: [number, number];
  centroid?: [number, number];
  childrenNum?: number;
  level?: string;
}

/** 省界面要素（Polygon / MultiPolygon） */
export interface ProvinceFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][][] | number[][][][][];
  };
  properties: ProvinceProperties;
}

/** 省界要素集合 */
export interface ProvinceCollection {
  type: 'FeatureCollection';
  features: ProvinceFeature[];
}
