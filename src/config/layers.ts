import type { SpotCategory } from '../types/spot';

/** 底图标识 */
export type BasemapId = 'tdt-vec' | 'tdt-img' | 'arcgis-street' | 'arcgis-topo' | 'osm';

// 地图与图层配置（唯一配置来源）

/** 中国版图中心附近的默认视图（EPSG:4326 经纬度） */
export const DEFAULT_CENTER: [number, number] = [104.5, 35.5];
export const DEFAULT_ZOOM = 4;
export const MIN_ZOOM = 3;
export const MAX_ZOOM = 18;

/** 各文化类别的地图配色（分类色，图例与点位共用） */
export const CATEGORY_COLORS: Record<SpotCategory, string> = {
  宫殿坛庙: '#c0392b',
  古典园林: '#2e7d32',
  古城古镇: '#b9770e',
  古村落: '#9c6b3f',
  宗教寺观: '#8e44ad',
  历史名山: '#148f77',
  石窟石刻: '#5d6d7e',
  古遗址: '#a04000',
  陵寝墓葬: '#616a6b',
  关隘长城: '#7b241c',
  历史街区: '#1f618d',
  复合人文: '#b7950b',
};

/** 聚合渲染参数 */
export const CLUSTER_DISTANCE = 48;
export const CLUSTER_MIN_DISTANCE = 18;

/** 天地图密钥：从 .env.local 读取（VITE_TIANDITU_KEY），不写入代码仓库 */
export const TIANDITU_KEY = import.meta.env.VITE_TIANDITU_KEY ?? '';

/** 默认底图：已配置天地图 key 时用天地图矢量（中文标注、标准边界），否则回退 ArcGIS */
export const DEFAULT_BASEMAP: BasemapId = TIANDITU_KEY ? 'tdt-vec' : 'arcgis-street';
