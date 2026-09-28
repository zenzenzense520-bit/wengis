import type { SpotProperties } from '../types/spot';
import { safeSourceUrl } from '../data/spotEvidence.ts';
import { escapeHtml } from './escapeHtml.ts';

// 新增弹窗来源展示；逐字段说明状态，不提供整条数据的“已认证”标记。
export function renderEvidence(properties: SpotProperties): string {
  const sources = properties.evidence?.heritageSources ?? [];
  const links = sources.map(source => `
    <li><a href="${escapeHtml(safeSourceUrl(source.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)}</a>
    <span>${escapeHtml(source.publisher)} · 核验日期 ${escapeHtml(source.checkedAt)}</span>
    <p>${escapeHtml(source.scope)}</p></li>`).join('');
  return `<section class="popup-evidence" aria-label="资料来源与核验状态">
    <h3>资料来源与核验</h3>
    <p>世界遗产关联：${sources.length ? '已核验关联身份' : '待核验'}</p>
    <p>5A 年份、朝代记录、全国重点文保身份：待逐字段核验。</p>
    <p>坐标：样例近似点（约 1 km），未逐点核验，不能用于导航或边界分析。</p>
    ${links ? `<ul>${links}</ul>` : '<p>本景区暂未补齐逐条官方来源。</p>'}
  </section>`;
}
