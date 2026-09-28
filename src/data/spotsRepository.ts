import type { SpotCollection } from '../types/spot';
import { validateSpots } from './validateSpots';
import { attachEvidence } from './spotEvidence';
import { verifiedRecords } from '../../data/provenance/verified';

// 数据加载与严格结构校验共用可测试入口，异常统一交给页面显示。
export async function loadSpots(url: string): Promise<SpotCollection> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`数据请求失败（网络错误）：${url}`, { cause: error });
  }
  if (!response.ok) throw new Error(`数据请求失败：HTTP ${response.status} ${response.statusText}`);
  let json: unknown;
  try {
    json = await response.json();
  } catch (error) {
    throw new Error('数据格式错误：不是合法 JSON', { cause: error });
  }
  // 原始数据与证据独立维护，错误关联阻止页面初始化并显示异常。
  return attachEvidence(validateSpots(json), verifiedRecords);
}
