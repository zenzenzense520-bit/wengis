// 核对全量筛选底稿：解析 358 官方名单，校验 seed 中的景区均在名单内，生成排除清单与分布统计
// 用法：node scripts/check-seed.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rawPath = join(root, 'data/raw/mct_5a_2025.txt');
const seedPath = join(root, 'data/works/ancient_5a_seed.json');
const excludePath = join(root, 'data/works/excluded_list.csv');

// 名称规范化：去空白、统一标点，便于跨写法匹配
function norm(s) {
  return (s || '')
    .replace(/\s+/g, '')
    .replace(/[—–－-]/g, '-')
    .replace(/[（(]/g, '(').replace(/[）)]/g, ')')
    .replace(/[·•]/g, '·').replace(/[，,]/g, ',');
}

// 1. 解析官方名单
const lines = readFileSync(rawPath, 'utf8').split(/\r?\n/);
const raw = [];
let province = '';
const provHeader = /^(.+?)（\d+个）\s*$/;
for (const line of lines) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const mh = t.match(provHeader);
  if (mh) { province = mh[1]; continue; }
  const yearMatch = t.match(/(\d{4}(?:\/\d{4})?)年\s*$/);
  // 去掉行末评定年份，如 "2007年"、"2007/2018年"
  const name = t.replace(/\s*\d{4}(\/\d{4})?年\s*$/, '').trim();
  if (name) raw.push({
    province,
    name,
    ratingYears: yearMatch ? yearMatch[1].split('/').map(Number) : [],
  });
}
// 去重：黄河壶口瀑布在山西、陕西各出现一次
const seen = new Map();
for (const r of raw) {
  const k = norm(r.name);
  if (!seen.has(k)) seen.set(k, r);
}
const official = [...seen.values()];
const officialNorm = new Set(official.map((r) => norm(r.name)));
const officialByName = new Map();
for (const row of raw) {
  const key = norm(row.name);
  officialByName.set(key, [...(officialByName.get(key) ?? []), row]);
}

function normProvince(value) {
  return value.replace(/(壮族自治区|回族自治区|维吾尔自治区|自治区|省|市)$/, '');
}

// 2. 加载 seed
const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
const spots = seed.spots;

// 3. 校验
const errors = [];
const ids = new Set();
for (const s of spots) {
  if (ids.has(s.id)) errors.push(`id 重复: ${s.id} ${s.name}`);
  ids.add(s.id);
  if (!officialNorm.has(norm(s.name))) {
    errors.push(`不在官方名单: [${s.id}] ${s.name} (${s.province})`);
    continue;
  }
  const matches = officialByName.get(norm(s.name)) ?? [];
  if (!matches.some((row) => normProvince(row.province) === normProvince(s.province))) {
    errors.push(`省份与官方名单不符: [${s.id}] ${s.name} (${s.province})`);
  }
  const officialYears = [...new Set(matches.flatMap((row) => row.ratingYears))];
  if (!officialYears.includes(s.ratingYear)) {
    errors.push(`评定年份与官方名单不符: [${s.id}] ${s.name} (${s.ratingYear}; 官方: ${officialYears.join('/') || '缺失'})`);
  }
  if (officialYears.length > 1 && !/复牌|摘牌|重新评定|重新获评/.test(s.note ?? '')) {
    errors.push(`多次评定/复牌年份缺少 note 说明: [${s.id}] ${s.name} (官方: ${officialYears.join('/')})`);
  }
}
// id 连续性
const idArr = [...ids].sort((a, b) => a - b);
for (let i = 0; i < idArr.length; i++) {
  if (idArr[i] !== i + 1) errors.push(`id 不连续: 期望 ${i + 1}，实际 ${idArr[i]}`);
}

// 4. 排除清单（官方名单中未纳入的）
const seedNorm = new Set(spots.map((s) => norm(s.name)));
const excluded = official.filter((r) => !seedNorm.has(norm(r.name)));

// 排除原因（按关键词给出初步分类，供人工复核）
function excludeReason(name) {
  const n = name;
  if (/大槐树|寻根|祭祖园/.test(n)) return '现代祭祖文化园';
  if (/北京奥林匹克公园/.test(n)) return '现代城市公园/场馆/度假区';
  if (/黄河壶口瀑布/.test(n)) return '自然景观/自然为主（含山岳、湖泊、峡谷、溶洞、草原、湿地、海滨等）';
  if (/西柏坡|韶山|井冈山|瑞金|邓小平|周恩来|朱德|延安|一大|二大|四大|花明楼|古田|红军|百色起义|共和国摇篮|三五九旅|185团|一大|纪念馆|纪念园|烈士|起义|革命|红旗|少奇|陈云|彭德怀|贺龙|陈毅|叶剑英|聂荣臻|刘伯承|粟裕|李大钊|陈潭秋|鲁迅公园/.test(n)) return '红色/近现代革命史迹';
  if (/影视城|影视基地|主题|乐园|恐龙城|方特|长隆|迪士尼|欢乐世界|欢乐谷|海洋公园|海洋文化|极地馆|华夏城|长影|环球|嬉戏谷|喀斯特|根宫|佛国|大佛|南山景区|大觉山|六鼎山|大佛|圆明新园|清明上河园|台儿庄|淹城|濯水|汶川|羌城|古文化街|津门故里/.test(n)) return '现代主题园/仿古园/影视城/现代重建/现代造像';
  if (/净月潭|泰宁|稻城|亚丁|海螺沟|黄龙|九寨沟|沟|潭|湖|河|山|峡|洞|滩|湾|岛|泉|瀑|林|草原|湿地|沙漠|沙丘|沙坡头|丹霞|石林|峰林|峡谷|天池|雪山|冰川|地质|森林公园|自然|生态|海滨|海滩|滨海|海角|千岛湖|太湖|西湖|云龙湖|溱湖|天目湖|玄武湖|玄武|东江湖|万绿湖|洪泽湖|微山湖|查干湖|镜泊湖|五大连池|喀纳斯|那拉提|巴音布鲁克|喀拉峻|赛里木|博斯腾|江布拉克|托木尔|魔鬼城|可可托海|天山大峡谷|葡萄沟|胡杨|阿尔山|柴河|阿斯哈图|莫尔格勒|呼伦贝尔|响沙湾|中俄边境|白沙湖|漠河|北极村|扎龙|虎头|林海奇石|太阳岛|红海滩|本溪水洞|金石滩|老虎滩|连岛|麋鹿|鼋头渚|沙家浜|沙家|虞山|尚湖|双龙|云和梯田|神仙居|雁荡山|西溪|千岛湖|万佛湖|八里河|天堂寨|天柱山|冠豸山|太姥山|白水洋|鸳鸯溪|三百山|西海|武功山|龟峰|大觉山|明月山|黄果树|龙宫|荔波|樟江|百里杜鹃|织金洞|万峰林|赤水|梵净山|普者黑|火山热海|世博园|普达措|热带植物园|玉龙雪山|石林|雅鲁藏布|巴松措|乾坤湾|太白山|金丝峡|冶力关|官鹅沟|七彩丹霞|鸣沙山|月牙泉|青海湖|阿咪东索|土族故土园|六盘山|沙湖|大裂谷|阿依河|龙缸|四面山|金佛山|黑山谷|龙鳞石海|桃花源|小三峡|武隆|喀斯特|武陵源|天门山|东江湖|崀山|海陵岛|大角湾|涠洲岛|鳄鱼山|德天|青秀山|两江四湖|象山|漓江|天涯海角|蜈支洲|槟榔谷|分界洲|呀诺达|大小洞天|南山文化|万绿湖|雁南飞|观澜湖|地下河|丹霞山|西樵|罗浮|星湖|鼎湖|长鹿|骑楼|奥帆|萤火虫|地下大峡谷|黄河口|微山湖|沂蒙山|沂蒙|云台山|神农山|青天河|宝泉|八里沟|嵖岈山|恐龙|伏牛山|老界岭|龙潭|白云山|尧山|中原大佛|龟峰|麻城|龟峰山|三峡大瀑布|腾龙洞|恩施大峡谷|木兰|东湖|清江|神农架|神农溪|三峡人家|三峡大坝|屈原故里|矮寨|十八洞|德夯|衡山|东江湖|栖霞|太白|浮戏|浮山|野三坡|白石山|白洋淀|衡水湖|南湖|开滦|老牛湾|云丘山|八泉峡|太行山大峡谷|大槐树|绵山|绵山|千山|盘山|本溪水洞|五女山|阿尔山|阿尔山/.test(n)) return '自然景观/自然为主（含山岳、湖泊、峡谷、溶洞、草原、湿地、海滨等）';
  if (/科技馆|博物馆$|雕塑公园|植物园|野生动物园|动物园|世博园|会展|奥体|奥林匹克|东方明珠|明珠|电视塔|城市公园|中央公园|商务|金鸡湖|观澜湖|高尔夫|度假|温泉|度假区|休闲|时尚|欢乐|水世界|冰雪世界|不夜城|步行街|古文化街|津门故里/.test(n)) return '现代城市公园/场馆/度假区';
  return '其他/待人工复核';
}

// 5. 输出分布统计
function tally(arr, key) {
  const m = new Map();
  for (const a of arr) m.set(a[key], (m.get(a[key]) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || (a[0] > b[0] ? 1 : -1));
}

const byCategory = tally(spots, 'category');
const byGroup = tally(spots, 'dynastyGroup');
const byProvince = tally(spots, 'province');
const wh = spots.filter((s) => s.worldHeritage).length;
const ms = spots.filter((s) => s.majorSite).length;

console.log('===== 核对结果 =====');
console.log(`官方名单（去重壶口后）: ${official.length} 家`);
console.log(`纳入古代类: ${spots.length} 家`);
console.log(`排除: ${excluded.length} 家`);
console.log(`核对: ${official.length} = ${spots.length} + ${excluded.length} = ${spots.length + excluded.length}`);
console.log(`世界文化遗产: ${wh} 家；全国重点文保: ${ms} 家`);
console.log('\n===== 错误 =====');
if (errors.length === 0) console.log('无');
else errors.forEach((e) => console.log('  ' + e));

console.log('\n===== 按类别 =====');
byCategory.forEach(([k, v]) => console.log(`  ${k}: ${v}`));
console.log('\n===== 按朝代组（主时间轴） =====');
const order = seed.meta.dynastyGroups;
for (const g of order) console.log(`  ${g}: ${byGroup.find((x) => x[0] === g)?.[1] || 0}`);
console.log('\n===== 按省份 =====');
byProvince.forEach(([k, v]) => console.log(`  ${k}: ${v}`));

// 6. 写排除清单 CSV
const reasonCount = new Map();
const rows = [['province', 'name', 'exclude_reason'].join(',')];
for (const e of excluded) {
  const r = excludeReason(e.name);
  reasonCount.set(r, (reasonCount.get(r) || 0) + 1);
  rows.push([e.province, e.name.replace(/,/g, '，'), r].join(','));
}
writeFileSync(excludePath, '﻿' + rows.join('\n'), 'utf8');
console.log('\n===== 排除原因汇总 =====');
[...reasonCount.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
console.log(`\n排除清单已写入: data/works/excluded_list.csv`);

// 7. 标记脚本失败
if (errors.length) process.exit(1);
