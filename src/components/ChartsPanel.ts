import * as echarts from 'echarts/core';
import { PieChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { filterStore, matchesFilter } from '../state/filterStore';
import { CATEGORY_COLORS } from '../config/layers';
import { DYNASTY_ORDER, DYNASTY_META } from '../config/dynasty';
import type { SpotCategory, SpotProperties } from '../types/spot';

echarts.use([PieChart, BarChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);

// 统计图面板：类别（饼）、省份（横向柱）、朝代（柱）、评定年份（柱），随筛选联动并可点击反筛

const CHART_HEIGHT = 210;

/** 统计某维度数量 */
function tally(spots: SpotProperties[], key: (s: SpotProperties) => string): Map<string, number> {
  const map = new Map<string, number>();
  spots.forEach((s) => map.set(key(s), (map.get(key(s)) ?? 0) + 1));
  return map;
}

/** 创建图表容器 */
function makeChartHost(parent: HTMLElement, title: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'chart-host';
  const h = document.createElement('div');
  h.className = 'chart-title';
  h.textContent = title;
  const body = document.createElement('div');
  body.className = 'chart-body';
  body.style.height = `${CHART_HEIGHT}px`;
  wrap.append(h, body);
  parent.appendChild(wrap);
  return body;
}

/** 创建统计图表面板，返回取消订阅函数 */
export function createChartsPanel(panel: HTMLElement, spots: SpotProperties[]): () => void {
  const categoryEl = makeChartHost(panel, '文化类别分布');
  const provinceEl = makeChartHost(panel, '省份分布（前 12）');
  const dynastyEl = makeChartHost(panel, '朝代分布');
  const yearEl = makeChartHost(panel, '5A 评定年份分布');

  const categoryChart = echarts.init(categoryEl);
  const provinceChart = echarts.init(provinceEl);
  const dynastyChart = echarts.init(dynastyEl);
  const yearChart = echarts.init(yearEl);

  // 点击类别饼图反筛
  categoryChart.on('click', (params) => {
    const name = params.name as SpotCategory;
    const state = filterStore.getState();
    if (state.categories.has(name)) {
      const next = new Set(state.categories);
      next.delete(name);
      filterStore.setCategories(next);
    } else {
      filterStore.setCategories(new Set([name]));
    }
  });
  provinceChart.on('click', (params) => {
    const name = String(params.name);
    const state = filterStore.getState();
    filterStore.setProvinces(state.provinces.has(name) ? new Set() : new Set([name]));
  });
  dynastyChart.on('click', (params) => {
    const name = DYNASTY_ORDER[params.dataIndex];
    if (!name) {
      return;
    }
    const state = filterStore.getState();
    filterStore.setDynasty(state.dynastyGroup === name ? 'all' : name);
  });

  const render = (): void => {
    const state = filterStore.getState();
    const data = spots.filter((spot) => matchesFilter(spot, state));

    // 类别饼图
    const catCounts = tally(data, (s) => s.category);
    categoryChart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie', radius: ['32%', '68%'], center: ['50%', '54%'],
        label: { fontSize: 10 },
        data: (Object.keys(CATEGORY_COLORS) as SpotCategory[])
          .filter((c) => catCounts.has(c))
          .map((c) => ({ name: c, value: catCounts.get(c), itemStyle: { color: CATEGORY_COLORS[c] } })),
      }],
    });

    // 省份横向柱（前 12）
    const prov = [...tally(data, (s) => s.province).entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
    provinceChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 64, right: 16, top: 8, bottom: 8 },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: prov.map((p) => p[0]).reverse(), axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: prov.map((p) => p[1]).reverse(), itemStyle: { color: '#7b241c' } }],
    });

    // 朝代柱（时间轴顺序）
    const dynCounts = tally(data, (s) => s.dynastyGroup);
    dynastyChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 32, right: 12, top: 12, bottom: 36 },
      xAxis: { type: 'category', data: DYNASTY_ORDER.map((g) => DYNASTY_META[g].short), axisLabel: { fontSize: 10, rotate: 30 } },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: DYNASTY_ORDER.map((g) => ({
          value: dynCounts.get(g) ?? 0,
          itemStyle: { color: DYNASTY_META[g].color },
        })),
      }],
    });

    // 评定年份柱
    const yearCounts = tally(data, (s) => String(s.ratingYear));
    const years = [...yearCounts.keys()].sort();
    yearChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 32, right: 12, top: 12, bottom: 24 },
      xAxis: { type: 'category', data: years, axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{ type: 'bar', data: years.map((y) => yearCounts.get(y)), itemStyle: { color: '#148f77' } }],
    });
  };

  render();
  const unsubscribe = filterStore.subscribe(render);
  const resizeObserver = new ResizeObserver(() => {
    [categoryChart, provinceChart, dynastyChart, yearChart].forEach((c) => c.resize());
  });
  resizeObserver.observe(panel);

  return () => {
    unsubscribe();
    resizeObserver.disconnect();
    [categoryChart, provinceChart, dynastyChart, yearChart].forEach((c) => c.dispose());
  };
}
