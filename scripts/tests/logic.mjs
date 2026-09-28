// 回归测试覆盖组合筛选、截止年份、统计守恒、注入转义和异常数据拒绝。
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterSpots, categoryCounts } from '../../src/data/filterSpots.ts';
import { validateSpots } from '../../src/data/validateSpots.ts';
import { escapeHtml } from '../../src/components/escapeHtml.ts';
const data = validateSpots(JSON.parse(readFileSync(new URL('../../data/geojson/ancient_5a.sample.geojson', import.meta.url), 'utf8')));
const all = { keyword: '', province: '', category: '', dynasty: '', untilYear: 2026 };
assert.equal(filterSpots(data.features, all).length, 47);
const palace = filterSpots(data.features, { ...all, keyword: '故宫', province: '北京市', category: '宫殿坛庙', dynasty: '明、清' });
assert.equal(palace.length, 1);
assert.equal(palace[0].properties.name, '故宫博物院');
assert.equal(filterSpots(data.features, { ...all, keyword: '不存在的景区' }).length, 0);
assert.ok(filterSpots(data.features, { ...all, untilYear: 2007 }).every(f => f.properties.ratingYear <= 2007));
assert.equal([...categoryCounts(data.features).values()].reduce((a, b) => a + b, 0), 47);
assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
for (const mutate of [
  f => { f.properties.ratingYear = '2007'; },
  f => { f.properties.category = '未知'; },
  f => { f.properties.worldHeritage = 'true'; },
  f => { f.geometry.coordinates[0] = 200; },
  f => { f.properties.note = {}; },
]) {
  const broken = structuredClone(data);
  mutate(broken.features[0]);
  assert.throws(() => validateSpots(broken), /不合法/);
}
const duplicate = structuredClone(data);
duplicate.features.push(duplicate.features[0]);
assert.throws(() => validateSpots(duplicate), /重复 id/);
console.log('通过：组合筛选、空结果、年份边界、统计、HTML 转义与六类异常数据。');
