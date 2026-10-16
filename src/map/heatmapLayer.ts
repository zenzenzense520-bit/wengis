import Heatmap from 'ol/layer/Heatmap';
import type { FeatureLike } from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import type { SpotProperties } from '../types/spot';
import { SPOT_PROPERTIES_KEY, type SpotFilter } from './spotsLayer';
import {
  HEATMAP_RADIUS,
  HEATMAP_BLUR,
  HEATMAP_WEIGHT_HERITAGE,
  HEATMAP_WEIGHT_NORMAL,
} from '../config/layers';

// 核密度热力图层：客户端核密度近似（OpenLayers Heatmap），世界遗产权重更高
// 与点位图层共享同一 VectorSource，筛选时按权重置 0 排除

export interface HeatmapHandle {
  layer: Heatmap;
  /** 更新筛选谓词（不匹配的点权重置 0） */
  setFilter: (filter: SpotFilter) => void;
  setVisible: (visible: boolean) => void;
}

/** 由点位数据源创建核密度热力图层（默认隐藏，由图层开关控制） */
export function createHeatmapLayer(source: VectorSource): HeatmapHandle {
  let filter: SpotFilter = () => true;

  const layer = new Heatmap({
    properties: { name: 'heatmap' },
    source,
    radius: HEATMAP_RADIUS,
    blur: HEATMAP_BLUR,
    weight: (feature: FeatureLike) => {
      const spot = feature.get(SPOT_PROPERTIES_KEY) as SpotProperties | undefined;
      if (!spot || !filter(spot)) {
        return 0;
      }
      return spot.worldHeritage ? HEATMAP_WEIGHT_HERITAGE : HEATMAP_WEIGHT_NORMAL;
    },
    zIndex: 20,
  });
  layer.setVisible(false);

  return {
    layer,
    setFilter(next: SpotFilter) {
      filter = next;
      layer.changed();
    },
    setVisible(visible: boolean) {
      layer.setVisible(visible);
    },
  };
}
