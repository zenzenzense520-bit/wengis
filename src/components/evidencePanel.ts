import type { SpotProperties } from '../types/spot';
import { safeSourceUrl, ratingYearStatus } from '../data/spotEvidence.ts';
import { escapeHtml } from './escapeHtml.ts';
import type { FieldSource } from '../types/evidence';

function renderSource(source: FieldSource): string {
  const field = source.field === 'worldHeritage' ? '世界遗产关联' : source.field === 'ratingYear' ? '5A 评定年份' : '坐标候选';
  const coordinate = source.field === 'coordinates' ? `<p>参考点（WGS84，经度、纬度）：${source.referencePoint.join(', ')}</p>
    <p><a href="${safeSourceUrl(source.attributionUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.attribution)} · ${source.license}</a></p>` : '';
  // 名单原文与样例值分别展示，避免把双年份压缩成完整历史评级。
  const rating = source.field === 'ratingYear' ? `<p>官方名称：${escapeHtml(source.officialName)}</p>
    <p>名单年份原文：${escapeHtml(source.officialYearText)}；累计口径：${source.yearBasis === 'earliest-listed' ? '最早列示年份' : '单一列示年份'}。</p>
    ${source.detailYearText && source.detailUrl ? `<p>同站详情页年份：${escapeHtml(source.detailYearText)}，与名单冲突；<a href="${escapeHtml(safeSourceUrl(source.detailUrl))}" target="_blank" rel="noopener noreferrer">查看详情页</a>。</p>` : ''}` : '';
  return `<li data-source-field="${source.field}"><strong>${field}</strong>：
    <a href="${escapeHtml(safeSourceUrl(source.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)}</a>
    <span>${escapeHtml(source.publisher)} · 查阅日期 ${escapeHtml(source.checkedAt)}</span>
    <p>${escapeHtml(source.scope)}</p>${rating}${coordinate}</li>`;
}

// 新增弹窗来源展示；逐字段说明状态，不提供整条数据的“已认证”标记。
export function renderEvidence(properties: SpotProperties): string {
  const heritage = properties.evidence?.heritageSources ?? [];
  const ratings = properties.evidence?.ratingSources ?? [];
  const coordinates = properties.evidence?.coordinateSources ?? [];
  const ratingStatus = ratingYearStatus(properties);
  const ratingLabel = ratingStatus === 'single' ? '官方列示年份一致' : ratingStatus === 'multiple' ?
    '多年份记录，按最早列示年份累计' : ratingStatus === 'conflict' ? '官方站内年份冲突，待核查' : '待核验';
  const links = [...heritage, ...ratings, ...coordinates].map(renderSource).join('');
  return `<section class="popup-evidence" aria-label="资料来源与核验状态">
    <h3>资料来源与核验</h3>
    <p>世界遗产关联：${heritage.length ? '已核验关联身份' : '待核验'}</p>
    <p>5A 年份：${ratingLabel}。</p>
    <p>朝代记录、全国重点文保身份：待逐字段核验。</p>
    <p>坐标来源：${coordinates.length ? '已记录候选，入口未核验' : '尚无逐条坐标来源'}。</p>
    <p>坐标：样例近似点（约 1 km），未逐点核验，不能用于导航或边界分析。</p>
    ${links ? `<ul>${links}</ul>` : '<p>本景区暂未补齐逐条官方来源。</p>'}
  </section>`;
}
