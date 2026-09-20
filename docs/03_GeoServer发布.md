# 03 GeoServer 部署与服务发布

## 一、本机现状（2026-09-20 已核实）

- GeoServer **未安装**（D/E 盘及常见目录均未找到）。
- 本机 Java 为 **25.0.2**，而 GeoServer 官方要求 **Java 17 或 21**（Java 25 不支持，启动会失败）。
- 解决办法：额外下载一份**免安装版 JDK 21**，仅让 GeoServer 使用，不影响系统 Java 25。

## 二、安装（免安装版，全部放 D 盘）

### 1. JDK 21（Temurin，免安装 zip）

- 下载页：`https://adoptium.net/temurin/releases/?version=21&os=windows&arch=x64&package=jdk`
- 选择 `.zip`（不是 .msi），解压到 `D:\java\jdk-21`。
- 确认存在 `D:\java\jdk-21\bin\java.exe`。

### 2. GeoServer 2.28.5（平台二进制版）

- 下载页：`https://geoserver.org/download/` → 选择 **2.28.5 Maintenance** → **Platform Independent Binary**（`geoserver-2.28.5-bin.zip`）。
- 解压到 `D:\geoserver`，确认存在 `D:\geoserver\start.jar` 与 `bin\startup.bat`。
- 说明：2.28.x 教学资料最多、与本课程 WMS/WFS 流程完全一致；3.0 为新主版本，操作基本相同。

### 3. 启动（指定 JDK 21）

在 PowerShell 中：

```powershell
$env:JAVA_HOME = "D:\java\jdk-21"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
Set-Location D:\geoserver\bin
.\startup.bat
```

- 出现 `Started Server @ ... ms` 后，浏览器打开 `http://localhost:8080/geoserver`。
- 默认账号：`admin` / `geoserver`（首次登录后请修改）。
- 停止：运行 `bin\shutdown.bat`，或直接关闭启动窗口。

## 三、发布 PostGIS 图层

前置：已按 `02_PostGIS部署.md` 完成建库与数据导入。

1. **工作区（Workspace）**：Data → Workspaces → Add new，名称 `wengis`，URI 填 `http://wengis.local`。
2. **数据仓库（Store）**：Data → Stores → Add new Store → **PostGIS**：
   - host `localhost`，port `5432`，database `wengis`，schema `wengis`，user `postgres`，填入密码。
3. **图层（Layer）**：Store 保存后点 Publish，选择 `ancient_5a`：
   - Native SRS 与 Declared SRS 填 `EPSG:4326`；
   - Bounding Boxes 点「Compute from data / Compute from native bounds」；
   - 发布。
4. 用同样方法发布 `provinces` 面图层（省界数据导入后）。

## 四、SLD 样式（按文化类别着色）

1. Styles → Add a new style，名称 `ancient_5a_category`，格式 SLD。
2. 编写分类规则（`category` 字段 = 宫殿坛庙/古典园林/…，颜色与前端 `src/config/layers.ts` 保持一致）。
3. Layer → Publishing 选项卡将 Default Style 设为该样式。

## 五、OpenLayers 接入（前端代码预留）

### WMS 瓦片（面图层、大数据量）

```ts
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

const wmsLayer = new TileLayer({
  source: new TileWMS({
    url: 'http://localhost:8080/geoserver/wengis/wms',
    params: { LAYERS: 'wengis:ancient_5a', TILED: true },
    serverType: 'geoserver',
  }),
});
```

### WFS 矢量（可点击查询，本项目点图层推荐）

```ts
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import WFS from 'ol/format/WFS';

const wfsLayer = new VectorLayer({
  source: new VectorSource({
    format: new WFS(),
    url: 'http://localhost:8080/geoserver/wengis/wfs?service=WFS&' +
      'version=2.0.0&request=GetFeature&typeNames=wengis.ancient_5a&' +
      'outputFormat=application/json&srsName=EPSG:4326',
  }),
});
```

### 跨域说明

GeoServer 自带 Jetty 默认允许 CORS；如浏览器报跨域错误，在 `webapps/geoserver/WEB-INF/web.xml` 启用 `CrossOriginFilter`（文档第 13 节）。

## 六、验证

- WMS Capabilities：`http://localhost:8080/geoserver/wms?service=WMS&request=GetCapabilities`
- WFS GetFeature：浏览器直接访问上面的 WFS URL，应返回 GeoJSON 数据。
- 在 GeoServer Layer Preview 中选择「OpenLayers」预览，点位落在正确位置即成功。

## 七、常见问题

1. **Java 25 启动报错（UnsupportedClassVersionError）**：未按第二节设置 JDK 21，确认 `java -version` 输出 21。
2. **8080 端口被占用**：编辑 `start.ini` 或设置 `jetty.http.port=8081` 后重启。
3. **PostGIS Store 连接失败**：检查 PostgreSQL 服务、密码、`wengis` 库与 `wengis` 模式是否存在。
4. **点位偏移**：检查图层 SRS 是否为 EPSG:4326，前端不要再做 GCJ-02 纠偏。
