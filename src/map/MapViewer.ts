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
  type BasemapId,
} from '../config/layers';
import { createBasemap } from './baseLayers';
import {
  createSpotsLayer,
  buildFeatures,
  SPOT_PROPERTIES_KEY,
  type SpotsLayerHandle,
} from './spotsLayer';
import { createProvincesLayer, buildProvinceFeatures } from './provincesLayer';
import { createHeatmapLayer, type HeatmapHandle } from './heatmapLayer';
import {
  createSpotsWmsLayer,
  createProvincesWmsLayer,
} from './serviceLayers';
import { createPopup, type PopupHandle } from './popup';
import { filterStore, matchesFilter } from '../state/filterStore';
import type {
  SpotCollection,
  SpotProperties,
  ProvinceCollection,
} from '../types/spot';

// 地图总装：底图、省界、核密度、点位图层、弹窗，以及筛选联动

export class MapViewer {
  private readonly map: Map;
  private readonly basemapGroup: LayerGroup;
  private readonly spotsHandle: SpotsLayerHandle;
  private readonly heatmapHandle: HeatmapHandle;
  private readonly provincesLayer: ReturnType<typeof createProvincesLayer>['layer'];
  private readonly spotsWmsLayer: ReturnType<typeof createSpotsWmsLayer>;
  private readonly provincesWmsLayer: ReturnType<typeof createProvincesWmsLayer>;
  private readonly popup: PopupHandle;

  constructor(
    target: HTMLElement,
    popupElement: HTMLElement,
    spotsData: SpotCollection,
    provincesData: ProvinceCollection,
  ) {
    const spotFeatures = buildFeatures(spotsData);
    this.spotsHandle = createSpotsLayer(spotFeatures);
    this.heatmapHandle = createHeatmapLayer(this.spotsHandle.rawSource);

    const provinceFeatures = buildProvinceFeatures(provincesData);
    const provinceBundle = createProvincesLayer(provinceFeatures);
    this.provincesLayer = provinceBundle.layer;

    this.spotsWmsLayer = createSpotsWmsLayer();
    this.provincesWmsLayer = createProvincesWmsLayer();

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
      layers: [
        this.basemapGroup,
        this.provincesWmsLayer,
        this.provincesLayer,
        this.heatmapHandle.layer,
        this.spotsWmsLayer,
        this.spotsHandle.layer,
      ],
      view: new View({
        // 视图使用 Web Mercator，数据坐标经 fromLonLat 转换
        center: fromLonLat(DEFAULT_CENTER),
        zoom: DEFAULT_ZOOM,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
      }),
    });

    this.bindClick();
    this.bindControls();
    this.bindFilter();
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
    const provincesToggle = document.getElementById('layer-provinces') as HTMLInputElement | null;
    const heatmapToggle = document.getElementById('layer-heatmap') as HTMLInputElement | null;

    spotsToggle?.addEventListener('change', () => {
      this.spotsHandle.layer.setVisible(spotsToggle.checked);
    });
    clusterToggle?.addEventListener('change', () => {
      this.spotsHandle.setClusterEnabled(clusterToggle.checked);
    });
    provincesToggle?.addEventListener('change', () => {
      this.provincesLayer.setVisible(provincesToggle.checked);
    });
    heatmapToggle?.addEventListener('change', () => {
      this.heatmapHandle.setVisible(heatmapToggle.checked);
    });

    const wmsSpotsToggle = document.getElementById('layer-wms-spots') as HTMLInputElement | null;
    const wmsProvincesToggle = document.getElementById('layer-wms-provinces') as HTMLInputElement | null;
    wmsSpotsToggle?.addEventListener('change', () => {
      this.spotsWmsLayer.setVisible(wmsSpotsToggle.checked);
    });
    wmsProvincesToggle?.addEventListener('change', () => {
      this.provincesWmsLayer.setVisible(wmsProvincesToggle.checked);
    });

    document.querySelectorAll<HTMLInputElement>('input[name="basemap"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.switchBasemap(radio.value as BasemapId);
        }
      });
    });
  }

  /** 订阅筛选仓库，驱动点位与核密度联动 */
  private bindFilter(): void {
    const apply = (): void => {
      const state = filterStore.getState();
      const predicate = (spot: SpotProperties): boolean => matchesFilter(spot, state);
      this.spotsHandle.setFilter(predicate);
      this.heatmapHandle.setFilter(predicate);
    };
    apply();
    filterStore.subscribe(apply);
  }

  /** 切换底图（天地图含底图+注记两个图层） */
  private switchBasemap(id: BasemapId): void {
    const layers = createBasemap(id);
    if (layers.length === 0) {
      window.alert('天地图底图需要先在 .env.local 配置 VITE_TIANDITU_KEY（免费申请）');
      return;
    }
    this.basemapGroup.setLayers(new Collection<BaseLayer>(layers));
  }

  /** 经纬度转地图视口像素坐标（供定位与自动化测试使用） */
  getPixelFromLonLat(lng: number, lat: number): [number, number] | undefined {
    const pixel = this.map.getPixelFromCoordinate(fromLonLat([lng, lat]));
    return pixel ? [pixel[0], pixel[1]] : undefined;
  }

  /** 切换点位数据源（本地 GeoJSON / GeoServer WFS），重算筛选与核密度权重 */
  setSpotsData(data: SpotCollection): void {
    const features = buildFeatures(data);
    this.spotsHandle.replaceFeatures(features);
    const state = filterStore.getState();
    const predicate = (spot: SpotProperties): boolean => matchesFilter(spot, state);
    this.spotsHandle.setFilter(predicate);
    this.heatmapHandle.setFilter(predicate);
    this.fitToSpots();
  }

  /** 点位 WMS 瓦片图层显隐 */
  setWmsSpotsVisible(visible: boolean): void {
    this.spotsWmsLayer.setVisible(visible);
  }

  /** 省界 WMS 瓦片图层显隐 */
  setWmsProvincesVisible(visible: boolean): void {
    this.provincesWmsLayer.setVisible(visible);
  }

  /** 适配视野到全部点位（左侧 padding 为侧边栏预留，窄屏自适应） */
  fitToSpots(): void {
    const extent = this.spotsHandle.rawSource.getExtent();
    const size = this.map.getSize();
    if (!extent || !extent.every((v) => Number.isFinite(v)) || !size) {
      return;
    }
    const leftPadding = Math.min(320, Math.round(size[0] * 0.32));
    this.map.getView().fit(extent, {
      padding: [40, 40, 40, leftPadding],
      maxZoom: 12,
    });
  }
}
