-- =====================================================================
-- WENGIS 02：创建 PostGIS 扩展、空间表与统计视图
-- 执行方式（先连接到 wengis 库）：
--   "E:\postgis\bin\psql.exe" -U postgres -h localhost -d wengis -f sql\02_create_schema.sql
-- =====================================================================

-- 1. 空间扩展
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- 2. 业务模式
CREATE SCHEMA IF NOT EXISTS wengis;

-- 3. 古代类 5A 景区点表
CREATE TABLE wengis.ancient_5a (
    id              INTEGER PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    province        VARCHAR(40)  NOT NULL,
    city            VARCHAR(60)  NOT NULL,
    rating_year     SMALLINT     NOT NULL CHECK (rating_year BETWEEN 2007 AND 2026),
    category        VARCHAR(20)  NOT NULL,
    dynasty         VARCHAR(60)  NOT NULL,
    world_heritage  BOOLEAN      NOT NULL DEFAULT FALSE,
    major_site      BOOLEAN      NOT NULL DEFAULT FALSE,
    note            TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 空间列：EPSG:4326（WGS84 经纬度），与前端 GeoJSON 坐标系一致
SELECT AddGeometryColumn('wengis', 'ancient_5a', 'geom', 4326, 'POINT', 2);

COMMENT ON TABLE  wengis.ancient_5a IS '全国古代类 5A 级旅游景区点数据';
COMMENT ON COLUMN wengis.ancient_5a.rating_year    IS '5A 评定年份（复牌年份以 note 标注）';
COMMENT ON COLUMN wengis.ancient_5a.category       IS '文化类别，见 docs/01_数据口径与分类.md';
COMMENT ON COLUMN wengis.ancient_5a.dynasty        IS '始建或主体遗存朝代';
COMMENT ON COLUMN wengis.ancient_5a.world_heritage IS '是否为世界文化遗产（含文化景观、扩展项目）';
COMMENT ON COLUMN wengis.ancient_5a.major_site     IS '核心遗存是否为全国重点文物保护单位';
COMMENT ON COLUMN wengis.ancient_5a.geom           IS '景区点位，EPSG:4326';

-- 4. 省级行政区面表（用于密度面渲染与空间连接，数据后续导入）
CREATE TABLE wengis.provinces (
    adcode  CHAR(6) PRIMARY KEY,
    name    VARCHAR(40) NOT NULL,
    geom    geometry(MultiPolygon, 4326)
);
CREATE INDEX idx_provinces_geom ON wengis.provinces USING GIST (geom);

-- 5. 空间索引与常用查询索引
CREATE INDEX idx_ancient_5a_geom      ON wengis.ancient_5a USING GIST (geom);
CREATE INDEX idx_ancient_5a_category  ON wengis.ancient_5a (category);
CREATE INDEX idx_ancient_5a_province  ON wengis.ancient_5a (province);
CREATE INDEX idx_ancient_5a_dynasty   ON wengis.ancient_5a (dynasty);

-- 6. 统计视图：按省份统计古代类 5A 数量
CREATE OR REPLACE VIEW wengis.v_spots_by_province AS
SELECT province,
       COUNT(*)                                   AS spot_count,
       COUNT(*) FILTER (WHERE world_heritage)     AS heritage_count,
       COUNT(*) FILTER (WHERE major_site)         AS major_site_count
FROM wengis.ancient_5a
GROUP BY province
ORDER BY spot_count DESC;

-- 7. 统计视图：按文化类别统计
CREATE OR REPLACE VIEW wengis.v_spots_by_category AS
SELECT category,
       COUNT(*) AS spot_count
FROM wengis.ancient_5a
GROUP BY category
ORDER BY spot_count DESC;
