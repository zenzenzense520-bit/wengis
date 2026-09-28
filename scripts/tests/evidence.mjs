// 验证逐字段证据关联、来源安全与待核验回退，并导出 47 点核验清单。
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { validateSpots } from '../../src/data/validateSpots.ts';
import { attachEvidence, safeSourceUrl } from '../../src/data/spotEvidence.ts';
import { renderEvidence } from '../../src/components/evidencePanel.ts';
import { verifiedRecords } from '../../data/provenance/verified.ts';
const data = validateSpots(JSON.parse(readFileSync(new URL('../../data/geojson/ancient_5a.sample.geojson', import.meta.url), 'utf8')));
const result = attachEvidence(data, verifiedRecords);
assert.equal(result.features.length, 47);
assert.equal(result.features.filter(f => f.properties.evidence.heritageSources.length).length, 5);
assert.ok(result.features.every(f => f.properties.evidence.coordinateStatus === 'approximate'));
assert.ok(renderEvidence(result.features[0].properties).includes('https://whc.unesco.org/en/list/439/'));
assert.ok(renderEvidence(result.features[3].properties).includes('暂未补齐逐条官方来源'));
assert.ok(renderEvidence(result.features[0].properties).includes('未逐点核验'));
assert.equal(data.features[0].properties.evidence, undefined, '原始样例不被修改');
for (const mutate of [
  records => { records[0].spotId = 999; },
  records => { records[0].spotName = '错误名称'; },
  records => { records[0].sources[0].expectedValue = false; },
  records => { records.push(records[0]); },
  records => { records[0].sources = []; },
  records => { records[0].sources[0].checkedAt = '2026-02-30'; },
  records => { records[0].sources[0].url = 'javascript:alert(1)'; },
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
// 清单为派生验证产物，CSV 文本字段加引号并转义。
const cell = value => `"${String(value).replaceAll('"', '""')}"`;
const rows = result.features.map(({ properties: p, geometry }) => [
  p.id, p.name, ...geometry.coordinates,
  p.evidence.heritageSources.length ? '关联身份已核验' : '待核验',
  '待核验', '待核验', '待核验', '样例近似坐标，未逐点核验',
  p.evidence.heritageSources[0]?.url ?? '', p.evidence.heritageSources[0]?.checkedAt ?? '',
].map(cell).join(','));
writeFileSync(new URL('../../logs/evidence-audit.csv', import.meta.url), '\uFEFF编号,景区,经度,纬度,世界遗产关联,5A年份,朝代,文保身份,坐标状态,来源,核验日期\n' + rows.join('\n') + '\n');
console.log('通过：5 / 47 条遗产关联、待核验回退、错误证据拒绝、安全链接和转义；已导出核验清单。');
