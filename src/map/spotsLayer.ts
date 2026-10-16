import Feature, { type FeatureLike } from 'ol/Feature';
import { Point } from 'ol/geom';
import type Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import { Style, Fill, Stroke, Text, Circle as CircleStyle } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { CATEGORY_COLORS, CLUSTER_DISTANCE, CLUSTER_MIN_DISTANCE } from '../config/layers';
import type { SpotCollection, SpotProperties } from '../types/spot';

// 5A 景区点位图层：支持聚合/散点两种模式，按文化类别着色，支持筛选联动

/** 聚合要素在要素属性中的键名 */
export const CLUSTER_FEATURES_KEY = 'features';

/** 景区点位的属性键名 */
export const SPOT_PROPERTIES_KEY = 'spot';

/** 景区筛选谓词（返回 true 表示该点可见） */
export type SpotFilter = (properties: SpotProperties) => boolean;

function createSpotStyle(properties: SpotProperties): Style {
  const color = CATEGORY_COLORS[properties.category] ?? '#333333';
  return new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({ color: hexToRgb(color) }),
      stroke: new Stroke({ color: '#ffffff', width: 1.5 }),
    }),
  });
}

/** 空样式（隐藏被筛选掉的点） */
const HIDDEN_STYLE = new Style({});

function createClusterStyle(feature: FeatureLike): Style {
  const features = feature.get(CLUSTER_FEATURES_KEY) as Feature[] | undefined;
  const size = features?.length ?? 1;
  const radius = Math.min(10 + Math.sqrt(size) * 2.5, 26);
  return new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({ color: 'rgba(192, 57, 43, 0.75)' }),
      stroke: new Stroke({ color: '#ffffff', width: 2 }),
    }),
    text: new Text({
      text: String(size),
      fill: new Fill({ color: '#ffffff' }),
      font: 'bold 13px sans-serif',
    }),
  });
}

/** 将 hex 颜色转为 rgba 字符串 */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.85)`;
}

/** 由 GeoJSON 数据构建 OpenLayers 点要素 */
export function buildFeatures(collection: SpotCollection): Feature<Point>[] {
  return collection.features.map((f) => {
    const [lng, lat] = f.geometry.coordinates;
    const feature = new Feature<Point>({
      geometry: new Point(fromLonLat([lng, lat])),
    });
    feature.set(SPOT_PROPERTIES_KEY, f.properties);
    feature.setId(f.properties.id);
    return feature;
  });
}

export interface SpotsLayerHandle {
  layer: VectorLayer<VectorSource>;
  /** 全量点数据源（供核密度图层共享） */
  rawSource: VectorSource;
  setClusterEnabled: (enabled: boolean) => void;
  /** 更新筛选谓词并触发聚合重算与重绘 */
  setFilter: (filter: SpotFilter) => void;
  /** 替换全部点要素（切换本地 / WFS 数据源时使用） */
  replaceFeatures: (features: Feature<Point>[]) => void;
  getFeaturesAtPixel: (map: Map, pixel: number[]) => Feature[];
}

/** 创建景区点位图层（默认聚合） */
export function createSpotsLayer(features: Feature<Point>[]): SpotsLayerHandle {
  const rawSource = new VectorSource({ features });
  let filter: SpotFilter = () => true;

  const clusterSource = new Cluster({
    distance: CLUSTER_DISTANCE,
    minDistance: CLUSTER_MIN_DISTANCE,
    source: rawSource,
    // 不满足筛选的点返回 null，不参与聚合
    geometryFunction: (feature: Feature<Point>) => {
      const spot = feature.get(SPOT_PROPERTIES_KEY) as SpotProperties | undefined;
      if (spot && filter(spot)) {
        return feature.getGeometry() ?? null;
      }
      return null;
    },
  });

  const layer: VectorLayer<VectorSource> = new VectorLayer<VectorSource>({
    properties: { name: 'ancient-5a' },
    source: clusterSource,
    zIndex: 30,
    style: (feature) => {
      const children = feature.get(CLUSTER_FEATURES_KEY) as Feature[] | undefined;
      if (children && children.length > 1) {
        return createClusterStyle(feature);
      }
      // 聚合模式单点取 children[0]，散点模式取要素自身
      const carrier = children?.[0] ?? feature;
      const spot = carrier.get(SPOT_PROPERTIES_KEY) as SpotProperties | undefined;
      return spot && filter(spot) ? createSpotStyle(spot) : HIDDEN_STYLE;
    },
  });

  const setClusterEnabled = (enabled: boolean): void => {
    layer.setSource(enabled ? clusterSource : rawSource);
  };

  const setFilter = (next: SpotFilter): void => {
    filter = next;
    clusterSource.refresh();
    layer.changed();
  };

  const replaceFeatures = (newFeatures: Feature<Point>[]): void => {
    rawSource.clear();
    rawSource.addFeatures(newFeatures);
    clusterSource.refresh();
  };

  const getFeaturesAtPixel = (map: Map, pixel: number[]): Feature[] => {
    const hit = map.forEachFeatureAtPixel(pixel, (feature) => feature) as
      | Feature
      | undefined;
    if (!hit) {
      return [];
    }
    const children = hit.get(CLUSTER_FEATURES_KEY) as Feature[] | undefined;
    const candidates = children ?? [hit];
    // 再按筛选谓词过滤，避免命中被隐藏的点
    return candidates.filter((f) => {
      const spot = f.get(SPOT_PROPERTIES_KEY) as SpotProperties | undefined;
      return spot ? filter(spot) : true;
    });
  };

  return { layer, rawSource, setClusterEnabled, setFilter, replaceFeatures, getFeaturesAtPixel };
}
