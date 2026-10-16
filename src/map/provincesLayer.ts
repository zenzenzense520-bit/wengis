import type Feature from 'ol/Feature';
import type { FeatureLike } from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import type { ProvinceCollection } from '../types/spot';
import { PROVINCE_FILL, PROVINCE_STROKE, PROVINCE_STROKE_WIDTH } from '../config/layers';

// 省级行政区面图层：WGS84 省界（含九段线），浅色填充衬托点位

/** 省界要素在 OL 要素上的属性键名 */
export const PROVINCE_NAME_KEY = 'name';
export const PROVINCE_ADCODE_KEY = 'adcode';
/** 九段线要素的 adcode */
const NINE_DASH_LINE_ADCODE = '100000_JD';

/** 普通省份：浅色填充 + 边界 */
function createProvinceFillStyle(): Style {
  return new Style({
    fill: new Fill({ color: PROVINCE_FILL }),
    stroke: new Stroke({ color: PROVINCE_STROKE, width: PROVINCE_STROKE_WIDTH }),
  });
}

/** 九段线：透明填充 + 虚线描边（南海断续线） */
function createNineDashStyle(): Style {
  return new Style({
    fill: new Fill({ color: 'rgba(0,0,0,0)' }),
    stroke: new Stroke({ color: 'rgba(120,100,80,0.9)', width: 1.2, lineDash: [5, 3] }),
  });
}

/** 按要素类型返回样式 */
function provinceStyle(feature: FeatureLike): Style {
  return feature.get(PROVINCE_ADCODE_KEY) === NINE_DASH_LINE_ADCODE
    ? createNineDashStyle()
    : createProvinceFillStyle();
}

/** 由 WGS84 省界 GeoJSON 构建 OL 面要素（重投影到 Web Mercator） */
export function buildProvinceFeatures(collection: ProvinceCollection): Feature[] {
  const reader = new GeoJSON();
  return reader.readFeatures(collection, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });
}

/** 创建省界面图层 */
export function createProvincesLayer(features: Feature[]): {
  layer: VectorLayer<VectorSource>;
  source: VectorSource;
} {
  const source = new VectorSource({ features });
  const layer = new VectorLayer<VectorSource>({
    properties: { name: 'provinces' },
    source,
    style: provinceStyle,
    zIndex: 5,
  });
  return { layer, source };
}
