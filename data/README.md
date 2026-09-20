# 数据目录说明

## 目录结构

```
data/
├── raw/                          # 官方原始名单存档（只读）
│   └── mct_5a_2025.txt           # 全国 358 家 5A 景区名单（文旅部，2025 口径）
├── geojson/                      # 工作数据（GeoJSON，WGS84）
│   └── ancient_5a.sample.geojson # 古代类 5A 样例数据（47 个点，覆盖 12 类）
└── README.md
```

## 数据口径

- 「古代类」筛选标准、12 个类别定义、字段规范、坐标规范：见 `../docs/01_数据口径与分类.md`。
- 全部坐标统一 **WGS84（EPSG:4326）**；高德/百度坐标必须先纠偏。
- 样例坐标为公开资料整理的近似值（约 1km 精度），正式数据须经天地图/OSM 核对。

## 校验

```powershell
npm run validate-data
```

校验内容：GeoJSON 结构、必填字段、类别枚举、年份范围、中国范围坐标、id 唯一性。

## 入库

- PostGIS 建库建表：`../sql/` 下 01、02 脚本（见 `../docs/02_PostGIS部署.md`）。
- GeoJSON 转 INSERT（兜底通道）：`node scripts/geojson2sql.mjs`。
