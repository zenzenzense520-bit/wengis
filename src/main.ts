import 'ol/ol.css';
import './style.css';
import { MapViewer } from './map/MapViewer';
import { loadSpots, loadProvinces } from './data/spotsRepository';
import { loadWfsSpots, probeGeoServer } from './map/serviceLayers';
import type { SpotCollection, SpotProperties } from './types/spot';
import { createTimeline } from './components/Timeline';
import { createFilterPanel } from './components/FilterPanel';
// Vite 将 GeoJSON 作为静态资源 URL 处理
import spotsUrl from '../data/geojson/ancient_5a_full.geojson?url';
import provincesUrl from '../data/geojson/china_provinces_wgs84.geojson?url';

// 应用入口：加载数据 -> 初始化地图与控件，异常统一兜底显示

async function bootstrap(): Promise<void> {
  const loading = document.getElementById('loading');
  try {
    const [spotsData, provincesData] = await Promise.all([
      loadSpots(spotsUrl),
      loadProvinces(provincesUrl),
    ]);
    const mapElement = document.getElementById('map');
    const popupElement = document.getElementById('popup');
    if (!mapElement || !popupElement) {
      throw new Error('页面 DOM 结构缺失：#map 或 #popup 未找到');
    }

    const viewer = new MapViewer(mapElement, popupElement, spotsData, provincesData);
    viewer.fitToSpots();

    // 提取属性供筛选/时间轴/图表使用
    const spots = spotsData.features.map((f) => f.properties);

    const timelineBar = document.getElementById('timeline-bar');
    const filterPanel = document.getElementById('filter-panel');
    if (timelineBar) {
      createTimeline(timelineBar, spots);
    }
    if (filterPanel) {
      createFilterPanel(filterPanel, spots);
    }
    bindChartsDrawer(spots);
    bindDataSourceSwitch(viewer, spotsData);

    // 开发环境暴露实例，便于浏览器控制台调试与端到端测试（生产构建不暴露）
    if (import.meta.env.DEV) {
      (window as unknown as { __viewer?: MapViewer }).__viewer = viewer;
    }
    if (loading) {
      loading.classList.add('hidden');
    }
  } catch (error) {
    if (loading) {
      loading.textContent = `初始化失败：${error instanceof Error ? error.message : String(error)}`;
      loading.classList.add('error');
    }
  }
}

/** 绑定统计分析抽屉开关；首次打开时按需动态加载 ECharts，减小首屏体积 */
function bindChartsDrawer(spots: SpotProperties[]): void {
  const drawer = document.getElementById('charts-drawer');
  const toggle = document.getElementById('charts-toggle');
  const close = document.getElementById('charts-close');
  const panel = document.getElementById('charts-panel');
  let chartsReady = false;

  toggle?.addEventListener('click', async () => {
    drawer?.classList.add('open');
    if (!chartsReady && panel) {
      chartsReady = true;
      try {
        const { createChartsPanel } = await import('./components/ChartsPanel');
        createChartsPanel(panel, spots);
      } catch (error) {
        chartsReady = false;
        panel.textContent = `统计图加载失败：${error instanceof Error ? error.message : String(error)}`;
      }
    }
  });
  close?.addEventListener('click', () => drawer?.classList.remove('open'));
}

/** 绑定点位数据源切换：本地 GeoJSON / GeoServer WFS，带健康检查与失败回退 */
function bindDataSourceSwitch(viewer: MapViewer, localData: SpotCollection): void {
  const status = document.getElementById('data-source-status');
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="data-source"]');
  let wfsCache: SpotCollection | null = null;
  let switching = false;

  const setStatus = (text: string, kind?: 'ok' | 'err'): void => {
    if (!status) {
      return;
    }
    status.textContent = text;
    status.classList.remove('status-ok', 'status-err');
    if (kind === 'ok') {
      status.classList.add('status-ok');
    } else if (kind === 'err') {
      status.classList.add('status-err');
    }
  };
  const setEnabled = (enabled: boolean): void => {
    radios.forEach((r) => {
      r.disabled = !enabled;
    });
  };
  const selectLocal = (): void => {
    const localRadio = document.querySelector<HTMLInputElement>('input[name="data-source"][value="local"]');
    if (localRadio) {
      localRadio.checked = true;
    }
  };

  radios.forEach((radio) => {
    radio.addEventListener('change', async () => {
      if (switching || !radio.checked) {
        return;
      }
      switching = true;
      setEnabled(false);
      try {
        if (radio.value === 'wfs') {
          setStatus('正在探测 GeoServer…');
          const online = await probeGeoServer();
          if (!online) {
            setStatus('GeoServer 不可达：请先启动服务并发布图层，已保留本地数据。', 'err');
            selectLocal();
            return;
          }
          if (!wfsCache) {
            setStatus('正在从 WFS 加载矢量…');
            wfsCache = await loadWfsSpots();
          }
          viewer.setSpotsData(wfsCache);
          setStatus(`已通过 WFS 加载 ${wfsCache.features.length} 处点（EPSG:4326）。`, 'ok');
        } else {
          viewer.setSpotsData(localData);
          setStatus('已切换为本地 GeoJSON。', 'ok');
        }
      } catch (error) {
        setStatus(`切换失败：${error instanceof Error ? error.message : String(error)}`, 'err');
        selectLocal();
      } finally {
        setEnabled(true);
        switching = false;
      }
    });
  });
}

void bootstrap();
