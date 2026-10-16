import type { SpotCategory, SpotProperties, DynastyGroup } from '../types/spot';
import { DYNASTY_ORDER } from '../config/dynasty';

// 前端筛选状态：朝代时间轴、类别、省份、世遗/国保，发布订阅驱动地图与图表联动

/** 朝代筛选值：'all' 表示全部，否则为某朝代分组 */
export type DynastyFilter = DynastyGroup | 'all';

/** 筛选条件（空集合表示该维度不限） */
export interface FilterState {
  /** 选中的类别（空集合 = 全部类别） */
  categories: Set<SpotCategory>;
  /** 选中的省份（空集合 = 全部省份） */
  provinces: Set<string>;
  /** 朝代时间轴选中项 */
  dynastyGroup: DynastyFilter;
  /** 时间轴是否按"累计到该朝代"显示（false = 仅该朝代） */
  cumulative: boolean;
  /** 仅显示世界文化遗产 */
  heritageOnly: boolean;
  /** 仅显示全国重点文保 */
  majorSiteOnly: boolean;
}

/** 初始筛选：全部不限 */
function initialState(): FilterState {
  return {
    categories: new Set(),
    provinces: new Set(),
    dynastyGroup: 'all',
    cumulative: true,
    heritageOnly: false,
    majorSiteOnly: false,
  };
}

type Listener = () => void;

/** 筛选状态仓库（单例，组件订阅后由仓库统一通知） */
class FilterStore {
  private state: FilterState = initialState();
  private readonly listeners = new Set<Listener>();

  /** 订阅状态变化，返回取消订阅函数 */
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  getState(): FilterState {
    return this.state;
  }

  toggleCategory(category: SpotCategory): void {
    const next = new Set(this.state.categories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    this.state = { ...this.state, categories: next };
    this.emit();
  }

  toggleProvince(province: string): void {
    const next = new Set(this.state.provinces);
    if (next.has(province)) {
      next.delete(province);
    } else {
      next.add(province);
    }
    this.state = { ...this.state, provinces: next };
    this.emit();
  }

  /** 批量设置类别（用于图例/图表点击） */
  setCategories(categories: Set<SpotCategory>): void {
    this.state = { ...this.state, categories: new Set(categories) };
    this.emit();
  }

  /** 批量设置省份 */
  setProvinces(provinces: Set<string>): void {
    this.state = { ...this.state, provinces: new Set(provinces) };
    this.emit();
  }

  setDynasty(dynastyGroup: DynastyFilter): void {
    this.state = { ...this.state, dynastyGroup };
    this.emit();
  }

  setCumulative(cumulative: boolean): void {
    this.state = { ...this.state, cumulative };
    this.emit();
  }

  setHeritageOnly(value: boolean): void {
    this.state = { ...this.state, heritageOnly: value };
    this.emit();
  }

  setMajorSiteOnly(value: boolean): void {
    this.state = { ...this.state, majorSiteOnly: value };
    this.emit();
  }

  reset(): void {
    this.state = initialState();
    this.emit();
  }

  private emit(): void {
    this.listeners.forEach((fn) => fn());
  }
}

/** 全局筛选状态单例 */
export const filterStore = new FilterStore();

/** 朝代维度判定（支持累计 / 仅本朝代） */
function matchesDynasty(properties: SpotProperties, state: FilterState): boolean {
  if (state.dynastyGroup === 'all') {
    return true;
  }
  const targetIndex = DYNASTY_ORDER.indexOf(state.dynastyGroup);
  const currentIndex = DYNASTY_ORDER.indexOf(properties.dynastyGroup);
  if (state.cumulative) {
    return currentIndex <= targetIndex;
  }
  return currentIndex === targetIndex;
}

/** 判定单个景区是否满足当前筛选 */
export function matchesFilter(properties: SpotProperties, state: FilterState): boolean {
  if (state.categories.size > 0 && !state.categories.has(properties.category)) {
    return false;
  }
  if (state.provinces.size > 0 && !state.provinces.has(properties.province)) {
    return false;
  }
  if (!matchesDynasty(properties, state)) {
    return false;
  }
  if (state.heritageOnly && !properties.worldHeritage) {
    return false;
  }
  if (state.majorSiteOnly && !properties.majorSite) {
    return false;
  }
  return true;
}

/** 统计当前筛选命中的景区数量 */
export function countFiltered(features: SpotProperties[], state: FilterState): number {
  return features.filter((p) => matchesFilter(p, state)).length;
}
