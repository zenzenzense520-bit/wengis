-- =====================================================================
-- WENGIS 01：创建数据库
-- 适用环境：PostgreSQL 18 + PostGIS 3.6+（PG18 需 PostGIS 3.6 及以上）
-- 执行方式（在操作系统命令行，不能在数据库内执行 CREATE DATABASE）：
--   "E:\postgis\bin\psql.exe" -U postgres -h localhost -f sql\01_create_db.sql
-- 注意：CREATE DATABASE 不可在事务块中执行，psql -f 单语句执行即可
-- =====================================================================

CREATE DATABASE wengis
  WITH ENCODING = 'UTF8'
        LC_COLLATE = 'C'
        LC_CTYPE = 'C'
        TEMPLATE = template0;

COMMENT ON DATABASE wengis IS 'WENGIS 文脉地理信息系统：全国古代类 5A 级旅游景区数据库';
