// 改进构建校验：与前端共用严格校验，避免两套校验口径漂移。
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateSpots } from '../src/data/validateSpots.ts';
import { categoryCounts } from '../src/data/filterSpots.ts';
import { attachEvidence } from '../src/data/spotEvidence.ts';
import { verifiedRecords } from '../data/provenance/verified.ts';
const target = process.argv[2] ? resolve(process.argv[2]) : new URL('../data/geojson/ancient_5a.sample.geojson', import.meta.url);
try {
  const data = validateSpots(JSON.parse(readFileSync(target, 'utf8')));
  console.log(`[OK] 校验通过：${data.features.length} 个要素`);
  console.log('类别分布：', JSON.stringify(Object.fromEntries(categoryCounts(data.features))));
  // 默认工作数据必须匹配所有证据；自定义文件只检查其基础结构。
  if (!process.argv[2]) {
    const enriched = attachEvidence(data, verifiedRecords);
    console.log(`[OK] 来源关联：${enriched.features.filter(f => f.properties.evidence?.heritageSources.length).length} / ${data.features.length}；坐标均待核验`);
  }
} catch (error) {
  console.error(`[FAIL] 数据校验失败：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
