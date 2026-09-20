-- 本文件由 scripts/geojson2sql.mjs 自动生成，请勿手工编辑
-- 执行：psql -U postgres -h localhost -d wengis -f sql/04_insert_ancient_5a.generated.sql
BEGIN;
TRUNCATE wengis.ancient_5a;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (1, '故宫博物院', '北京市', '北京市', 2007,
   '宫殿坛庙', '明、清', true, true,
   NULL, ST_SetSRID(ST_MakePoint(116.397, 39.918), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (2, '天坛公园', '北京市', '北京市', 2007,
   '宫殿坛庙', '明、清', true, true,
   NULL, ST_SetSRID(ST_MakePoint(116.4122, 39.8823), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (3, '明故城（三孔）旅游区', '山东省', '济宁市', 2007,
   '宫殿坛庙', '春秋至清', true, true,
   '孔庙、孔府、孔林，儒家文化核心遗存', ST_SetSRID(ST_MakePoint(116.991, 35.595), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (4, '独秀峰·靖江王城景区', '广西壮族自治区', '桂林市', 2012,
   '宫殿坛庙', '明', false, true,
   NULL, ST_SetSRID(ST_MakePoint(110.296, 25.278), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (5, '颐和园', '北京市', '北京市', 2007,
   '古典园林', '清', true, true,
   NULL, ST_SetSRID(ST_MakePoint(116.274, 39.999), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (6, '承德避暑山庄及周围寺庙景区', '河北省', '承德市', 2007,
   '古典园林', '清', true, true,
   NULL, ST_SetSRID(ST_MakePoint(117.939, 40.999), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (7, '苏州园林（拙政园·留园·虎丘）', '江苏省', '苏州市', 2007,
   '古典园林', '宋至清', true, true,
   NULL, ST_SetSRID(ST_MakePoint(120.628, 31.325), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (8, '恭王府景区', '北京市', '北京市', 2012,
   '古典园林', '清', false, true,
   NULL, ST_SetSRID(ST_MakePoint(116.3862, 39.9372), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (9, '平遥古城景区', '山西省', '晋中市', 2015,
   '古城古镇', '明、清', true, true,
   NULL, ST_SetSRID(ST_MakePoint(112.176, 37.189), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (10, '丽江古城景区', '云南省', '丽江市', 2011,
   '古城古镇', '宋至清', true, true,
   NULL, ST_SetSRID(ST_MakePoint(100.235, 26.872), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (11, '喀什古城景区', '新疆维吾尔自治区', '喀什地区', 2015,
   '古城古镇', '明、清', false, true,
   NULL, ST_SetSRID(ST_MakePoint(75.989, 39.47), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (12, '周庄古镇景区', '江苏省', '苏州市', 2007,
   '古城古镇', '明、清', false, false,
   NULL, ST_SetSRID(ST_MakePoint(120.844, 31.116), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (13, '乌镇古镇旅游区', '浙江省', '嘉兴市', 2010,
   '古城古镇', '明、清', false, false,
   NULL, ST_SetSRID(ST_MakePoint(120.492, 30.746), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (14, '皖南古村落·西递宏村', '安徽省', '黄山市', 2011,
   '古村落', '明、清', true, true,
   '坐标取宏村中心', ST_SetSRID(ST_MakePoint(117.986, 30.004), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (15, '福建土楼（永定·南靖）旅游区', '福建省', '龙岩市', 2011,
   '古村落', '明、清', true, true,
   '坐标取永定高北土楼群承启楼', ST_SetSRID(ST_MakePoint(116.971, 24.662), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (16, '开平碉楼文化旅游区', '广东省', '江门市', 2020,
   '古村落', '清末至民国', true, true,
   '侨乡近代建筑，坐标取自力村碉楼群', ST_SetSRID(ST_MakePoint(112.566, 22.376), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (17, '嵩山少林景区', '河南省', '郑州市', 2007,
   '宗教寺观', '北魏至清', false, true,
   '天地之中历史建筑群为世界遗产', ST_SetSRID(ST_MakePoint(112.935, 34.508), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (18, '布达拉宫景区', '西藏自治区', '拉萨市', 2013,
   '宗教寺观', '唐至清', true, true,
   NULL, ST_SetSRID(ST_MakePoint(91.117, 29.657), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (19, '大昭寺景区', '西藏自治区', '拉萨市', 2013,
   '宗教寺观', '唐', true, true,
   NULL, ST_SetSRID(ST_MakePoint(91.13, 29.653), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (20, '塔尔寺景区', '青海省', '西宁市', 2012,
   '宗教寺观', '明', false, true,
   NULL, ST_SetSRID(ST_MakePoint(101.567, 36.496), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (21, '崇圣寺三塔文化旅游区', '云南省', '大理州', 2011,
   '宗教寺观', '唐、五代', false, true,
   NULL, ST_SetSRID(ST_MakePoint(100.149, 25.706), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (22, '泰山景区', '山东省', '泰安市', 2007,
   '历史名山', '先秦至清', true, true,
   '世界文化与自然双遗产，封禅文化名山', ST_SetSRID(ST_MakePoint(117.101, 36.256), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (23, '五台山风景名胜区', '山西省', '忻州市', 2007,
   '历史名山', '唐至清', true, true,
   '世界文化景观，佛教四大名山之一', ST_SetSRID(ST_MakePoint(113.587, 38.96), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (24, '武当山风景区', '湖北省', '十堰市', 2011,
   '历史名山', '明', true, true,
   '道教名山，武当山古建筑群为世界遗产', ST_SetSRID(ST_MakePoint(111.004, 32.403), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (25, '峨眉山景区', '四川省', '乐山市', 2007,
   '历史名山', '唐至清', true, true,
   '世界文化与自然双遗产，佛教四大名山之一', ST_SetSRID(ST_MakePoint(103.334, 29.524), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (26, '云冈石窟景区', '山西省', '大同市', 2007,
   '石窟石刻', '北魏', true, true,
   NULL, ST_SetSRID(ST_MakePoint(113.137, 40.109), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (27, '龙门石窟景区', '河南省', '洛阳市', 2007,
   '石窟石刻', '北魏至唐', true, true,
   NULL, ST_SetSRID(ST_MakePoint(112.477, 34.555), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (28, '大足石刻景区', '重庆市', '重庆市', 2007,
   '石窟石刻', '唐、宋', true, true,
   '坐标取宝顶山石刻', ST_SetSRID(ST_MakePoint(105.788, 29.775), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (29, '麦积山景区', '甘肃省', '天水市', 2011,
   '石窟石刻', '十六国至明', true, true,
   '丝绸之路：长安-天山廊道路网世界遗产组成部分', ST_SetSRID(ST_MakePoint(105.973, 34.349), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (30, '秦始皇帝陵博物院景区', '陕西省', '西安市', 2007,
   '古遗址', '秦', true, true,
   '含兵马俑坑与秦始皇陵', ST_SetSRID(ST_MakePoint(109.279, 34.385), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (31, '殷墟景区', '河南省', '安阳市', 2011,
   '古遗址', '商', true, true,
   NULL, ST_SetSRID(ST_MakePoint(114.305, 36.122), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (32, '大明宫旅游景区', '陕西省', '西安市', 2020,
   '古遗址', '唐', true, true,
   '丝绸之路：长安-天山廊道路网世界遗产组成部分', ST_SetSRID(ST_MakePoint(108.968, 34.294), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (33, '水洞沟旅游区', '宁夏回族自治区', '银川市', 2015,
   '古遗址', '旧石器时代、明', false, true,
   '旧石器时代遗址与明长城复合景区', ST_SetSRID(ST_MakePoint(106.521, 38.325), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (34, '明十三陵景区', '北京市', '北京市', 2011,
   '陵寝墓葬', '明', true, true,
   '明清皇家陵寝世界遗产组成部分', ST_SetSRID(ST_MakePoint(116.245, 40.256), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (35, '清东陵景区', '河北省', '唐山市', 2015,
   '陵寝墓葬', '清', true, true,
   NULL, ST_SetSRID(ST_MakePoint(117.66, 40.19), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (36, '乾陵景区', '陕西省', '咸阳市', 2024,
   '陵寝墓葬', '唐', false, true,
   '唐高宗与武则天合葬陵', ST_SetSRID(ST_MakePoint(108.221, 34.576), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (37, '明显陵文化旅游景区', '湖北省', '荆门市', 2024,
   '陵寝墓葬', '明', true, true,
   '明清皇家陵寝世界遗产组成部分', ST_SetSRID(ST_MakePoint(112.638, 31.22), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (38, '八达岭—慕田峪长城旅游区', '北京市', '北京市', 2007,
   '关隘长城', '明', true, true,
   '坐标取八达岭', ST_SetSRID(ST_MakePoint(116.0243, 40.3593), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (39, '嘉峪关文物景区', '甘肃省', '嘉峪关市', 2007,
   '关隘长城', '明', true, true,
   '万里长城西端起点，长城世界遗产组成部分', ST_SetSRID(ST_MakePoint(98.216, 39.803), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (40, '秦皇岛市山海关景区', '河北省', '秦皇岛市', 2007,
   '关隘长城', '明', true, true,
   '2015 年被取消 5A 等级，2018 年复牌', ST_SetSRID(ST_MakePoint(119.756, 40.009), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (41, '剑门蜀道剑门关旅游景区', '四川省', '广元市', 2015,
   '关隘长城', '三国', false, true,
   '蜀道核心关隘', ST_SetSRID(ST_MakePoint(105.551, 32.201), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (42, '三坊七巷景区', '福建省', '福州市', 2015,
   '历史街区', '晋至民国', false, true,
   NULL, ST_SetSRID(ST_MakePoint(119.297, 26.083), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (43, '鼓浪屿风景名胜区', '福建省', '厦门市', 2007,
   '历史街区', '清末至民国', true, true,
   '历史国际社区世界文化遗产', ST_SetSRID(ST_MakePoint(118.067, 24.449), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (44, '西安城墙·碑林历史文化景区', '陕西省', '西安市', 2018,
   '复合人文', '宋至明', false, true,
   '明城墙与西安碑林复合景区', ST_SetSRID(ST_MakePoint(108.946, 34.254), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (45, '黄鹤楼公园', '湖北省', '武汉市', 2007,
   '复合人文', '三国始建', false, false,
   '历史名楼，现存建筑为 1985 年复建', ST_SetSRID(ST_MakePoint(114.302, 30.543), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (46, '杭州西湖风景区', '浙江省', '杭州市', 2007,
   '复合人文', '唐至清', true, true,
   '世界文化景观，坐标取湖心', ST_SetSRID(ST_MakePoint(120.145, 30.245), 4326))
ON CONFLICT (id) DO NOTHING;
INSERT INTO wengis.ancient_5a
  (id, name, province, city, rating_year, category, dynasty, world_heritage, major_site, note, geom)
VALUES
  (47, '夫子庙·秦淮风光带景区', '江苏省', '南京市', 2010,
   '复合人文', '宋至清', false, true,
   NULL, ST_SetSRID(ST_MakePoint(118.79, 32.023), 4326))
ON CONFLICT (id) DO NOTHING;
COMMIT;
