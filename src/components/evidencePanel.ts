import type { SpotProperties } from '../types/spot';
import { safeSourceUrl } from '../data/spotEvidence.ts';
import { escapeHtml } from './escapeHtml.ts';
import type { FieldSource } from '../types/evidence';

function renderSource(source: FieldSource): string {
  const field = source.field === 'worldHeritage' ? '世界遗产关联' : source.field === 'ratingYear' ? '5A 评定年份' : '坐标候选';
  const coordinate = source.field === 'coordinates' ? `<p>参考点（WGS84，经度、纬度）：${source.referencePoint.join(', ')}</p>
    <p><a href="${safeSourceUrl(source.attributionUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.attribution)} · ${source.license}</a></p>` : '';
  return `<li data-source-field="${source.field}"><strong>${field}</strong>：
    <a href="${escapeHtml(safeSourceUrl(source.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)}</a>
    <span>${escapeHtml(source.publisher)} · 查阅日期 ${escapeHtml(source.checkedAt)}</span>
    <p>${escapeHtml(source.scope)}</p>${coordinate}</li>`;
}

// 新增弹窗来源展示；逐字段说明状态，不提供整条数据的“已认证”标记。
export function renderEvidence(properties: SpotProperties): string {
  const heritage = properties.evidence?.heritageSources ?? [];
  const ratings = properties.evidence?.ratingSources ?? [];
  const coordinates = properties.evidence?.coordinateSources ?? [];
  const links = [...heritage, ...ratings, ...coordinates].map(renderSource).join('');
  return `<section class="popup-evidence" aria-label="资料来源与核验状态">
    <h3>资料来源与核验</h3>
    <p>世界遗产关联：${heritage.length ? '已核验关联身份' : '待核验'}</p>
    <p>5A 年份：${ratings.length ? '已核验评定年份' : '待核验'}。</p>
    <p>朝代记录、全国重点文保身份：待逐字段核验。</p>
    <p>坐标来源：${coordinates.length ? '已记录候选，入口未核验' : '尚无逐条坐标来源'}。</p>
    <p>坐标：样例近似点（约 1 km），未逐点核验，不能用于导航或边界分析。</p>
    ${links ? `<ul>${links}</ul>` : '<p>本景区暂未补齐逐条官方来源。</p>'}
  </section>`;
}
