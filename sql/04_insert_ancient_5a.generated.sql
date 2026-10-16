-- 本文件由 scripts/geojson2sql.mjs 自动生成，请勿手工编辑
-- 数据源：geojson/ancient_5a_full.geojson，共 148 点
-- 执行：psql -U postgres -h localhost -d wengis -f sql/04_insert_ancient_5a.generated.sql
SET client_encoding = 'UTF8';
BEGIN;
TRUNCATE wengis.ancient_5a;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (1, '故宫博物院', '北京市', '北京市', 2007,
   '宫殿坛庙', '明、清', '明',
   true, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(116.397, 39.918), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (2, '天坛公园', '北京市', '北京市', 2007,
   '宫殿坛庙', '明、清', '明',
   true, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(116.4122, 39.8823), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (3, '颐和园', '北京市', '北京市', 2007,
   '古典园林', '清', '清',
   true, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(116.274, 39.999), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (4, '恭王府景区', '北京市', '北京市', 2012,
   '古典园林', '清', '清',
   false, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(116.3862, 39.9372), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (5, '圆明园遗址公园景区', '北京市', '北京市', 2019,
   '古典园林', '清', '清',
   false, true,
   'tianditu', 'high', '清代皇家园林遗址，1860年遭焚毁后为遗址公园',
   ST_SetSRID(ST_MakePoint(116.301928, 40.008486), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (6, '明十三陵景区', '北京市', '北京市', 2011,
   '陵寝墓葬', '明', '明',
   true, true,
   'sample', 'high', '明清皇家陵寝世界遗产组成部分，坐标取长陵',
   ST_SetSRID(ST_MakePoint(116.245, 40.256), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (7, '八达岭—慕田峪长城旅游区', '北京市', '北京市', 2007,
   '关隘长城', '明', '明',
   true, true,
   'sample', 'high', '长城世界遗产，坐标取八达岭',
   ST_SetSRID(ST_MakePoint(116.0243, 40.3593), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (8, '北京（通州）大运河文化旅游景区', '北京市', '北京市', 2024,
   '复合人文', '隋至清', '隋唐',
   true, true,
   'tianditu', 'high', '大运河世界遗产通州段，坐标取燃灯佛舍利塔',
   ST_SetSRID(ST_MakePoint(116.681695, 39.906777), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (9, '盘山风景名胜区', '天津市', '天津市', 2007,
   '历史名山', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '京东佛教名山，盘山石刻为全国重点文保，自然与人文复合',
   ST_SetSRID(ST_MakePoint(117.26842, 40.0919), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (10, '承德市承德避暑山庄及周围寺庙景区', '河北省', '承德市', 2007,
   '古典园林', '清', '清',
   true, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(117.939, 40.999), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (11, '唐山市清东陵景区', '河北省', '唐山市', 2015,
   '陵寝墓葬', '清', '清',
   true, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(117.66, 40.19), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (12, '保定市清西陵景区', '河北省', '保定市', 2019,
   '陵寝墓葬', '清', '清',
   true, true,
   'tianditu', 'high', NULL,
   ST_SetSRID(ST_MakePoint(115.34491, 39.3509), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (13, '秦皇岛市山海关景区', '河北省', '秦皇岛市', 2007,
   '关隘长城', '明', '明',
   true, true,
   'sample', 'high', '2015年被取消5A等级，2018年复牌；坐标取天下第一关',
   ST_SetSRID(ST_MakePoint(119.756, 40.009), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (14, '承德市金山岭长城景区', '河北省', '承德市', 2020,
   '关隘长城', '明', '明',
   true, true,
   'tianditu', 'high', NULL,
   ST_SetSRID(ST_MakePoint(117.24693, 40.67855), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (15, '邯郸市广府古城景区', '河北省', '邯郸市', 2017,
   '古城古镇', '明、清', '明',
   false, true,
   'tianditu', 'high', '广府古城墙为全国重点文保，太极拳发源地',
   ST_SetSRID(ST_MakePoint(114.72605, 36.69928), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (16, '邯郸市娲皇宫景区', '河北省', '邯郸市', 2015,
   '宗教寺观', '北齐至清', '魏晋南北朝',
   false, true,
   'tianditu', 'high', '北齐摩崖刻经与祭祀建筑群',
   ST_SetSRID(ST_MakePoint(113.60928, 36.63881), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (17, '大同市云冈石窟景区', '山西省', '大同市', 2007,
   '石窟石刻', '北魏', '魏晋南北朝',
   true, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(113.137, 40.109), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (18, '忻州市五台山风景名胜区', '山西省', '忻州市', 2007,
   '历史名山', '唐至清', '隋唐',
   true, true,
   'sample', 'high', '世界文化景观，佛教四大名山之一，坐标取显通寺',
   ST_SetSRID(ST_MakePoint(113.587, 38.96), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (19, '晋中市平遥古城景区', '山西省', '晋中市', 2015,
   '古城古镇', '明、清', '明',
   true, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(112.176, 37.189), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (20, '太原市晋祠天龙山景区', '山西省', '太原市', 2024,
   '复合人文', '北齐至宋', '魏晋南北朝',
   false, true,
   'tianditu', 'high', '晋祠（北宋圣母殿）与天龙山石窟复合，坐标取晋祠',
   ST_SetSRID(ST_MakePoint(112.43557, 37.708605), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (21, '忻州市雁门关景区', '山西省', '忻州市', 2017,
   '关隘长城', '明', '明',
   true, true,
   'tianditu', 'high', '长城世界遗产关隘',
   ST_SetSRID(ST_MakePoint(112.875488, 39.08252), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (22, '晋中市乔家大院景区', '山西省', '晋中市', 2014,
   '古村落', '清', '清',
   false, true,
   'tianditu', 'high', '晋商民居建筑群；2019年摘牌、2024年复牌',
   ST_SetSRID(ST_MakePoint(112.430496, 37.405858), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (23, '晋城市皇城相府生态文化旅游区', '山西省', '晋城市', 2011,
   '古村落', '明、清', '明',
   false, true,
   'tianditu', 'high', '陈廷敬故居，官宅民居建筑群',
   ST_SetSRID(ST_MakePoint(112.57706, 35.51441), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (24, '晋中市绵山风景区', '山西省', '晋中市', 2013,
   '历史名山', '春秋至清', '先秦',
   false, false,
   'tianditu', 'high', '寒食节（介子推）发源地，现存宫观多为1990年代复建',
   ST_SetSRID(ST_MakePoint(111.88765, 37.02195), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (25, '鄂尔多斯市成吉思汗陵旅游区', '内蒙古自治区', '鄂尔多斯市', 2011,
   '陵寝墓葬', '元（祭祀传承）', '元',
   false, true,
   'tianditu', 'high', '成吉思汗陵为全国重点文保，现存陵宫为1954年迁建，蒙古族祭祀圣地',
   ST_SetSRID(ST_MakePoint(109.784378, 39.37104), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (26, '本溪市五女山景区', '辽宁省', '本溪市', 2024,
   '古遗址', '汉至南北朝', '汉',
   true, true,
   'tianditu', 'high', '高句丽早期都城纥升骨城，高句丽世界遗产组成部分',
   ST_SetSRID(ST_MakePoint(125.41075, 41.32494), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (27, '鞍山市千山景区', '辽宁省', '鞍山市', 2017,
   '历史名山', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '东北佛道名山，千山古建筑群为全国重点文保',
   ST_SetSRID(ST_MakePoint(123.14029, 41.04654), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (28, '通化市高句丽文物古迹旅游景区', '吉林省', '通化市', 2019,
   '古遗址', '汉至南北朝', '汉',
   true, true,
   'tianditu', 'high', '集安国内城、丸都山城、好太王碑，高句丽世界遗产',
   ST_SetSRID(ST_MakePoint(126.21422, 41.14485), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (29, '长春市伪满皇宫博物馆', '吉林省', '长春市', 2007,
   '复合人文', '清末至民国', '清末民国',
   false, true,
   'tianditu', 'high', '伪满皇宫旧址，清末至民国宫殿旧址',
   ST_SetSRID(ST_MakePoint(125.342289, 43.904154), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (30, '苏州市苏州园林（拙政园－留园－虎丘）', '江苏省', '苏州市', 2007,
   '古典园林', '宋至清', '宋',
   true, true,
   'sample', 'high', '苏州古典园林世界遗产，坐标取拙政园',
   ST_SetSRID(ST_MakePoint(120.628, 31.325), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (31, '苏州市周庄古镇景区', '江苏省', '苏州市', 2007,
   '古城古镇', '明、清', '明',
   false, true,
   'sample', 'high', '江南水乡古镇（世界遗产预备名单）',
   ST_SetSRID(ST_MakePoint(120.844, 31.116), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (32, '苏州市同里古镇景区', '江苏省', '苏州市', 2010,
   '古城古镇', '明、清', '明',
   false, true,
   'tianditu', 'high', '坐标取退思园（全国重点文保）',
   ST_SetSRID(ST_MakePoint(120.718325, 31.159487), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (33, '南京市夫子庙－秦淮风光带', '江苏省', '南京市', 2010,
   '复合人文', '宋至清', '宋',
   false, true,
   'sample', 'high', '孔庙、江南贡院与秦淮河历史街区复合',
   ST_SetSRID(ST_MakePoint(118.79, 32.023), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (34, '南京市钟山风景名胜区－中山陵园风景区', '江苏省', '南京市', 2007,
   '复合人文', '明至民国', '明',
   true, true,
   'tianditu', 'high', '明孝陵（世界遗产）与中山陵（近代）复合，坐标取明孝陵',
   ST_SetSRID(ST_MakePoint(118.828157, 32.050384), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (35, '扬州市瘦西湖风景区', '江苏省', '扬州市', 2010,
   '古典园林', '清', '清',
   true, true,
   'tianditu', 'high', '湖上园林群，大运河世界遗产点，坐标取五亭桥',
   ST_SetSRID(ST_MakePoint(119.409365, 32.406122), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (36, '镇江市金山·焦山·北固山风景区', '江苏省', '镇江市', 2012,
   '历史名山', '三国至清', '魏晋南北朝',
   false, true,
   'tianditu', 'high', '长江文化名山，焦山碑林为全国重点文保，坐标取金山寺',
   ST_SetSRID(ST_MakePoint(119.446761, 32.124709), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (37, '无锡市惠山古镇景区', '江苏省', '无锡市', 2019,
   '历史街区', '明、清', '明',
   false, true,
   'tianditu', 'high', '惠山镇祠堂群为全国重点文保，坐标取寄畅园',
   ST_SetSRID(ST_MakePoint(120.266864, 31.581803), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (38, '常州市春秋淹城旅游区', '江苏省', '常州市', 2017,
   '古遗址', '春秋', '先秦',
   false, true,
   'tianditu', 'high', '春秋三城三河遗址（全国重点文保），景区含现代春秋乐园',
   ST_SetSRID(ST_MakePoint(119.93165, 31.70144), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (39, '连云港市花果山景区', '江苏省', '连云港市', 2016,
   '历史名山', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '西游记文化名山，海清寺塔为全国重点文保',
   ST_SetSRID(ST_MakePoint(119.181045, 34.408766), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (40, '镇江市茅山景区', '江苏省', '镇江市', 2014,
   '历史名山', '南朝至清', '魏晋南北朝',
   false, false,
   'tianditu', 'high', '道教上清派发源地，坐标取九霄万福宫',
   ST_SetSRID(ST_MakePoint(119.307326, 31.7836), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (41, '南通市濠河风景区', '江苏省', '南通市', 2012,
   '复合人文', '宋至民国', '宋',
   false, true,
   'tianditu', 'high', '古护城河环濠河博物馆群，含南通博物苑（全国重点文保）',
   ST_SetSRID(ST_MakePoint(120.85876, 32.034839), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (42, '徐州市云龙湖景区', '江苏省', '徐州市', 2016,
   '复合人文', '汉、北魏', '汉',
   false, true,
   'tianditu', 'high', '含西汉楚王陵（全国重点文保）与云龙山北魏兴化寺大石佛',
   ST_SetSRID(ST_MakePoint(117.19722, 34.25458), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (43, '杭州市杭州西湖风景区', '浙江省', '杭州市', 2007,
   '复合人文', '唐至清', '隋唐',
   true, true,
   'sample', 'high', '世界文化景观',
   ST_SetSRID(ST_MakePoint(120.145, 30.245), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (44, '嘉兴市乌镇古镇旅游区', '浙江省', '嘉兴市', 2010,
   '古城古镇', '明、清', '明',
   false, true,
   'sample', 'high', '江南水乡古镇（世界遗产预备名单）',
   ST_SetSRID(ST_MakePoint(120.492, 30.746), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (45, '嘉兴市西塘古镇旅游区', '浙江省', '嘉兴市', 2017,
   '古城古镇', '明、清', '明',
   false, true,
   'tianditu', 'high', '江南水乡古镇（世界遗产预备名单）',
   ST_SetSRID(ST_MakePoint(120.883611, 30.942178), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (46, '湖州市南浔古镇景区', '浙江省', '湖州市', 2015,
   '古城古镇', '明清至民国', '明',
   false, true,
   'tianditu', 'high', '嘉业堂藏书楼、张石铭旧宅为全国重点文保',
   ST_SetSRID(ST_MakePoint(120.426807, 30.87097), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (47, '舟山市普陀山风景区', '浙江省', '舟山市', 2007,
   '历史名山', '宋至清', '宋',
   false, true,
   'tianditu', 'high', '佛教四大名山（观音道场），坐标取普济寺',
   ST_SetSRID(ST_MakePoint(122.384779, 29.98631), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (48, '台州市天台山景区', '浙江省', '台州市', 2015,
   '历史名山', '隋至清', '隋唐',
   false, true,
   'tianditu', 'high', '佛教天台宗发源地，国清寺为全国重点文保',
   ST_SetSRID(ST_MakePoint(121.042909, 29.173405), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (49, '台州市台州府城文化旅游区', '浙江省', '台州市', 2022,
   '古城古镇', '宋至清', '宋',
   false, true,
   'tianditu', 'high', '台州府城墙（江南长城）为全国重点文保',
   ST_SetSRID(ST_MakePoint(121.120437, 28.840187), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (50, '宁波市天一阁·月湖景区', '浙江省', '宁波市', 2018,
   '复合人文', '明至清', '明',
   false, true,
   'tianditu', 'high', '天一阁为明代藏书楼，全国重点文保',
   ST_SetSRID(ST_MakePoint(121.539136, 29.870373), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (51, '绍兴市鲁迅故里·沈园景区', '浙江省', '绍兴市', 2012,
   '复合人文', '宋至民国', '宋',
   false, true,
   'tianditu', 'high', '沈园（南宋园林）与鲁迅故里（近代）复合，坐标取沈园',
   ST_SetSRID(ST_MakePoint(120.586237, 29.994513), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (52, '衢州市江郎山·廿八都旅游区', '浙江省', '衢州市', 2017,
   '古城古镇', '明、清', '明',
   false, true,
   'tianditu', 'high', '廿八都古建筑群为全国重点文保；江郎山为世界自然遗产（中国丹霞）',
   ST_SetSRID(ST_MakePoint(118.477635, 28.294326), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (53, '丽水市缙云仙都景区', '浙江省', '丽水市', 2019,
   '历史名山', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '仙都摩崖题记为全国重点文保，黄帝文化与道教名山',
   ST_SetSRID(ST_MakePoint(120.053201, 28.724079), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (54, '温州市刘伯温故里景区', '浙江省', '温州市', 2020,
   '宫殿坛庙', '明', '明',
   false, true,
   'tianditu', 'high', '刘基庙、墓为全国重点文保',
   ST_SetSRID(ST_MakePoint(119.952142, 27.919369), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (55, '宁波市溪口－滕头旅游景区', '浙江省', '宁波市', 2010,
   '复合人文', '清末至民国', '清末民国',
   false, true,
   'tianditu', 'high', '蒋氏故居为全国重点文保，坐标取丰镐房',
   ST_SetSRID(ST_MakePoint(121.285138, 29.683211), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (56, '黄山市黄山风景区', '安徽省', '黄山市', 2007,
   '历史名山', '唐至清', '隋唐',
   true, true,
   'tianditu', 'high', '世界文化与自然双遗产，坐标取玉屏楼',
   ST_SetSRID(ST_MakePoint(118.170154, 30.124905), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (57, '黄山市皖南古村落－西递宏村', '安徽省', '黄山市', 2011,
   '古村落', '明、清', '明',
   true, true,
   'sample', 'high', '坐标取宏村月沼',
   ST_SetSRID(ST_MakePoint(117.986, 30.004), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (58, '池州市九华山风景区', '安徽省', '池州市', 2007,
   '历史名山', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '佛教四大名山（地藏道场），坐标取化城寺',
   ST_SetSRID(ST_MakePoint(116.090719, 31.057163), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (59, '安庆市天柱山风景区', '安徽省', '安庆市', 2011,
   '历史名山', '汉至清', '汉',
   false, true,
   'tianditu', 'high', '古南岳、禅宗三祖道场，山谷流泉摩崖石刻为全国重点文保；同时为世界地质公园',
   ST_SetSRID(ST_MakePoint(116.491647, 30.65625), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (60, '黄山市古徽州文化旅游区', '安徽省', '黄山市', 2014,
   '古城古镇', '明、清', '明',
   false, true,
   'tianditu', 'high', '徽州古城、棠樾牌坊群、许国石坊等，坐标取许国石坊',
   ST_SetSRID(ST_MakePoint(118.429795, 29.867206), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (61, '合肥市三河古镇景区', '安徽省', '合肥市', 2015,
   '古城古镇', '明、清', '明',
   false, true,
   'tianditu', 'high', '皖中水乡古镇，三河古镇为全国重点文保',
   ST_SetSRID(ST_MakePoint(117.241266, 31.513184), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (62, '宣城市龙川景区', '安徽省', '宣城市', 2012,
   '古村落', '明、清', '明',
   false, true,
   'tianditu', 'high', '绩溪龙川胡氏宗祠为全国重点文保',
   ST_SetSRID(ST_MakePoint(118.666595, 30.079413), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (63, '滁州市琅琊山景区', '安徽省', '滁州市', 2024,
   '历史名山', '宋至清', '宋',
   false, true,
   'tianditu', 'high', '醉翁亭、琅琊山摩崖石刻为全国重点文保',
   ST_SetSRID(ST_MakePoint(118.282799, 32.285448), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (64, '马鞍山市长江采石矶文化生态旅游区', '安徽省', '马鞍山市', 2020,
   '历史名山', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '李白文化，采石矶遗址（太白楼）为全国重点文保',
   ST_SetSRID(ST_MakePoint(118.5273, 31.6637), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (65, '福建土楼（永定·南靖）旅游景区', '福建省', '龙岩市', 2011,
   '古村落', '明、清', '明',
   true, true,
   'sample', 'high', '福建土楼世界遗产，坐标取永定高北承启楼',
   ST_SetSRID(ST_MakePoint(116.971, 24.662), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (66, '厦门市鼓浪屿风景名胜区', '福建省', '厦门市', 2007,
   '历史街区', '清末至民国', '清末民国',
   true, true,
   'sample', 'high', '历史国际社区世界文化遗产',
   ST_SetSRID(ST_MakePoint(118.067, 24.449), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (67, '福州市三坊七巷景区', '福建省', '福州市', 2015,
   '历史街区', '晋至民国', '魏晋南北朝',
   false, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(119.297, 26.083), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (68, '南平市武夷山风景名胜区', '福建省', '南平市', 2007,
   '历史名山', '唐至清', '隋唐',
   true, true,
   'tianditu', 'high', '世界文化与自然双遗产，坐标取天游峰',
   ST_SetSRID(ST_MakePoint(117.988261, 27.652118), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (69, '泉州市清源山风景名胜区', '福建省', '泉州市', 2012,
   '历史名山', '宋至清', '宋',
   true, true,
   'tianditu', 'high', '老君岩造像为全国重点文保，泉州世界海洋商贸中心遗产点',
   ST_SetSRID(ST_MakePoint(118.59456, 24.94751), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (70, '莆田市湄洲岛妈祖文化旅游区', '福建省', '莆田市', 2020,
   '宗教寺观', '宋至清', '宋',
   false, true,
   'tianditu', 'high', '妈祖庙为全国重点文保，妈祖信俗为人类非物质文化遗产',
   ST_SetSRID(ST_MakePoint(119.01197, 25.35636), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (71, '九江市庐山市庐山风景名胜区', '江西省', '九江市', 2007,
   '历史名山', '唐至清', '隋唐',
   true, true,
   'tianditu', 'high', '世界文化景观',
   ST_SetSRID(ST_MakePoint(115.983068, 29.567509), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (72, '鹰潭市贵溪市龙虎山风景名胜区', '江西省', '鹰潭市', 2012,
   '历史名山', '汉至清', '汉',
   false, true,
   'tianditu', 'high', '道教正一派发源地，大上清宫遗址、嗣汉天师府；同时为世界自然遗产（中国丹霞）',
   ST_SetSRID(ST_MakePoint(117.0327, 28.04677), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (73, '上饶市婺源县江湾景区', '江西省', '上饶市', 2013,
   '古村落', '明、清', '明',
   false, true,
   'tianditu', 'high', '婺源明清古建筑群（全国重点文保）',
   ST_SetSRID(ST_MakePoint(118.04731, 29.37249), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (74, '上饶市篁岭景区', '江西省', '上饶市', 2024,
   '古村落', '明、清', '明',
   false, true,
   'tianditu', 'high', '婺源徽派古村落，晒秋民俗',
   ST_SetSRID(ST_MakePoint(118.11333, 29.32466), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (75, '南昌市东湖区滕王阁旅游区', '江西省', '南昌市', 2018,
   '复合人文', '唐始建', '隋唐',
   false, false,
   'tianditu', 'high', '江南名楼，现存建筑为1989年复建',
   ST_SetSRID(ST_MakePoint(115.876956, 28.684618), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (76, '景德镇市昌江区古窑民俗博览区', '江西省', '景德镇市', 2013,
   '复合人文', '明至清', '明',
   false, false,
   'tianditu', 'high', '清代镇窑等传统瓷窑（部分为迁建复烧），陶瓷文化；湖田古瓷窑址为全国重点文保',
   ST_SetSRID(ST_MakePoint(117.179645, 29.285214), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (77, '泰安市泰山景区', '山东省', '泰安市', 2007,
   '历史名山', '先秦至清', '先秦',
   true, true,
   'sample', 'high', '世界文化与自然双遗产，封禅文化名山，坐标取岱庙',
   ST_SetSRID(ST_MakePoint(117.101, 36.256), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (78, '济宁市明故城三孔旅游区', '山东省', '济宁市', 2007,
   '宫殿坛庙', '春秋至清', '先秦',
   true, true,
   'sample', 'high', '孔庙、孔府、孔林，儒家文化核心遗存',
   ST_SetSRID(ST_MakePoint(116.991, 35.595), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (79, '烟台市蓬莱阁-三仙山-八仙过海旅游区', '山东省', '烟台市', 2007,
   '复合人文', '宋至清', '宋',
   false, true,
   'tianditu', 'high', '蓬莱阁为全国重点文保；三仙山、八仙过海为现代主题园',
   ST_SetSRID(ST_MakePoint(120.749344, 37.824715), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (80, '青岛市崂山景区', '山东省', '青岛市', 2011,
   '历史名山', '宋至清', '宋',
   false, true,
   'tianditu', 'high', '道教全真派名山，崂山道教建筑群（太清宫）为全国重点文保',
   ST_SetSRID(ST_MakePoint(120.67615, 36.13909), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (81, '潍坊市青州古城景区', '山东省', '潍坊市', 2017,
   '古城古镇', '明、清', '明',
   false, false,
   'tianditu', 'high', '古城街区含复建；青州境内龙兴寺遗址、驼山石窟为全国重点文保',
   ST_SetSRID(ST_MakePoint(118.472383, 36.67641), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (82, '淄博市周村古商城景区', '山东省', '淄博市', 2024,
   '历史街区', '明清至民国', '明',
   false, true,
   'tianditu', 'high', '周村古商城为全国重点文保，清代商埠',
   ST_SetSRID(ST_MakePoint(117.834939, 36.798218), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (83, '济南市天下第一泉景区', '山东省', '济南市', 2013,
   '古典园林', '宋至清', '宋',
   false, false,
   'tianditu', 'high', '趵突泉、大明湖泉城园林群',
   ST_SetSRID(ST_MakePoint(117.009482, 36.660625), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (84, '威海市刘公岛景区', '山东省', '威海市', 2011,
   '复合人文', '清末', '清末民国',
   false, true,
   'tianditu', 'high', '刘公岛甲午战争纪念地（北洋水师），全国重点文保',
   ST_SetSRID(ST_MakePoint(122.17633, 37.50053), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (85, '郑州市嵩山少林景区', '河南省', '郑州市', 2007,
   '宗教寺观', '北魏至清', '魏晋南北朝',
   true, true,
   'sample', 'high', '天地之中历史建筑群世界遗产，少林寺、塔林',
   ST_SetSRID(ST_MakePoint(112.935, 34.508), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (86, '洛阳市龙门石窟景区', '河南省', '洛阳市', 2007,
   '石窟石刻', '北魏至唐', '魏晋南北朝',
   true, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(112.477, 34.555), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (87, '安阳市殷墟景区', '河南省', '安阳市', 2011,
   '古遗址', '商', '先秦',
   true, true,
   'sample', 'high', NULL,
   ST_SetSRID(ST_MakePoint(114.305, 36.122), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (88, '洛阳市老君山－鸡冠洞旅游区', '河南省', '洛阳市', 2012,
   '历史名山', '唐至清', '隋唐',
   false, false,
   'tianditu', 'high', '道教名山（老子归隐），山顶金顶群为2010年代复建；鸡冠洞为溶洞',
   ST_SetSRID(ST_MakePoint(111.64289, 33.75488), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (89, '商丘市芒砀山汉文化旅游景区', '河南省', '商丘市', 2017,
   '陵寝墓葬', '汉', '汉',
   false, true,
   'tianditu', 'high', '西汉梁王陵墓群，全国重点文保',
   ST_SetSRID(ST_MakePoint(116.48254, 34.17876), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (90, '周口市太昊伏羲陵文化旅游区', '河南省', '周口市', 2024,
   '宫殿坛庙', '明至清', '明',
   false, true,
   'tianditu', 'high', '太昊伏羲陵为全国重点文保',
   ST_SetSRID(ST_MakePoint(114.8824, 33.75188), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (91, '信阳市鸡公山景区', '河南省', '信阳市', 2022,
   '历史街区', '清末至民国', '清末民国',
   false, true,
   'tianditu', 'high', '鸡公山近代建筑群为全国重点文保，近代避暑地',
   ST_SetSRID(ST_MakePoint(114.07705, 31.80515), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (92, '十堰市武当山风景区', '湖北省', '十堰市', 2011,
   '历史名山', '明', '明',
   true, true,
   'sample', 'high', '武当山古建筑群世界遗产，坐标取金顶',
   ST_SetSRID(ST_MakePoint(111.004, 32.403), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (93, '武汉市黄鹤楼公园', '湖北省', '武汉市', 2007,
   '复合人文', '三国始建', '魏晋南北朝',
   false, false,
   'sample', 'high', '历史名楼，现存建筑为1985年复建',
   ST_SetSRID(ST_MakePoint(114.302, 30.543), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (94, '荆门市明显陵文化旅游景区', '湖北省', '荆门市', 2024,
   '陵寝墓葬', '明', '明',
   true, true,
   'sample', 'high', '明清皇家陵寝世界遗产组成部分',
   ST_SetSRID(ST_MakePoint(112.638, 31.22), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (95, '襄阳市古隆中景区', '湖北省', '襄阳市', 2019,
   '复合人文', '三国至清', '魏晋南北朝',
   false, true,
   'tianditu', 'high', '诸葛亮隐居地，古隆中为全国重点文保',
   ST_SetSRID(ST_MakePoint(112.029808, 32.013948), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (96, '咸宁市三国赤壁古战场景区', '湖北省', '咸宁市', 2018,
   '古遗址', '东汉末', '汉',
   false, true,
   'tianditu', 'high', '赤壁之战遗址，全国重点文保',
   ST_SetSRID(ST_MakePoint(113.622674, 29.881788), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (97, '武汉市木兰文化生态旅游区', '湖北省', '武汉市', 2014,
   '历史名山', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '木兰山古建筑群为全国重点文保，花木兰文化',
   ST_SetSRID(ST_MakePoint(114.391692, 31.09776), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (98, '衡阳市衡山旅游区', '湖南省', '衡阳市', 2007,
   '历史名山', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '南岳，南岳庙为全国重点文保，坐标取祝融峰',
   ST_SetSRID(ST_MakePoint(112.714452, 27.25517), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (99, '岳阳市岳阳楼－君山岛景区', '湖南省', '岳阳市', 2011,
   '复合人文', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '岳阳楼为全国重点文保，江南名楼',
   ST_SetSRID(ST_MakePoint(113.08815, 29.383645), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (100, '长沙市岳麓山-橘子洲旅游区', '湖南省', '长沙市', 2012,
   '历史名山', '宋至清', '宋',
   false, true,
   'tianditu', 'high', '岳麓书院为全国重点文保（四大书院）',
   ST_SetSRID(ST_MakePoint(112.935492, 28.184056), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (101, '湘西州凤凰古城旅游区', '湖南省', '湘西土家族苗族自治州', 2024,
   '古城古镇', '明清至民国', '明',
   false, true,
   'tianditu', 'high', '凤凰古城墙、沈从文故居等全国重点文保',
   ST_SetSRID(ST_MakePoint(109.595902, 27.953815), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (102, '株洲市炎帝陵景区', '湖南省', '株洲市', 2019,
   '宫殿坛庙', '宋至清', '宋',
   false, true,
   'tianditu', 'high', '炎帝陵为全国重点文保',
   ST_SetSRID(ST_MakePoint(113.66601, 26.42051), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (103, '常德市桃花源旅游区', '湖南省', '常德市', 2020,
   '复合人文', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '桃花源古建筑群为全国重点文保，陶渊明文化，部分建筑复建',
   ST_SetSRID(ST_MakePoint(111.63344, 28.92106), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (104, '江门市开平市开平碉楼文化旅游区', '广东省', '江门市', 2020,
   '古村落', '清末至民国', '清末民国',
   true, true,
   'sample', 'high', '开平碉楼与村落世界遗产，坐标取自力村碉楼群',
   ST_SetSRID(ST_MakePoint(112.566, 22.376), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (105, '惠州市博罗县罗浮山景区', '广东省', '惠州市', 2013,
   '历史名山', '东晋至清', '魏晋南北朝',
   false, true,
   'tianditu', 'high', '道教第七洞天，冲虚古观为全国重点文保',
   ST_SetSRID(ST_MakePoint(114.058527, 23.267011), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (106, '佛山市南海区西樵山景区', '广东省', '佛山市', 2013,
   '历史名山', '史前至清', '先秦',
   false, true,
   'tianditu', 'high', '石燕岩采石遗址为全国重点文保，珠江文明名山',
   ST_SetSRID(ST_MakePoint(112.972447, 22.930099), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (107, '肇庆市端州区星湖旅游景区', '广东省', '肇庆市', 2019,
   '石窟石刻', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '七星岩摩崖石刻为全国重点文保；鼎湖山为自然保护区',
   ST_SetSRID(ST_MakePoint(112.472228, 23.075628), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (108, '惠州市惠城区惠州西湖旅游景区', '广东省', '惠州市', 2018,
   '古典园林', '宋至清', '宋',
   false, false,
   'tianditu', 'high', '苏东坡文化，泗州塔等湖上园林',
   ST_SetSRID(ST_MakePoint(114.393, 23.09508), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (109, '中山市孙中山故里旅游区', '广东省', '中山市', 2016,
   '复合人文', '清末至民国', '清末民国',
   false, true,
   'tianditu', 'high', '孙中山故居为全国重点文保',
   ST_SetSRID(ST_MakePoint(113.52225, 22.445459), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (110, '桂林市独秀峰·靖江王城景区', '广西壮族自治区', '桂林市', 2012,
   '宫殿坛庙', '明', '明',
   false, true,
   'sample', 'high', '靖江王府及王陵为全国重点文保',
   ST_SetSRID(ST_MakePoint(110.296, 25.278), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (111, '崇左市花山岩画景区', '广西壮族自治区', '崇左市', 2024,
   '石窟石刻', '战国至东汉', '先秦',
   true, true,
   'tianditu', 'high', '左江花山岩画文化景观世界遗产，骆越先民岩画',
   ST_SetSRID(ST_MakePoint(107.06968, 22.1378), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (112, '贺州市黄姚古镇景区', '广西壮族自治区', '贺州市', 2022,
   '古城古镇', '明、清', '明',
   false, true,
   'tianditu', 'high', '黄姚古建筑群为全国重点文保',
   ST_SetSRID(ST_MakePoint(111.20666, 24.24996), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (113, '柳州市程阳八寨景区', '广西壮族自治区', '柳州市', 2024,
   '古村落', '清末至民国', '清末民国',
   false, true,
   'tianditu', 'high', '程阳风雨桥为全国重点文保，侗族村寨',
   ST_SetSRID(ST_MakePoint(109.641939, 25.900222), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (114, '三亚市天涯海角游览区', '海南省', '三亚市', 2024,
   '石窟石刻', '清', '清',
   false, true,
   'tianditu', 'high', '天涯海角摩崖石刻群（康熙至宣统）为全国重点文保，中国文化地理符号',
   ST_SetSRID(ST_MakePoint(109.34421, 18.29512), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (115, '大足石刻景区', '重庆市', '重庆市', 2007,
   '石窟石刻', '唐、宋', '隋唐',
   true, true,
   'sample', 'high', '坐标取宝顶山石刻',
   ST_SetSRID(ST_MakePoint(105.788, 29.775), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (116, '白帝城·瞿塘峡景区', '重庆市', '重庆市', 2022,
   '复合人文', '三国至清', '魏晋南北朝',
   false, true,
   'tianditu', 'high', '白帝城为全国重点文保，刘备托孤、三峡门户',
   ST_SetSRID(ST_MakePoint(109.57022, 31.043084), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (117, '成都市青城山－都江堰旅游景区', '四川省', '成都市', 2007,
   '复合人文', '秦至清', '秦',
   true, true,
   'tianditu', 'high', '青城山道教名山与都江堰古代水利工程，世界遗产，坐标取都江堰宝瓶口',
   ST_SetSRID(ST_MakePoint(103.644956, 30.991213), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (118, '乐山市峨眉山景区', '四川省', '乐山市', 2007,
   '历史名山', '唐至清', '隋唐',
   true, true,
   'sample', 'high', '世界文化与自然双遗产，佛教四大名山，坐标取报国寺',
   ST_SetSRID(ST_MakePoint(103.334, 29.524), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (119, '乐山市乐山大佛景区', '四川省', '乐山市', 2011,
   '石窟石刻', '唐', '隋唐',
   true, true,
   'tianditu', 'high', '峨眉山-乐山大佛世界遗产，唐代摩崖造像',
   ST_SetSRID(ST_MakePoint(103.772743, 29.544223), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (120, '广元市剑门蜀道剑门关旅游景区', '四川省', '广元市', 2015,
   '关隘长城', '三国', '魏晋南北朝',
   false, true,
   'sample', 'high', '剑门蜀道遗址为全国重点文保，蜀道核心关隘',
   ST_SetSRID(ST_MakePoint(105.551, 32.201), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (121, '南充市阆中古城旅游景区', '四川省', '南充市', 2013,
   '古城古镇', '明、清', '明',
   false, true,
   'tianditu', 'high', '阆中古城为全国重点文保，三国张飞守阆中',
   ST_SetSRID(ST_MakePoint(105.97678, 31.57331), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (122, '成都市安仁古镇景区', '四川省', '成都市', 2022,
   '历史街区', '清末至民国', '清末民国',
   false, true,
   'tianditu', 'high', '刘氏庄园为全国重点文保，民国公馆群',
   ST_SetSRID(ST_MakePoint(103.62563, 30.50835), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (123, '贵阳市花溪区青岩古镇景区', '贵州省', '贵阳市', 2017,
   '古城古镇', '明、清', '明',
   false, true,
   'tianditu', 'high', '青岩古镇为全国重点文保，明代军事古镇',
   ST_SetSRID(ST_MakePoint(106.68354, 26.33529), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (124, '黔东南州镇远县镇远古城旅游景区', '贵州省', '黔东南苗族侗族自治州', 2019,
   '古城古镇', '明、清', '明',
   false, true,
   'tianditu', 'high', '青龙洞古建筑群为全国重点文保，坐标取青龙洞',
   ST_SetSRID(ST_MakePoint(108.42872, 27.05377), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (125, '丽江市丽江古城景区', '云南省', '丽江市', 2011,
   '古城古镇', '宋至清', '宋',
   true, true,
   'sample', 'high', '丽江古城世界遗产',
   ST_SetSRID(ST_MakePoint(100.235, 26.872), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (126, '大理州崇圣寺三塔文化旅游区', '云南省', '大理白族自治州', 2011,
   '宗教寺观', '唐、五代', '隋唐',
   false, true,
   'sample', 'high', '崇圣寺三塔为全国重点文保',
   ST_SetSRID(ST_MakePoint(100.149, 25.706), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (127, '腾冲市和顺古镇景区', '云南省', '保山市', 2024,
   '古城古镇', '明清至民国', '明',
   false, true,
   'tianditu', 'high', '和顺图书馆旧址为全国重点文保，侨乡古镇',
   ST_SetSRID(ST_MakePoint(98.4657, 25.01423), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (128, '拉萨市布达拉宫景区', '西藏自治区', '拉萨市', 2013,
   '宗教寺观', '唐至清', '隋唐',
   true, true,
   'sample', 'high', '布达拉宫历史建筑群世界遗产',
   ST_SetSRID(ST_MakePoint(91.117, 29.657), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (129, '拉萨市大昭寺景区', '西藏自治区', '拉萨市', 2013,
   '宗教寺观', '唐', '隋唐',
   true, true,
   'sample', 'high', '布达拉宫历史建筑群世界遗产扩展项目',
   ST_SetSRID(ST_MakePoint(91.13, 29.653), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (130, '日喀则市扎什伦布寺景区', '西藏自治区', '日喀则市', 2017,
   '宗教寺观', '明至清', '明',
   false, true,
   'tianditu', 'high', '藏传佛教格鲁派寺院，历世班禅驻锡地，全国重点文保',
   ST_SetSRID(ST_MakePoint(88.870656, 29.267153), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (131, '西安市秦始皇帝陵博物院景区', '陕西省', '西安市', 2007,
   '古遗址', '秦', '秦',
   true, true,
   'sample', 'high', '含兵马俑坑与秦始皇陵，坐标取兵马俑',
   ST_SetSRID(ST_MakePoint(109.279, 34.385), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (132, '西安市华清宫景区', '陕西省', '西安市', 2007,
   '宫殿坛庙', '唐', '隋唐',
   false, true,
   'tianditu', 'high', '唐代皇家离宫，华清宫遗址为全国重点文保',
   ST_SetSRID(ST_MakePoint(109.20798, 34.36493), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (133, '西安市大雁塔－大唐芙蓉园景区', '陕西省', '西安市', 2011,
   '宗教寺观', '唐', '隋唐',
   true, true,
   'tianditu', 'high', '大雁塔为丝绸之路世界遗产点、全国重点文保；大唐芙蓉园为现代仿唐园林',
   ST_SetSRID(ST_MakePoint(108.965957, 34.213219), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (134, '西安市大明宫旅游景区', '陕西省', '西安市', 2020,
   '古遗址', '唐', '隋唐',
   true, true,
   'sample', 'high', '唐大明宫遗址，丝绸之路世界遗产点',
   ST_SetSRID(ST_MakePoint(108.968, 34.294), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (135, '西安市城墙·碑林历史文化景区', '陕西省', '西安市', 2018,
   '复合人文', '宋至明', '宋',
   false, true,
   'sample', 'high', '明城墙与西安碑林复合，均为全国重点文保',
   ST_SetSRID(ST_MakePoint(108.946, 34.254), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (136, '渭南市华山风景区', '陕西省', '渭南市', 2011,
   '历史名山', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '西岳，西岳庙为全国重点文保',
   ST_SetSRID(ST_MakePoint(110.08256, 34.47902), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (137, '宝鸡市法门文化景区', '陕西省', '宝鸡市', 2014,
   '宗教寺观', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '法门寺遗址为全国重点文保，佛指舍利；含现代合十舍利塔',
   ST_SetSRID(ST_MakePoint(107.89962, 34.43778), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (138, '延安市黄帝陵景区', '陕西省', '延安市', 2007,
   '陵寝墓葬', '汉至清', '汉',
   false, true,
   'tianditu', 'high', '黄帝陵为全国重点文保，历代祭祀',
   ST_SetSRID(ST_MakePoint(109.269149, 35.583403), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (139, '咸阳市乾陵景区', '陕西省', '咸阳市', 2024,
   '陵寝墓葬', '唐', '隋唐',
   false, true,
   'sample', 'high', '唐高宗与武则天合葬陵，全国重点文保',
   ST_SetSRID(ST_MakePoint(108.221, 34.576), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (140, '嘉峪关市嘉峪关文物景区', '甘肃省', '嘉峪关市', 2007,
   '关隘长城', '明', '明',
   true, true,
   'sample', 'high', '长城世界遗产，万里长城西端起点',
   ST_SetSRID(ST_MakePoint(98.216, 39.803), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (141, '天水市麦积山景区', '甘肃省', '天水市', 2011,
   '石窟石刻', '十六国至明', '魏晋南北朝',
   true, true,
   'sample', 'high', '丝绸之路世界遗产点，麦积山石窟',
   ST_SetSRID(ST_MakePoint(105.973, 34.349), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (142, '临夏州炳灵寺世界文化遗产旅游区', '甘肃省', '临夏回族自治州', 2020,
   '石窟石刻', '十六国至明', '魏晋南北朝',
   true, true,
   'tianditu', 'high', '丝绸之路世界遗产点，炳灵寺石窟',
   ST_SetSRID(ST_MakePoint(103.04462, 35.8057), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (143, '平凉市崆峒山风景名胜区', '甘肃省', '平凉市', 2007,
   '历史名山', '唐至清', '隋唐',
   false, true,
   'tianditu', 'high', '道教名山，崆峒山古建筑群为全国重点文保',
   ST_SetSRID(ST_MakePoint(106.525573, 35.562415), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (144, '西宁市塔尔寺景区', '青海省', '西宁市', 2012,
   '宗教寺观', '明', '明',
   false, true,
   'sample', 'high', '藏传佛教格鲁派寺院，宗喀巴诞生地，全国重点文保',
   ST_SetSRID(ST_MakePoint(101.567, 36.496), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (145, '银川市水洞沟旅游区', '宁夏回族自治区', '银川市', 2015,
   '古遗址', '旧石器时代、明', '先秦',
   false, true,
   'tianditu', 'high', '旧石器时代遗址与明长城复合，水洞沟遗址为全国重点文保',
   ST_SetSRID(ST_MakePoint(106.504299, 38.290987), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (146, '吴忠市青铜峡黄河大峡谷旅游区', '宁夏回族自治区', '吴忠市', 2024,
   '宗教寺观', '西夏', '宋',
   false, true,
   'tianditu', 'high', '一百零八塔为西夏佛教塔群，全国重点文保',
   ST_SetSRID(ST_MakePoint(105.984885, 37.887585), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (147, '喀什地区喀什古城景区', '新疆维吾尔自治区', '喀什地区', 2015,
   '古城古镇', '明、清', '明',
   false, true,
   'sample', 'high', '喀什噶尔老城为全国重点文保',
   ST_SetSRID(ST_MakePoint(75.989, 39.47), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, dynasty_group,
   world_heritage, major_site, coord_source, geocode_confidence, note, geom)
VALUES
  (148, '喀什地区帕米尔旅游区', '新疆维吾尔自治区', '喀什地区', 2019,
   '古遗址', '唐', '隋唐',
   false, true,
   'tianditu', 'high', '塔什库尔干石头城遗址为全国重点文保，古丝绸之路重镇',
   ST_SetSRID(ST_MakePoint(75.23305, 37.7799), 4326))
ON CONFLICT (id) DO NOTHING;
COMMIT;
