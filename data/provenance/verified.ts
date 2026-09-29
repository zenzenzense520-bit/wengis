import type { EvidenceRecord } from '../../src/types/evidence';
import { getReviewedSources } from './ratingCoordinates.ts';

// 人工查阅官方名录后记录字段级证据；不得据此宣称整条数据已核验。
export const verifiedRecords: EvidenceRecord[] = [
  {
    spotId: 1, spotName: '故宫博物院', sources: [{
      field: 'worldHeritage', expectedValue: true,
      title: '明清故宫（北京故宫、沈阳故宫）', publisher: 'UNESCO 世界遗产中心',
      url: 'https://whc.unesco.org/en/list/439/', checkedAt: '2026-09-28',
      scope: '北京故宫属于该世界遗产项目；该项目也含沈阳故宫，范围不等同于本景区点位。',
    }, ...getReviewedSources(1)],
  },
  {
    spotId: 2, spotName: '天坛公园', sources: [{
      field: 'worldHeritage', expectedValue: true,
      title: '北京皇家祭坛——天坛', publisher: 'UNESCO 世界遗产中心',
      url: 'https://whc.unesco.org/en/list/881/', checkedAt: '2026-09-28',
      scope: '核验天坛的世界遗产身份；不核验景区 5A 年份、文保身份或地图点位。',
    }, ...getReviewedSources(2)],
  },
  {
    spotId: 5, spotName: '颐和园', sources: [{
      field: 'worldHeritage', expectedValue: true,
      title: '北京皇家园林——颐和园', publisher: 'UNESCO 世界遗产中心',
      url: 'https://whc.unesco.org/en/list/880/', checkedAt: '2026-09-28',
      scope: '核验颐和园的世界遗产身份；不核验景区 5A 年份、文保身份或地图点位。',
    }, ...getReviewedSources(5)],
  },
  {
    spotId: 26, spotName: '云冈石窟景区', sources: [{
      field: 'worldHeritage', expectedValue: true,
      title: '云冈石窟', publisher: 'UNESCO 世界遗产中心',
      url: 'https://whc.unesco.org/en/list/1039/', checkedAt: '2026-09-28',
      scope: '核验云冈石窟的世界遗产身份；不核验景区 5A 年份、文保身份或地图点位。',
    }, ...getReviewedSources(26)],
  },
  {
    spotId: 30, spotName: '秦始皇帝陵博物院景区', sources: [{
      field: 'worldHeritage', expectedValue: true,
      title: '秦始皇陵及兵马俑坑', publisher: 'UNESCO 世界遗产中心',
      url: 'https://whc.unesco.org/en/list/441/', checkedAt: '2026-09-28',
      scope: '景区核心遗产关联秦始皇陵项目；遗产范围与景区管理范围、入口点位不等同。',
    }, ...getReviewedSources(30)],
  },
];
