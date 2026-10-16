import { filterStore } from '../state/filterStore';
import { DYNASTY_ORDER, DYNASTY_META } from '../config/dynasty';
import type { SpotProperties, DynastyGroup } from '../types/spot';

// 朝代时间轴：横向节点，点击按朝代筛选，支持"累计到该朝代 / 仅本朝"两种模式

/** 统计每个朝代分组的景区数量（全量） */
function countByDynasty(spots: SpotProperties[]): Record<DynastyGroup, number> {
  const counts = DYNASTY_ORDER.reduce((acc, g) => {
    acc[g] = 0;
    return acc;
  }, {} as Record<DynastyGroup, number>);
  spots.forEach((s) => {
    counts[s.dynastyGroup] += 1;
  });
  return counts;
}

/** 创建时间轴控件，返回取消订阅函数 */
export function createTimeline(root: HTMLElement, spots: SpotProperties[]): () => void {
  const counts = countByDynasty(spots);

  const allButton = document.createElement('button');
  allButton.type = 'button';
  allButton.className = 'timeline-all';
  allButton.textContent = `全部 ${spots.length}`;
  allButton.addEventListener('click', () => filterStore.setDynasty('all'));

  const track = document.createElement('div');
  track.className = 'timeline-track';
  const nodes = new Map<DynastyGroup, HTMLButtonElement>();

  // 先创建所有节点
  DYNASTY_ORDER.forEach((group) => {
    const meta = DYNASTY_META[group];
    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'dynasty-node';
    node.dataset.dynasty = group;
    node.innerHTML = `
      <span class="dynasty-dot" style="background:${meta.color}"></span>
      <span class="dynasty-label">${meta.short}</span>
      <span class="dynasty-count">${counts[group]}</span>`;
    node.addEventListener('click', () => filterStore.setDynasty(group));
    nodes.set(group, node);
  });

  // 按"节点 + 连线"交替排列
  DYNASTY_ORDER.forEach((group, index) => {
    track.appendChild(nodes.get(group)!);
    if (index < DYNASTY_ORDER.length - 1) {
      const line = document.createElement('span');
      line.className = 'dynasty-line';
      track.appendChild(line);
    }
  });

  const modeLabel = document.createElement('label');
  modeLabel.className = 'timeline-mode';
  const modeCheckbox = document.createElement('input');
  modeCheckbox.type = 'checkbox';
  modeCheckbox.checked = true;
  modeCheckbox.addEventListener('change', () => filterStore.setCumulative(modeCheckbox.checked));
  modeLabel.append(modeCheckbox, ' 累计显示');

  root.append(allButton, track, modeLabel);

  const syncSelection = (): void => {
    const state = filterStore.getState();
    const selected = state.dynastyGroup;
    allButton.classList.toggle('active', selected === 'all');
    nodes.forEach((node, group) => {
      let active = selected === group;
      if (state.cumulative && selected !== 'all') {
        active = DYNASTY_ORDER.indexOf(group) <= DYNASTY_ORDER.indexOf(selected as DynastyGroup);
      }
      node.classList.toggle('active', active);
    });
    modeCheckbox.checked = state.cumulative;
  };

  syncSelection();
  return filterStore.subscribe(syncSelection);
}
