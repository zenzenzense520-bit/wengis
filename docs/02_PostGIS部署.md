# 02 PostGIS 部署与数据入库

## 一、本机现状（2026-09-20 已核实）

| 组件 | 状态 | 位置 |
|---|---|---|
| PostgreSQL 18 | 已安装，服务 `postgresql-x64-18` 运行中 | `E:\postgis`（数据目录 `E:\postgis\data`） |
| psql | 已安装但未加入 PATH | `E:\postgis\bin\psql.exe` |
| **PostGIS 扩展** | **未安装**（`share/extension` 中无 postgis 控制文件，`lib` 中无 postgis.dll） | — |
| 认证方式 | scram-sha-256，需要 postgres 密码 | — |

> 注意：PostgreSQL 18 必须搭配 **PostGIS 3.6 或以上**（低版本不支持 PG18）。

## 二、安装 PostGIS 3.6+（二选一）

### 方式 A：EnterpriseDB 官方 Windows 构建（推荐）

1. 浏览器打开 `https://download.osgeo.org/postgis/windows/pg18/`，下载 `postgis-bundle-pg18x64-setup.exe`（下载到 D 盘，如 `D:\Downloads`）。
2. 运行安装程序，**PostGIS 安装目录选择 `E:\postgis`**（与现有 PostgreSQL 一致）。
3. 安装完成后确认文件存在：
   - `E:\postgis\share\extension\postgis.control`
   - `E:\postgis\lib\postgis-3.dll`
4. 安装包自带 GDAL（`ogr2ogr`）与 `shp2pgsql`，位于 `E:\postgis\bin`。

### 方式 B：EDB StackBuilder（如已随 PG 安装）

启动 Application StackBuilder → 选择 PostgreSQL 18 → 勾选 Spatial Extensions → PostGIS Bundle。

## 三、建库与建表

在 PowerShell 中执行（会提示输入 postgres 密码）：

```powershell
$env:PGPASSWORD = "你的postgres密码"
$psql = "E:\postgis\bin\psql.exe"
& $psql -U postgres -h localhost -f D:\webgis\sql\01_create_db.sql
& $psql -U postgres -h localhost -d wengis -f D:\webgis\sql\02_create_schema.sql
```

成功标志：`CREATE EXTENSION`、`CREATE TABLE`、`AddGeometryColumn` 等均无 ERROR。

## 四、GeoJSON 数据入库（二选一）

### 方式 A：ogr2ogr（推荐，课程标准工具链）

PostGIS bundle 安装后，`E:\postgis\bin` 下有 ogr2ogr：

```powershell
& "E:\postgis\bin\ogr2ogr.exe" -f PostgreSQL `
  "PG:host=localhost port=5432 dbname=wengis user=postgres password=你的密码" `
  -nln wengis.ancient_5a_import -nlt POINT -lco GEOMETRY_NAME=geom `
  -lco FID=gid -overwrite -s_srs EPSG:4326 -t_srs EPSG:4326 `
  D:\webgis\data\geojson\ancient_5a.sample.geojson
```

导入表属性名为驼峰（ratingYear 等），再用 SQL 转换到正式表：

```sql
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty,
   world_heritage, major_site, note, geom)
SELECT "id", "name", "province", "city", "ratingYear", "category", "dynasty",
       "worldHeritage", "majorSite", "note", geom
FROM wengis.ancient_5a_import
ON CONFLICT (id) DO NOTHING;
```

### 方式 B：Node 生成 INSERT（无 GDAL 时的兜底）

```powershell
Set-Location D:\webgis
node scripts/geojson2sql.mjs
$env:PGPASSWORD = "你的postgres密码"
& "E:\postgis\bin\psql.exe" -U postgres -h localhost -d wengis -f sql\04_insert_ancient_5a.generated.sql
```

## 五、验证

```powershell
& "E:\postgis\bin\psql.exe" -U postgres -h localhost -d wengis -f D:\webgis\sql\03_verify.sql
```

应看到：PostGIS 版本、47 条样例记录、类别分布与 `data/geojson` 校验结果一致。

## 六、省界面数据入库（后续）

```powershell
# 下载全国省级行政区 GeoJSON（WGS84）后
& "E:\postgis\bin\ogr2ogr.exe" -f PostgreSQL `
  "PG:host=localhost port=5432 dbname=wengis user=postgres password=你的密码" `
  -nln wengis.provinces -nlt MULTIPOLYGON -lco GEOMETRY_NAME=geom `
  -overwrite -s_srs EPSG:4326 -t_srs EPSG:4326 `
  data\geojson\china_provinces.geojson
```

## 七、常见问题

1. **`could not open extension control file postgis.control`**：PostGIS 未安装或安装目录选错，重装并指向 `E:\postgis`。
2. **密码认证失败**：`pg_hba.conf` 为 scram-sha-256，必须用安装时设置的 postgres 密码；忘记密码需改 `pg_hba.conf` 临时为 trust 后重置。
3. **PG18 装不上 PostGIS**：确认下载的是 pg18 目录下的 bundle；PostGIS 3.5 及以下不支持 PG18。
