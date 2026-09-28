import Map from 'ol/Map';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import Collection from 'ol/Collection';
import type BaseLayer from 'ol/layer/Base';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  DEFAULT_BASEMAP,
  CATEGORY_COLORS,
  type BasemapId,
} from '../config/layers';
import { createBasemap } from './baseLayers';
import {
  createSpotsLayer,
  buildFeatures,
  SPOT_PROPERTIES_KEY,
  type SpotsLayerHandle,
} from './spotsLayer';
import { createPopup, type PopupHandle } from './popup';
import type { SpotCollection, SpotFeature, SpotProperties, SpotCategory } from '../types/spot';

// 地图总装：底图、点位图层、弹窗、图层开关与图例

export class MapViewer {
  private readonly map: Map;
  private readonly basemapGroup: LayerGroup;
  private readonly spotsHandle: SpotsLayerHandle;
  private readonly popup: PopupHandle;
  private activeBasemap: BasemapId = DEFAULT_BASEMAP;

  constructor(target: HTMLElement, popupElement: HTMLElement, data: SpotCollection) {
    const features = buildFeatures(data);
    this.spotsHandle = createSpotsLayer(features);
    this.popup = createPopup(popupElement);

    const initialBasemapLayers = createBasemap(DEFAULT_BASEMAP);
    if (initialBasemapLayers.length === 0) {
      throw new Error('默认底图初始化失败：请检查天地图 key 配置');
    }
    this.basemapGroup = new LayerGroup({ layers: initialBasemapLayers });

    this.map = new Map({
      target,
      controls: defaultControls({ zoom: true, attribution: true, rotate: false }),
      overlays: [this.popup.overlay],
      layers: [this.basemapGroup, this.spotsHandle.layer],
      view: new View({
        // 视图使用 Web Mercator（OSM 原生网格），数据坐标经 fromLonLat 转换
        center: fromLonLat(DEFAULT_CENTER),
        zoom: DEFAULT_ZOOM,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
      }),
    });

    this.bindClick();
    this.bindControls();
    this.syncBasemapControls();
  }

  /** 点击点位：单点弹窗，聚合点放大 */
  private bindClick(): void {
    this.map.on('singleclick', (event) => {
      const hits = this.spotsHandle.getFeaturesAtPixel(this.map, event.pixel);
      if (hits.length === 0) {
        this.popup.hide();
        return;
      }
      if (hits.length === 1) {
        const spot = hits[0].get(SPOT_PROPERTIES_KEY) as SpotProperties | undefined;
        if (spot) {
          this.popup.show(spot, event.coordinate);
        }
        return;
      }
      this.popup.hide();
      const view = this.map.getView();
      view.animate({ zoom: (view.getZoom() ?? DEFAULT_ZOOM) + 1, center: event.coordinate });
    });
  }

  /** 绑定侧边栏图层开关 */
  private bindControls(): void {
    const spotsToggle = document.getElementById('layer-spots') as HTMLInputElement | null;
    const clusterToggle = document.getElementById('layer-cluster') as HTMLInputElement | null;
    spotsToggle?.addEventListener('change', () => {
      this.spotsHandle.layer.setVisible(spotsToggle.checked);
    });
    clusterToggle?.addEventListener('change', () => {
      this.spotsHandle.setClusterEnabled(clusterToggle.checked);
    });
    document.querySelectorAll<HTMLInputElement>('input[name="basemap"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.switchBasemap(radio.value as BasemapId);
        }
      });
    });
  }

  /** 切换底图（天地图含底图+注记两个图层） */
  private switchBasemap(id: BasemapId): void {
    const layers = createBasemap(id);
    if (layers.length === 0) {
      this.syncBasemapControls();
      window.alert('天地图底图需要先在 .env.local 配置 VITE_TIANDITU_KEY（免费申请）');
      return;
    }
    this.basemapGroup.setLayers(new Collection<BaseLayer>(layers));
    this.activeBasemap = id;
    this.syncBasemapControls();
  }

  // 修复缺少 key 时底图实际状态与单选按钮不一致。
  private syncBasemapControls(): void {
    document.querySelectorAll<HTMLInputElement>('input[name="basemap"]').forEach(radio => {
      radio.checked = radio.value === this.activeBasemap;
    });
  }

  setSpots(items: SpotFeature[]): void {
    this.popup.hide();
    this.spotsHandle.setFeatures(buildFeatures({ type: 'FeatureCollection', features: items }));
    if (items.length) this.fitToSpots();
  }

  /** 渲染类别图例 */
  renderLegend(): void {
    const legend = document.getElementById('legend');
    if (!legend) {
      return;
    }
    const categories = Object.keys(CATEGORY_COLORS) as SpotCategory[];
    legend.innerHTML = categories
      .map(
        (category) => `
        <div class="legend-item">
          <span class="legend-dot" style="background:${CATEGORY_COLORS[category]}"></span>
          <span>${category}</span>
        </div>`,
      )
      .join('');
  }

  /** 经纬度转地图视口像素坐标（供定位与自动化测试使用） */
  getPixelFromLonLat(lng: number, lat: number): [number, number] | undefined {
    const pixel = this.map.getPixelFromCoordinate(fromLonLat([lng, lat]));
    return pixel ? [pixel[0], pixel[1]] : undefined;
  }

  /** 适配视野到全部点位 */
  fitToSpots(): void {
    const source = this.spotsHandle.layer.getSource();
    const extent = source?.getExtent();
    if (extent && extent.every((v) => Number.isFinite(v))) {
      // 地图本身已排除侧栏；按视口缩小留白，避免窄屏点位被挤出视野。
      const padding = Math.min(40, (this.map.getSize()?.[0] ?? 240) / 6);
      this.map.getView().fit(extent, { padding: [padding, padding, padding, padding], maxZoom: 12 });
    }
  }
}
