# 03 GeoServer 部署与服务发布

## 一、本机现状（2026-10-16 核实）

- GeoServer **2.28.5 已安装**于 `D:\geoserver`，以 `data_dir` 为数据目录，端口 8080。
- Temurin **JDK 21.0.12.1** 已安装于 `D:\java\jdk-21`；GeoServer 以该 JDK 运行，不改变系统 Java。
- **工作区 `wengis` 已发布两个图层**：`wengis:ancient_5a`（点，148 条）与 `wengis:provinces`（面，35 条），均声明 `EPSG:4326`；PostGIS 数据仓库指向 `localhost:5432/wengis`，连接口令以 GeoServer 加密形式存储于 `datastore.xml`。
- **WMS/WFS 端到端已验证**：WFS GetFeature 返回 148 条 GeoJSON；WMS GetCapabilities 含两图层；WMS GetMap 返回 PNG（见 `logs/wms_getmap_*.png`）。
- **CORS 已启用**：见第五节（默认未启用，浏览器跨域会被拦）。
- GeoServer 默认管理员口令未修改。修改口令并限制网络访问前，不要长期保持服务运行或暴露到不可信网络。

## 二、安装（已完成；重装时可参考）

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
$env:GEOSERVER_HOME = "D:\geoserver"
$env:GEOSERVER_DATA_DIR = "D:\geoserver\data_dir"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
Set-Location D:\geoserver\bin
.\startup.bat
```

- 出现 `Started Server @ ... ms` 后，浏览器打开 `http://localhost:8080/geoserver`。
- 默认账号：`admin` / `geoserver`。首次登录必须修改默认密码；不要将 GeoServer 默认凭据用于可从公网访问的部署。
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

### 跨域说明（重要：默认未启用，必须手动打开）

GeoServer 自带的 `webapps/geoserver/WEB-INF/web.xml` 里 CORS 过滤器是**注释掉**的，Jetty 默认**不允许跨域**。前端 `localhost:43200` 请求 `localhost:8080` 的 WFS（XHR）会因缺 `Access-Control-Allow-Origin` 失败，`OPTIONS` 预检返回 403。

启用步骤（本机已执行；重装或换机后需重做）：

1. 编辑 `D:\geoserver\webapps\geoserver\WEB-INF\web.xml`，取消注释 **Jetty 版** `cross-origin` 过滤器（`org.eclipse.jetty.servlets.CrossOriginFilter`），及文件下方的 `cross-origin` `filter-mapping`（`/*`）。关键 `init-param`：`allowedOrigins=*`、`allowedMethods=GET,POST,PUT,DELETE,HEAD,OPTIONS`、`allowedHeaders=*`、`chainPreflight=false`。
2. 重启 GeoServer（`web.xml` 仅在启动时读取）。
3. 验证：带 `Origin` 头请求 WFS 应回显 `Access-Control-Allow-Origin`；`OPTIONS` 预检应返回 200。命令见第六节。

> 生产环境请把 `allowedOrigins=*` 收紧为前端实际域名，不要长期保留通配。

## 六、验证

用 `scripts\geoserver.ps1 start` 启动后（首次约 60 秒），逐项验证：

- WMS Capabilities：`http://localhost:8080/geoserver/wengis/wms?service=WMS&request=GetCapabilities&version=1.3.0` 应包含 `ancient_5a`、`provinces`。
- WFS GetFeature：`http://localhost:8080/geoserver/wengis/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=wengis:ancient_5a&outputFormat=application/json&srsName=EPSG:4326` 应返回 148 个要素，属性列为 snake_case（`rating_year`、`world_heritage` 等，前端 `serviceLayers.ts` 映射为 camelCase）。
- WMS GetMap 出图：`.../wengis/wms?service=WMS&version=1.3.0&request=GetMap&layers=wengis:ancient_5a&styles=&width=600&height=450&crs=EPSG:4326&bbox=18,73,54,135&format=image/png` 应返回 `image/png`。
- CORS 自检（PowerShell）：

  ```powershell
  $base='http://localhost:8080/geoserver'
  (Invoke-WebRequest "$base/wengis/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=wengis:ancient_5a&count=1&outputFormat=application/json" -UseBasicParsing -Headers @{Origin='http://localhost:43200'}).Headers['Access-Control-Allow-Origin']
  ```

  应回显 `http://localhost:43200`。

- 前端端到端（浏览器）：`npm run dev` 起 `:43200`，页面「点位数据源」切到 WFS 应显示"已通过 WFS 加载 148 处点（EPSG:4326）"，勾选 WMS 点/省界图层应发出 `layers=wengis:ancient_5a|provinces` 的 GetMap 请求并返回 PNG。2026-10-16 已用 puppeteer-core + 系统 Chrome 自动化验证 11/11 断言通过（含弹窗、无 pageerror、无 console error）。

## 七、常见问题

1. **启动提示找不到 GeoServer 环境变量**：设置 `GEOSERVER_HOME=D:\geoserver`、`GEOSERVER_DATA_DIR=D:\geoserver\data_dir`，然后重试。项目 `scripts\geoserver.ps1` 已设置这些变量。
2. **Java 25 启动报错（UnsupportedClassVersionError）**：未按第二节设置 JDK 21，确认 `java -version` 输出 21。
3. **8080 端口被占用**：编辑 `start.ini` 或设置 `jetty.http.port=8081` 后重启。
4. **PostGIS Store 连接失败**：检查 PostgreSQL 服务、密码、`wengis` 库与 `wengis` 模式是否存在。
5. **点位偏移**：检查图层 SRS 是否为 EPSG:4326，前端不要再做 GCJ-02 纠偏。
