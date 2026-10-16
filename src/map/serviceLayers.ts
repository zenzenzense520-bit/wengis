import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { GEOSERVER_BASE_URL, WMS_URL, WFS_URL, WMS_SPOTS_LAYER, WMS_PROVINCES_LAYER } from '../config/layers';
import type {
  SpotCollection,
  SpotFeature,
  SpotProperties,
  CoordSource,
  CoordConfidence,
} from '../types/spot';

// GeoServer OGC 服务接入：WMS 瓦片图层 + WFS 矢量数据（字段映射为前端 camelCase）

/** WFS 返回的原始要素（PostGIS 列名为 snake_case） */
interface WfsRawFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: {
    id: number;
    name: string;
    province: string;
    city: string;
    rating_year: number;
    category: string;
    dynasty: string;
    dynasty_group: string;
    world_heritage: boolean;
    major_site: boolean;
    note?: string | null;
    coord_source?: string | null;
    geocode_confidence?: string | null;
  };
}

interface WfsRawCollection {
  type: 'FeatureCollection';
  features: WfsRawFeature[];
}

/** 构造 WFS GetFeature（GeoJSON）请求 URL */
export function buildWfsUrl(typeName: string, count?: number): string {
  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeNames: typeName,
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
  });
  if (count !== undefined) {
    params.set('count', String(count));
  }
  return `${WFS_URL}?${params.toString()}`;
}

/** 探测 GeoServer 是否可用（WFS 取 1 条，成功即视为在线） */
export async function probeGeoServer(timeoutMs = 6000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(buildWfsUrl(WMS_SPOTS_LAYER, 1), { signal: controller.signal });
    clearTimeout(timer);
    return response.ok;
  } catch {
    return false;
  }
}

/** WFS 原始属性映射为前端 SpotProperties */
function mapProperties(raw: WfsRawFeature['properties']): SpotProperties {
  return {
    id: raw.id,
    name: raw.name,
    province: raw.province,
    city: raw.city,
    ratingYear: raw.rating_year,
    category: raw.category as SpotProperties['category'],
    dynasty: raw.dynasty,
    dynastyGroup: raw.dynasty_group as SpotProperties['dynastyGroup'],
    worldHeritage: raw.world_heritage,
    majorSite: raw.major_site,
    note: raw.note ?? undefined,
    coordSource: (raw.coord_source ?? undefined) as CoordSource | undefined,
    geocodeConfidence: (raw.geocode_confidence ?? undefined) as CoordConfidence | undefined,
  };
}

/** 从 GeoServer WFS 加载景区点并转换为前端集合 */
export async function loadWfsSpots(): Promise<SpotCollection> {
  let response: Response;
  try {
    response = await fetch(buildWfsUrl(WMS_SPOTS_LAYER));
  } catch (error) {
    throw new Error(`WFS 服务不可达（${GEOSERVER_BASE_URL}），请确认 GeoServer 已启动并发布图层`, { cause: error });
  }
  if (!response.ok) {
    throw new Error(`WFS 请求失败：HTTP ${response.status} ${response.statusText}`);
  }
  const json: unknown = await response.json();
  if (typeof json !== 'object' || json === null) {
    throw new Error('WFS 数据格式错误：根节点不是对象');
  }
  const raw = json as WfsRawCollection;
  if (raw.type !== 'FeatureCollection' || !Array.isArray(raw.features)) {
    throw new Error('WFS 数据格式错误：不是 FeatureCollection');
  }
  const features: SpotFeature[] = raw.features.map((f) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: f.geometry.coordinates },
    properties: mapProperties(f.properties),
  }));
  return { type: 'FeatureCollection', features };
}

/** 创建 GeoServer WMS 瓦片图层（服务端按 SLD 渲染） */
export function createWmsLayer(layerName: string): TileLayer<TileWMS> {
  return new TileLayer({
    properties: { name: `wms-${layerName}` },
    source: new TileWMS({
      url: WMS_URL,
      params: { LAYERS: layerName, TILED: true, FORMAT: 'image/png', TRANSPARENT: true },
      serverType: 'geoserver',
      transition: 0,
    }),
    visible: false,
  });
}

/** 点位 WMS 图层（按类别 SLD 着色） */
export function createSpotsWmsLayer(): TileLayer<TileWMS> {
  const layer = createWmsLayer(WMS_SPOTS_LAYER);
  layer.setZIndex(25);
  return layer;
}

/** 省界 WMS 图层 */
export function createProvincesWmsLayer(): TileLayer<TileWMS> {
  const layer = createWmsLayer(WMS_PROVINCES_LAYER);
  layer.setZIndex(4);
  return layer;
}
