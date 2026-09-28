import 'ol/ol.css';
import './style.css';
import { MapViewer } from './map/MapViewer';
import { loadSpots } from './data/spotsRepository';
import { bindFilterPanel } from './components/filterPanel';
// Vite 将 GeoJSON 作为静态资源 URL 处理
import spotsUrl from '../data/geojson/ancient_5a.sample.geojson?url';

// 应用入口：加载数据 -> 初始化地图，异常统一兜底显示

async function bootstrap(): Promise<void> {
  const loading = document.getElementById('loading');
  try {
    const data = await loadSpots(spotsUrl);
    const mapElement = document.getElementById('map');
    const popupElement = document.getElementById('popup');
    if (!mapElement || !popupElement) {
      throw new Error('页面 DOM 结构缺失：#map 或 #popup 未找到');
    }
    const viewer = new MapViewer(mapElement, popupElement, data);
    viewer.renderLegend();
    viewer.fitToSpots();
    // 新增筛选地图与统计共享同一结果集合。
    bindFilterPanel(data.features, items => viewer.setSpots(items));
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

void bootstrap();
