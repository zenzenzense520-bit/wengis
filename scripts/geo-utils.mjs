// 地理坐标工具：GCJ-02(火星) <-> WGS84 转换、GeoJSON 几何纠偏、点面包含
// 数据铁律：项目统一 WGS84/EPSG:4326；DataV 省界为 GCJ-02，落库/前端前必须纠偏
const PI = Math.PI;
const A = 6378245.0; // 长半轴
const EE = 0.00669342162296594323; // 偏心率平方

function outOfChina(lng, lat) {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
}
function transformLat(lng, lat) {
  let ret = -100 + 2 * lng + 3 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20 * Math.sin(6 * lng * PI) + 20 * Math.sin(2 * lng * PI)) * 2) / 3;
  ret += ((20 * Math.sin(lat * PI) + 40 * Math.sin((lat / 3) * PI)) * 2) / 3;
  ret += ((160 * Math.sin((lat / 12) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2) / 3;
  return ret;
}
function transformLng(lng, lat) {
  let ret = 300 + lng + 2 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20 * Math.sin(6 * lng * PI) + 20 * Math.sin(2 * lng * PI)) * 2) / 3;
  ret += ((20 * Math.sin(lng * PI) + 40 * Math.sin((lng / 3) * PI)) * 2) / 3;
  ret += ((150 * Math.sin((lng / 12) * PI) + 300 * Math.sin((lng / 30) * PI)) * 2) / 3;
  return ret;
}
// GCJ-02 坐标相对 WGS84 的偏移
function delta(lng, lat) {
  let dLat = transformLat(lng - 105, lat - 35);
  let dLng = transformLng(lng - 105, lat - 35);
  const radLat = (lat / 180) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI);
  dLng = (dLng * 180) / ((A / sqrtMagic) * Math.cos(radLat) * PI);
  return [dLng, dLat];
}
// WGS84 -> GCJ-02
export function wgs84ToGcj02(lng, lat) {
  if (outOfChina(lng, lat)) return [lng, lat];
  const [dLng, dLat] = delta(lng, lat);
  return [lng + dLng, lat + dLat];
}
// GCJ-02 -> WGS84（近似反算，误差 1~2m，足够本项目）
export function gcj02ToWgs84(lng, lat) {
  if (outOfChina(lng, lat)) return [lng, lat];
  const [dLng, dLat] = delta(lng, lat);
  return [lng - dLng, lat - dLat];
}

// 遍历 GeoJSON 坐标，对每个 [lng,lat] 应用 fn
function mapCoords(coords, fn, depth) {
  if (depth === 0) return fn(coords);
  return coords.map((c) => mapCoords(c, fn, depth - 1));
}
const GEOM_DEPTH = { Point: 0, MultiPoint: 1, LineString: 1, MultiLineString: 2, Polygon: 2, MultiPolygon: 3 };
// 对整个 GeoJSON FeatureCollection/Feature/Geometry 做 GCJ-02 -> WGS84
export function geojsonGcjToWgs(geojson) {
  const conv = (geom) => {
    if (!geom || geom.type === 'GeometryCollection') return geom;
    const d = GEOM_DEPTH[geom.type];
    if (d === undefined) return geom;
    return { ...geom, coordinates: mapCoords(geom.coordinates, (ll) => gcj02ToWgs84(ll[0], ll[1]), d) };
  };
  if (geojson.type === 'FeatureCollection') {
    return { ...geojson, features: geojson.features.map((f) => ({ ...f, geometry: conv(f.geometry) })) };
  }
  if (geojson.type === 'Feature') return { ...geojson, geometry: conv(geojson.geometry) };
  return conv(geojson);
}

// 射线法判断点是否在多边形环内（ring: [[lng,lat],...]）
function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
// 点是否在 Polygon/MultiPolygon 几何内
export function pointInGeometry(lng, lat, geom) {
  if (!geom) return false;
  if (geom.type === 'Polygon') {
    return geom.coordinates.some((ring, idx) => pointInRing(lng, lat, ring) === (idx === 0));
  }
  if (geom.type === 'MultiPolygon') {
    return geom.coordinates.some((poly) => poly.some((ring, idx) => pointInRing(lng, lat, ring) === (idx === 0)));
  }
  return false;
}
