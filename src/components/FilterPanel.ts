import { filterStore, matchesFilter } from '../state/filterStore';
import { CATEGORY_COLORS } from '../config/layers';
import type { SpotCategory, SpotProperties } from '../types/spot';

// 筛选面板：类别（图例可点选）、省份、世界遗产/国保，显示命中数量

/** 统计某维度的取值数量 */
function countBy(spots: SpotProperties[], key: (s: SpotProperties) => string): Map<string, number> {
  const map = new Map<string, number>();
  spots.forEach((s) => {
    const k = key(s);
    map.set(k, (map.get(k) ?? 0) + 1);
  });
  return map;
}

/** 创建筛选面板，返回取消订阅函数 */
export function createFilterPanel(root: HTMLElement, spots: SpotProperties[]): () => void {
  const categoryCounts = countBy(spots, (s) => s.category);
  const provinceCounts = countBy(spots, (s) => s.province);
  const provinces = [...provinceCounts.entries()].sort((a, b) => b[1] - a[1]);

  // 类别列表（图例 + 复选）
  const categoryBlock = document.createElement('div');
  categoryBlock.className = 'filter-categories';
  const categoryBoxes = new Map<SpotCategory, HTMLInputElement>();
  (Object.keys(CATEGORY_COLORS) as SpotCategory[]).forEach((category) => {
    const label = document.createElement('label');
    label.className = 'filter-item';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.category = category;
    checkbox.addEventListener('change', () => filterStore.toggleCategory(category));
    const dot = document.createElement('span');
    dot.className = 'legend-dot';
    dot.style.background = CATEGORY_COLORS[category];
    const text = document.createElement('span');
    text.textContent = `${category} ${categoryCounts.get(category) ?? 0}`;
    label.append(checkbox, dot, text);
    categoryBlock.appendChild(label);
    categoryBoxes.set(category, checkbox);
  });

  // 省份下拉
  const provinceSelect = document.createElement('select');
  provinceSelect.className = 'filter-select';
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = `全部省份（${spots.length}）`;
  provinceSelect.appendChild(allOption);
  provinces.forEach(([province, count]) => {
    const option = document.createElement('option');
    option.value = province;
    option.textContent = `${province}（${count}）`;
    provinceSelect.appendChild(option);
  });
  provinceSelect.addEventListener('change', () => {
    if (provinceSelect.value === 'all') {
      filterStore.setProvinces(new Set());
    } else {
      filterStore.setProvinces(new Set([provinceSelect.value]));
    }
  });

  // 世遗 / 国保
  const heritageBox = document.createElement('input');
  heritageBox.type = 'checkbox';
  heritageBox.id = 'filter-heritage';
  heritageBox.addEventListener('change', () => filterStore.setHeritageOnly(heritageBox.checked));
  const heritageLabel = document.createElement('label');
  heritageLabel.className = 'filter-item';
  heritageLabel.setAttribute('for', 'filter-heritage');
  heritageLabel.append(heritageBox, ' 仅世界文化遗产');

  const majorSiteBox = document.createElement('input');
  majorSiteBox.type = 'checkbox';
  majorSiteBox.id = 'filter-major-site';
  majorSiteBox.addEventListener('change', () => filterStore.setMajorSiteOnly(majorSiteBox.checked));
  const majorSiteLabel = document.createElement('label');
  majorSiteLabel.className = 'filter-item';
  majorSiteLabel.setAttribute('for', 'filter-major-site');
  majorSiteLabel.append(majorSiteBox, ' 仅全国重点文保');

  // 重置 + 计数
  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.className = 'filter-reset';
  resetButton.textContent = '重置筛选';
  resetButton.addEventListener('click', () => filterStore.reset());
  const countLabel = document.createElement('span');
  countLabel.className = 'filter-count';
  const footer = document.createElement('div');
  footer.className = 'filter-footer';
  footer.append(countLabel, resetButton);

  const h2 = (text: string): HTMLElement => {
    const el = document.createElement('h3');
    el.className = 'filter-heading';
    el.textContent = text;
    return el;
  };
  root.append(
    h2('类别（可多选）'),
    categoryBlock,
    h2('省份'),
    provinceSelect,
    h2('其他条件'),
    heritageLabel,
    majorSiteLabel,
    footer,
  );

  const sync = (): void => {
    const state = filterStore.getState();
    categoryBoxes.forEach((box, category) => {
      box.checked = state.categories.has(category);
    });
    provinceSelect.value = state.provinces.size === 1 ? [...state.provinces][0] : 'all';
    heritageBox.checked = state.heritageOnly;
    majorSiteBox.checked = state.majorSiteOnly;
    const matched = spots.filter((s) => matchesFilter(s, state)).length;
    countLabel.textContent = `已选 ${matched} / ${spots.length} 处`;
  };

  sync();
  return filterStore.subscribe(sync);
}
