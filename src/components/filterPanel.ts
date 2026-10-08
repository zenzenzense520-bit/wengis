import { filterSpots, categoryCounts } from '../data/filterSpots';
import type { SpotFeature } from '../types/spot';
import { ratingYearStatus } from '../data/spotEvidence.ts';

// 新增筛选控件与样例统计联动，所有来自数据的文本使用 textContent。
export function bindFilterPanel(features: SpotFeature[], onChange: (items: SpotFeature[]) => void): void {
  const form = document.querySelector<HTMLFormElement>('#filters');
  const keyword = document.querySelector<HTMLInputElement>('#filter-keyword');
  const year = document.querySelector<HTMLInputElement>('#filter-year');
  const yearLabel = document.querySelector<HTMLOutputElement>('#year-label');
  const summary = document.getElementById('filter-summary');
  const statistics = document.getElementById('statistics');
  const empty = document.getElementById('empty-results');
  if (!form || !keyword || !year || !yearLabel || !summary || !statistics || !empty) {
    throw new Error('筛选面板结构不完整');
  }
  const selects = ['province', 'category', 'dynasty'].map((field) => {
    const select = document.querySelector<HTMLSelectElement>(`#filter-${field}`);
    if (!select) throw new Error(`筛选控件缺失：${field}`);
    const values = new Set(features.map(({ properties }) => properties[field as 'province' | 'category' | 'dynasty']));
    for (const value of [...values].sort((a, b) => a.localeCompare(b, 'zh-CN'))) {
      select.add(new Option(value, value));
    }
    return select;
  });
  const years = features.map(({ properties }) => properties.ratingYear);
  // 空数据也能显示正常的年份范围，避免 Infinity 写入控件。
  year.min = String(years.length ? Math.min(...years) : 2007);
  year.max = String(years.length ? Math.max(...years) : 2026);
  year.value = year.max;
  year.defaultValue = year.max;
  const update = (): void => {
    const filtered = filterSpots(features, {
      keyword: keyword.value, province: selects[0].value, category: selects[1].value,
      dynasty: selects[2].value, untilYear: Number(year.value),
    });
    yearLabel.textContent = `${year.value} 年及以前`;
    // 站内冲突与多年份单列，不能因名单数值相同就升级为已核验。
    summary.textContent = `当前 ${filtered.length} / ${features.length} 个样例景区 · 遗产标记 ${filtered.filter(f => f.properties.worldHeritage).length} 个 · 已核验关联 ${filtered.filter(f => f.properties.evidence?.heritageSources.length).length} 个 · 年份一致 ${filtered.filter(f => ratingYearStatus(f.properties) === 'single').length} 个 · 多年份 ${filtered.filter(f => ratingYearStatus(f.properties) === 'multiple').length} 个 · 年份冲突 ${filtered.filter(f => ratingYearStatus(f.properties) === 'conflict').length} 个`;
    empty.classList.toggle('hidden', filtered.length > 0);
    statistics.replaceChildren();
    const counts = categoryCounts(filtered);
    for (const [category, count] of counts) {
      const row = document.createElement('div');
      row.className = 'stat-row';
      const label = document.createElement('span');
      label.textContent = `${category} ${count}`;
      const meter = document.createElement('meter');
      meter.max = filtered.length;
      meter.value = count;
      meter.setAttribute('aria-label', `${category}占当前结果比例`);
      row.append(label, meter);
      statistics.append(row);
    }
    if (!filtered.length) statistics.textContent = '当前条件下没有样例景区，请调整条件或重置。';
    onChange(filtered);
  };
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('reset', () => queueMicrotask(update));
  update();
}
