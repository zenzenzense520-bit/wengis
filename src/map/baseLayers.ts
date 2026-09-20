import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { TIANDITU_KEY, type BasemapId } from '../config/layers';

// 底图工厂：所有在线底图均为 EPSG:3857 切片、WGS84/CGCS2000 基准，与项目数据无坐标偏移
// 注意：高德/百度/腾讯为 GCJ-02/BD-09 坐标，禁止与本项目 WGS84 数据混用
// 天地图由「底图 + 注记」两个图层叠加组成（vec/cva、img/cia），缺注记则无地名

/** 构造天地图 WMTS 切片图层 */
function createTiandituLayer(layerType: string): TileLayer<XYZ> {
  return new TileLayer({
    properties: { name: `tdt-${layerType}` },
    source: new XYZ({
      url: `https://t{0-7}.tianditu.gov.cn/${layerType}_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layerType}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
      attributions: '天地图 国家地理信息公共服务平台',
    }),
  });
}

/** ArcGIS World Street Map（Esri 免费瓦片，需署名，英文标注） */
function createArcGISStreetLayer(): TileLayer<XYZ> {
  return new TileLayer({
    properties: { name: 'arcgis-street' },
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attributions: 'Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS',
      maxZoom: 19,
    }),
  });
}

/** ArcGIS World Topo Map（地形晕渲，适合宏观文化格局展示） */
function createArcGISTopoLayer(): TileLayer<XYZ> {
  return new TileLayer({
    properties: { name: 'arcgis-topo' },
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      attributions: 'Tiles © Esri — Esri, HERE, Garmin, USGS, Intermap',
      maxZoom: 19,
    }),
  });
}

/** OpenStreetMap 标准底图（开源 ODbL，官方源国内可能不可达） */
function createOsmLayer(): TileLayer<OSM> {
  return new TileLayer({
    properties: { name: 'osm' },
    source: new OSM(),
  });
}

/**
 * 按标识创建底图图层组（天地图返回底图+注记两层）
 * 未配置天地图 key 时返回空数组，调用方负责提示
 */
export function createBasemap(id: BasemapId): TileLayer<XYZ | OSM>[] {
  switch (id) {
    case 'tdt-vec':
      return TIANDITU_KEY ? [createTiandituLayer('vec'), createTiandituLayer('cva')] : [];
    case 'tdt-img':
      return TIANDITU_KEY ? [createTiandituLayer('img'), createTiandituLayer('cia')] : [];
    case 'arcgis-street':
      return [createArcGISStreetLayer()];
    case 'arcgis-topo':
      return [createArcGISTopoLayer()];
    case 'osm':
      return [createOsmLayer()];
    default:
      return [createArcGISStreetLayer()];
  }
}
