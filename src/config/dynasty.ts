import type { DynastyGroup } from '../types/spot';

// 朝代主时间轴配置：顺序、年代区间、配色（按最早始建朝代归组）

export interface DynastyMeta {
  /** 完整名称 */
  label: string;
  /** 时间轴短标签 */
  short: string;
  /** 起始年（公元前为负数，用于时间轴定位） */
  start: number;
  /** 结束年 */
  end: number;
  /** 主题色（时间轴节点与图表共用） */
  color: string;
}

/** 朝代分组的时间顺序（与时间轴从左到右一致） */
export const DYNASTY_ORDER: DynastyGroup[] = [
  '先秦',
  '秦',
  '汉',
  '魏晋南北朝',
  '隋唐',
  '宋',
  '元',
  '明',
  '清',
  '清末民国',
];

/** 各朝代分组的元数据（年代用于时间轴刻度，非严格断代，仅作可视化） */
export const DYNASTY_META: Record<DynastyGroup, DynastyMeta> = {
  先秦: { label: '先秦', short: '先秦', start: -2070, end: -221, color: '#6d4c41' },
  秦: { label: '秦', short: '秦', start: -221, end: -207, color: '#8d6e63' },
  汉: { label: '汉', short: '汉', start: -202, end: 220, color: '#a1887f' },
  魏晋南北朝: { label: '魏晋南北朝', short: '魏晋', start: 220, end: 589, color: '#7e57c2' },
  隋唐: { label: '隋唐（含五代）', short: '隋唐', start: 581, end: 960, color: '#5c6bc0' },
  宋: { label: '宋（辽金西夏）', short: '宋', start: 960, end: 1279, color: '#26a69a' },
  元: { label: '元', short: '元', start: 1271, end: 1368, color: '#42a5f5' },
  明: { label: '明', short: '明', start: 1368, end: 1644, color: '#ef5350' },
  清: { label: '清', short: '清', start: 1644, end: 1911, color: '#ff7043' },
  清末民国: { label: '清末至民国', short: '民国', start: 1840, end: 1949, color: '#78909c' },
};

/** 时间轴最早/最晚年代（含边距，用于刻度定位） */
export const TIMELINE_MIN = -2200;
export const TIMELINE_MAX = 1950;

/** 朝代分组标签 -> 枚举值的反查表（数据中可能出现别名） */
export const DYNASTY_LABEL_TO_GROUP: Record<string, DynastyGroup> = DYNASTY_ORDER.reduce(
  (acc, g) => {
    acc[g] = g;
    return acc;
  },
  {} as Record<string, DynastyGroup>,
);
