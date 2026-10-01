import type { Segment, SegmentType } from '../types'

export interface RundownTemplate {
  id: string
  name: string
  description: string
  showStartAt: string
  targetDuration: number
  segments: Array<{ type: SegmentType; title: string; duration: number; notes: string; anchorAt?: string }>
}

/** A template segment without canvas position; layout is assigned on load. */
export type TemplateSegment = RundownTemplate['segments'][number]

export const TEMPLATES: RundownTemplate[] = [
  {
    id: 'talk-show',
    name: '访谈节目',
    description: '60 分钟人物访谈，嘉宾对谈 + 观众互动',
    showStartAt: '20:00',
    targetDuration: 3600,
    segments: [
      { type: 'open', title: '节目片头', duration: 30, notes: '片头包装 + 本期预告' },
      { type: 'host', title: '主持人开场', duration: 90, notes: '欢迎词、本期主题引入' },
      { type: 'interview', title: '嘉宾登场介绍', duration: 120, notes: '嘉宾背景短片 + 出场' },
      { type: 'interview', title: '嘉宾对谈（上）', duration: 900, notes: '成长经历、专业话题' },
      { type: 'vcr', title: 'VCR 回顾', duration: 180, notes: '嘉宾代表作品片段' },
      { type: 'interactive', title: '观众互动', duration: 300, notes: '弹幕/现场提问' },
      { type: 'interview', title: '嘉宾对谈（下）', duration: 600, notes: '未来规划、快问快答' },
      { type: 'host', title: '主持人总结', duration: 90, notes: '金句回顾、下期预告' },
      { type: 'closing', title: '片尾', duration: 60, notes: '字幕滚动 + 鸣谢' },
    ],
  },
  {
    id: 'news',
    name: '新闻播报',
    description: '30 分钟晚间新闻，含 19:00 整点新闻锚点',
    showStartAt: '19:00',
    targetDuration: 1800,
    segments: [
      { type: 'open', title: '新闻片头', duration: 20, notes: '台标 + 片头音乐' },
      { type: 'host', title: '主播开场', duration: 30, notes: '新闻提要' },
      { type: 'news', title: '时政要闻', duration: 300, notes: '', anchorAt: '19:00' },
      { type: 'news', title: '国内新闻', duration: 300, notes: '' },
      { type: 'news', title: '国际新闻', duration: 300, notes: '' },
      { type: 'news', title: '天气预报', duration: 180, notes: '天气主播出镜' },
      { type: 'news', title: '体育新闻', duration: 240, notes: '' },
      { type: 'closing', title: '片尾', duration: 30, notes: '' },
    ],
  },
  {
    id: 'gala',
    name: '晚会',
    description: '90 分钟综艺晚会，歌舞 + 语言类节目',
    showStartAt: '19:30',
    targetDuration: 5400,
    segments: [
      { type: 'open', title: '晚会片头', duration: 60, notes: '开场倒计时 + 片头' },
      { type: 'host', title: '主持人开场', duration: 180, notes: '四位主持人串场' },
      { type: 'performance', title: '开场歌舞', duration: 300, notes: '群舞 + 大合唱' },
      { type: 'performance', title: '小品《回家》', duration: 600, notes: '语言类节目' },
      { type: 'performance', title: '歌舞《灯火》', duration: 300, notes: '' },
      { type: 'interactive', title: '观众抽奖', duration: 300, notes: '扫码抽奖' },
      { type: 'performance', title: '相声《新说》', duration: 600, notes: '' },
      { type: 'performance', title: '歌曲串烧', duration: 240, notes: '' },
      { type: 'host', title: '主持人总结', duration: 180, notes: '零点倒计时' },
      { type: 'closing', title: '片尾', duration: 120, notes: '全体演员谢幕' },
    ],
  },
  {
    id: 'livestream',
    name: '直播带货',
    description: '45 分钟带货直播，商品讲解 + 秒杀节奏',
    showStartAt: '20:00',
    targetDuration: 2700,
    segments: [
      { type: 'open', title: '开场预热', duration: 120, notes: '暖场 + 福利预告' },
      { type: 'host', title: '主播开场', duration: 60, notes: '今日主题、福利说明' },
      { type: 'performance', title: '商品 1 讲解', duration: 300, notes: '卖点 + 演示 + 上链接' },
      { type: 'performance', title: '商品 2 讲解', duration: 300, notes: '对比 + 实测' },
      { type: 'interactive', title: '限时秒杀', duration: 180, notes: '库存倒计时' },
      { type: 'performance', title: '商品 3 讲解', duration: 300, notes: '场景演示' },
      { type: 'commercial', title: '优惠券发放', duration: 120, notes: '口令领取' },
      { type: 'interactive', title: '答疑互动', duration: 240, notes: '弹幕答疑' },
      { type: 'closing', title: '收尾', duration: 60, notes: '下次直播预告' },
    ],
  },
]

export function templateToSegments(template: RundownTemplate): Segment[] {
  return template.segments.map((seg, index) => ({
    id: `tpl-${index}`,
    type: seg.type,
    title: seg.title,
    duration: seg.duration,
    notes: seg.notes,
    anchorAt: seg.anchorAt,
    position: { x: 60 + (index % 3) * 320, y: 80 + Math.floor(index / 3) * 180 },
  }))
}
