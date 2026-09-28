// 改进构建校验：与前端共用严格校验，避免两套校验口径漂移。
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateSpots } from '../src/data/validateSpots.ts';
import { categoryCounts } from '../src/data/filterSpots.ts';
const target = process.argv[2] ? resolve(process.argv[2]) : new URL('../data/geojson/ancient_5a.sample.geojson', import.meta.url);
try {
  const data = validateSpots(JSON.parse(readFileSync(target, 'utf8')));
  console.log(`[OK] 校验通过：${data.features.length} 个要素`);
  console.log('类别分布：', JSON.stringify(Object.fromEntries(categoryCounts(data.features))));
} catch (error) {
  console.error(`[FAIL] 数据校验失败：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
