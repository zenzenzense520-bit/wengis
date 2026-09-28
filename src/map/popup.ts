import Overlay from 'ol/Overlay';
import type { SpotProperties } from '../types/spot';
import { CATEGORY_COLORS } from '../config/layers';
import { escapeHtml } from '../components/escapeHtml';
import { renderEvidence } from '../components/evidencePanel';

// 景区信息弹窗（OpenLayers Overlay）

/** 弹窗句柄 */
export interface PopupHandle {
  overlay: Overlay;
  /** 在指定地图坐标处展示景区信息 */
  show: (properties: SpotProperties, coordinate: number[]) => void;
  hide: () => void;
}

function renderContent(properties: SpotProperties): string {
  const color = CATEGORY_COLORS[properties.category] ?? '#333333';
  const tags: string[] = [
    `<span class="tag" style="background:${color}">${escapeHtml(properties.category)}</span>`,
    `<span class="tag">${escapeHtml(properties.dynasty)}</span>`,
  ];
  if (properties.worldHeritage) {
    // 遗产与文保标签保留样例口径，证据状态按字段展示。
    const label = properties.evidence?.heritageSources.length ? '世界遗产（关联已核验）' : '世界遗产（待核验）';
    tags.push(`<span class="tag tag-heritage">${label}</span>`);
  }
  if (properties.majorSite) {
    tags.push('<span class="tag tag-site">全国重点文保（待核验）</span>');
  }
  const note = properties.note ? `<p class="popup-note">${escapeHtml(properties.note)}</p>` : '';
  return `
    <div class="popup-title">${escapeHtml(properties.name)}</div>
    <div class="popup-tags">${tags.join('')}</div>
    <table class="popup-table">
      <tr><td>地区</td><td>${escapeHtml(properties.province)} · ${escapeHtml(properties.city)}</td></tr>
      <tr><td>5A 评定</td><td>${properties.ratingYear} 年</td></tr>
    </table>
    ${note}
    ${renderEvidence(properties)}
  `;
}

/** 创建弹窗并绑定到地图容器 */
export function createPopup(popupElement: HTMLElement): PopupHandle {
  const contentElement = popupElement.querySelector('#popup-content') as HTMLElement | null;
  if (!contentElement) {
    throw new Error('弹窗 DOM 结构缺失：#popup-content 未找到');
  }

  const overlay = new Overlay({
    element: popupElement,
    autoPan: { animation: { duration: 200 } },
    positioning: 'bottom-center',
    stopEvent: true,
    offset: [0, -12],
  });

  const show = (properties: SpotProperties, coordinate: number[]): void => {
    contentElement.innerHTML = renderContent(properties);
    popupElement.classList.remove('hidden');
    overlay.setPosition(coordinate);
    // 新增来源使弹窗变高；布局完成后重新平移，避免标题被地图边缘裁切。
    requestAnimationFrame(() => {
      if (overlay.getPosition()) overlay.panIntoView({ animation: { duration: 200 } });
    });
  };

  const hide = (): void => {
    popupElement.classList.add('hidden');
    overlay.setPosition(undefined);
  };

  return { overlay, show, hide };
}
