-- =====================================================================
-- WENGIS 03：数据库验证查询（数据导入后逐条执行）
-- 连接：psql -U postgres -h localhost -d wengis
-- =====================================================================

-- 1. PostGIS 版本
SELECT PostGIS_full_version();

-- 2. 空间参考是否为 4326
SELECT f_table_name, f_geometry_column, srid, type
FROM geometry_columns
WHERE f_table_schema = 'wengis';

-- 3. 景区总数与类别分布
SELECT COUNT(*) AS total FROM wengis.ancient_5a;
SELECT * FROM wengis.v_spots_by_category;

-- 4. 省份分布
SELECT * FROM wengis.v_spots_by_province;

-- 5. 世界遗产类景区（点 -> WGS84 经纬度）
SELECT name, province, city, dynasty,
       ST_X(geom) AS lng, ST_Y(geom) AS lat
FROM wengis.ancient_5a
WHERE world_heritage = TRUE
ORDER BY dynasty, name;

-- 6. 空间查询示例：某经纬度 200km 范围内的古代类 5A
SELECT name, category, dynasty,
       ROUND(ST_Distance(geom::geography,
                         ST_SetSRID(ST_MakePoint(116.4, 39.9), 4326)::geography) / 1000) AS distance_km
FROM wengis.ancient_5a
WHERE ST_DWithin(geom::geography,
                 ST_SetSRID(ST_MakePoint(116.4, 39.9), 4326)::geography,
                 200000)
ORDER BY distance_km;

-- 7. 导出 GeoJSON（供前端静态加载或 GeoServer 发布前核对）
SELECT jsonb_build_object(
    'type', 'FeatureCollection',
    'features', jsonb_agg(feature)
)
FROM (
    SELECT jsonb_build_object(
        'type', 'Feature',
        'geometry', ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(row) - 'geom'
    ) AS feature
    FROM (
        SELECT id, name, province, city, rating_year AS "ratingYear",
               category, dynasty,
               world_heritage AS "worldHeritage",
               major_site AS "majorSite", note
        FROM wengis.ancient_5a
    ) row
) features;
