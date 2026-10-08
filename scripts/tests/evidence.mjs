// 验证逐字段证据关联、来源安全与待核验回退，并导出 47 点核验清单。
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { validateSpots } from '../../src/data/validateSpots.ts';
import { filterSpots } from '../../src/data/filterSpots.ts';
import { attachEvidence, ratingYearStatus, safeSourceUrl } from '../../src/data/spotEvidence.ts';
import { renderEvidence } from '../../src/components/evidencePanel.ts';
import { verifiedRecords } from '../../data/provenance/verified.ts';
const data = validateSpots(JSON.parse(readFileSync(new URL('../../data/geojson/ancient_5a.sample.geojson', import.meta.url), 'utf8')));
const result = attachEvidence(data, verifiedRecords);
// 按景区编号和字段定位来源，避免新增记录或调整来源顺序影响回归范围。
const sourceFor = (records, id, field) => {
  const source = records.find(record => record.spotId === id)?.sources.find(item => item.field === field);
  assert.ok(source, `缺少景区 ${id} 的 ${field} 来源`);
  return source;
};
const ratingStatus = source => !source ? '待核验' : source.detailYearText
  ? '官方站内年份冲突，待核查' : source.yearBasis === 'earliest-listed'
    ? '多年份记录，按最早列示年份累计' : '官方列示年份一致';
assert.equal(result.features.length, 47);
assert.equal(result.features.filter(f => f.properties.evidence.heritageSources.length).length, 5);
assert.ok(result.features.every(f => f.properties.evidence.ratingSources.length === 1));
assert.deepEqual(verifiedRecords.map(record => record.spotId), Array.from({ length: 47 }, (_, index) => index + 1));
assert.equal(result.features.filter(f => ratingYearStatus(f.properties) === 'single').length, 45);
assert.equal(result.features.filter(f => ratingYearStatus(f.properties) === 'multiple').length, 1);
assert.equal(result.features.filter(f => ratingYearStatus(f.properties) === 'conflict').length, 1);
assert.equal(result.features.filter(f => f.properties.evidence.coordinateSources.length).length, 5);
assert.deepEqual(result.features.map(f => f.geometry), data.features.map(f => f.geometry), '候选不得覆盖地图坐标');
assert.ok(result.features.every(f => f.properties.evidence.coordinateStatus === 'approximate'));
assert.ok(renderEvidence(result.features[0].properties).includes('https://whc.unesco.org/en/list/439/'));
assert.ok(renderEvidence(result.features[0].properties).includes('未逐点核验'));
assert.ok(renderEvidence(result.features[0].properties).includes('官方列示年份一致'));
assert.ok(renderEvidence(result.features[0].properties).includes('已记录候选，入口未核验'));
assert.ok(renderEvidence(result.features[0].properties).includes('ODbL-1.0'));
// 没有来源时依然显示待核验；年份核对不能升级其他字段状态。
const withoutEvidence = attachEvidence(data, []).features[3].properties;
assert.ok(renderEvidence(withoutEvidence).includes('暂未补齐逐条官方来源'));
assert.ok(renderEvidence(withoutEvidence).includes('5A 年份：待核验'));
assert.ok(renderEvidence(result.features[3].properties).includes('世界遗产关联：待核验'));
assert.ok(renderEvidence(result.features[3].properties).includes('尚无逐条坐标来源'));
const shanhaiguan = result.features.find(f => f.properties.id === 40);
assert.ok(shanhaiguan);
const multiYear = sourceFor(verifiedRecords, 40, 'ratingYear');
assert.equal(multiYear.officialYearText, '2007/2018年');
assert.equal(multiYear.expectedValue, 2007);
assert.equal(multiYear.yearBasis, 'earliest-listed');
const mountainHtml = renderEvidence(shanhaiguan.properties);
assert.ok(mountainHtml.includes('2007/2018年'));
assert.ok(mountainHtml.includes('多年份记录，按最早列示年份累计'));
// 殷墟在文旅部站内出现 2011/2010 冲突，不升级为年份一致。
const yinxu = result.features.find(f => f.properties.id === 31);
assert.ok(yinxu);
assert.equal(sourceFor(verifiedRecords, 31, 'ratingYear').detailYearText, '2010年');
assert.equal(yinxu.properties.ratingYear, 2011);
assert.ok(renderEvidence(yinxu.properties).includes('官方站内年份冲突，待核查'));
assert.ok(renderEvidence(yinxu.properties).includes('2010年'));
const filters = { keyword: '山海关', province: '', category: '', dynasty: '', untilYear: 2007 };
assert.deepEqual(filterSpots(result.features, filters).map(f => f.properties.id), [40]);
assert.equal(filterSpots(result.features, { ...filters, untilYear: 2006 }).length, 0);
assert.equal(data.features[0].properties.evidence, undefined, '原始样例不被修改');
for (const mutate of [
  records => { records[0].spotId = 999; },
  records => { records[0].spotName = '错误名称'; },
  records => { sourceFor(records, 1, 'worldHeritage').expectedValue = false; },
  records => { records.push(records[0]); },
  records => { records[0].sources = []; },
  records => { sourceFor(records, 1, 'worldHeritage').checkedAt = '2026-02-30'; },
  records => { sourceFor(records, 1, 'worldHeritage').url = 'javascript:alert(1)'; },
  records => { sourceFor(records, 1, 'ratingYear').expectedValue = 2010; },
  records => { sourceFor(records, 1, 'ratingYear').officialName = ''; },
  records => { sourceFor(records, 1, 'ratingYear').officialYearText = ''; },
  records => { sourceFor(records, 1, 'ratingYear').officialYearText = '2010年'; },
  records => { sourceFor(records, 1, 'ratingYear').yearBasis = 'earliest-listed'; },
  records => { sourceFor(records, 40, 'ratingYear').yearBasis = 'single-listed'; },
  records => { sourceFor(records, 40, 'ratingYear').expectedValue = 2018; },
  records => { sourceFor(records, 40, 'ratingYear').officialYearText = '2007/未知年'; },
  records => { sourceFor(records, 40, 'ratingYear').yearBasis = 'current-valid'; },
  records => { sourceFor(records, 31, 'ratingYear').detailYearText = '2011年'; },
  records => { sourceFor(records, 31, 'ratingYear').detailYearText = '未知'; },
  records => { sourceFor(records, 31, 'ratingYear').detailUrl = 'https://example.com/'; },
  records => { sourceFor(records, 31, 'ratingYear').detailUrl = undefined; },
  records => { sourceFor(records, 1, 'coordinates').referencePoint = [200, 39]; },
  records => { sourceFor(records, 1, 'coordinates').role = 'verified'; },
  records => { sourceFor(records, 1, 'coordinates').attribution = ''; },
  records => { sourceFor(records, 1, 'coordinates').crs = 'GCJ-02'; },
]) {
  const broken = structuredClone(verifiedRecords);
  mutate(broken);
  assert.throws(() => attachEvidence(data, broken));
}
assert.throws(() => safeSourceUrl('https://user:secret@example.com/'));
assert.throws(() => safeSourceUrl('http://whc.unesco.org/'));
const injection = structuredClone(result.features[0].properties);
injection.evidence.heritageSources[0].title = '<script>alert(1)</script>';
assert.ok(!renderEvidence(injection).includes('<script>'));
const nameInjection = structuredClone(result.features[0].properties);
nameInjection.evidence.ratingSources[0].officialName = '<img src=x onerror="alert(1)">';
assert.ok(!renderEvidence(nameInjection).includes('<img'));
// 清单为派生验证产物；文本公式前缀加单引号，避免表格软件执行。
const cell = value => {
  const raw = String(value);
  const safe = typeof value === 'string' && /^\s*[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replaceAll('"', '""')}"`;
};
assert.equal(cell('=1+1'), '"\'=1+1"');
assert.equal(cell('正常景区'), '"正常景区"');
const rows = result.features.map(({ properties: p, geometry }) => [
  p.id, p.name, ...geometry.coordinates,
  p.evidence.heritageSources.length ? '关联身份已核验' : '待核验',
  ratingStatus(p.evidence.ratingSources[0]), '待核验', '待核验', '样例近似坐标，未逐点核验',
  p.evidence.heritageSources[0]?.url ?? '', p.evidence.heritageSources[0]?.checkedAt ?? '',
  p.evidence.ratingSources[0]?.url ?? '',
  p.evidence.ratingSources[0]?.checkedAt ?? '',
  p.evidence.ratingSources[0]?.officialName ?? '', p.evidence.ratingSources[0]?.officialYearText ?? '',
  p.evidence.ratingSources[0]?.detailYearText ?? '', p.evidence.ratingSources[0]?.detailUrl ?? '',
  p.ratingYear, p.evidence.ratingSources[0]?.yearBasis === 'earliest-listed' ? '按最早列示年份累计' : '按列示年份累计',
  p.evidence.coordinateSources[0]?.referencePoint[0] ?? '', p.evidence.coordinateSources[0]?.referencePoint[1] ?? '',
  p.evidence.coordinateSources[0]?.url ?? '', p.evidence.coordinateSources[0]?.checkedAt ?? '',
  p.evidence.coordinateSources[0]?.license ?? '', p.evidence.coordinateSources[0]?.attribution ?? '',
  p.evidence.coordinateSources.length ? '候选参考点，入口未核验' : '尚无逐条坐标来源',
].map(cell).join(','));
writeFileSync(new URL('../../logs/evidence-audit.csv', import.meta.url), '\uFEFF编号,景区,经度,纬度,世界遗产关联,5A年份,朝代,文保身份,坐标状态,遗产来源,遗产查阅日期,年份来源,年份查阅日期,官方名称,年份原文,详情年份原文,详情来源,累计筛选年份,累计口径,候选经度,候选纬度,候选来源,候选查阅日期,候选许可,候选署名,候选状态\n' + rows.join('\n') + '\n');
console.log('通过：47 条年份核对（45 一致、1 多年份、1 站内冲突），山海关累计边界；5 条遗产关联及坐标候选不变。');
