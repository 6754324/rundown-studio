import type { SegmentType } from '../types'

export interface SegmentTypeMeta {
  type: SegmentType
  label: string
  defaultDuration: number
  /** Tailwind classes for the node border + label text. */
  classes: string
  /** Solid background class for the icon chip. */
  chip: string
  /** Hex color for the minimap / non-CSS renderers. */
  hex: string
}

export const SEGMENT_TYPES: SegmentTypeMeta[] = [
  { type: 'open', label: '片头', defaultDuration: 30, classes: 'border-brand-500/60 text-brand-700', chip: 'bg-brand-500', hex: '#c05a48' },
  { type: 'host', label: '主持人开场', defaultDuration: 90, classes: 'border-accent-500/60 text-accent-700', chip: 'bg-accent-500', hex: '#4a7c99' },
  { type: 'news', label: '新闻播报', defaultDuration: 300, classes: 'border-blue-500/60 text-blue-700', chip: 'bg-blue-500', hex: '#3b82f6' },
  { type: 'interview', label: '嘉宾访谈', defaultDuration: 600, classes: 'border-emerald-500/60 text-emerald-700', chip: 'bg-emerald-500', hex: '#10b981' },
  { type: 'vcr', label: 'VCR 短片', defaultDuration: 180, classes: 'border-amber-500/60 text-amber-700', chip: 'bg-amber-500', hex: '#f59e0b' },
  { type: 'commercial', label: '广告口', defaultDuration: 120, classes: 'border-rose-500/60 text-rose-700', chip: 'bg-rose-500', hex: '#f43f5e' },
  { type: 'interactive', label: '互动抽奖', defaultDuration: 300, classes: 'border-fuchsia-500/60 text-fuchsia-700', chip: 'bg-fuchsia-500', hex: '#d946ef' },
  { type: 'performance', label: '表演环节', defaultDuration: 360, classes: 'border-orange-500/60 text-orange-700', chip: 'bg-orange-500', hex: '#f97316' },
  { type: 'closing', label: '片尾', defaultDuration: 60, classes: 'border-ink-500/60 text-ink-600', chip: 'bg-ink-500', hex: '#6d6352' },
]

export const SEGMENT_TYPE_MAP: Record<SegmentType, SegmentTypeMeta> = Object.fromEntries(
  SEGMENT_TYPES.map((meta) => [meta.type, meta]),
) as Record<SegmentType, SegmentTypeMeta>
