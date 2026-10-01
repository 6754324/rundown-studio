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
  { type: 'open', label: '片头', defaultDuration: 30, classes: 'border-brand-500/60 text-brand-300', chip: 'bg-brand-500', hex: '#8b5cf6' },
  { type: 'host', label: '主持人开场', defaultDuration: 90, classes: 'border-accent-500/60 text-accent-300', chip: 'bg-accent-500', hex: '#06b6d4' },
  { type: 'news', label: '新闻播报', defaultDuration: 300, classes: 'border-blue-500/60 text-blue-300', chip: 'bg-blue-500', hex: '#3b82f6' },
  { type: 'interview', label: '嘉宾访谈', defaultDuration: 600, classes: 'border-emerald-500/60 text-emerald-300', chip: 'bg-emerald-500', hex: '#10b981' },
  { type: 'vcr', label: 'VCR 短片', defaultDuration: 180, classes: 'border-amber-500/60 text-amber-300', chip: 'bg-amber-500', hex: '#f59e0b' },
  { type: 'commercial', label: '广告口', defaultDuration: 120, classes: 'border-rose-500/60 text-rose-300', chip: 'bg-rose-500', hex: '#f43f5e' },
  { type: 'interactive', label: '互动抽奖', defaultDuration: 300, classes: 'border-fuchsia-500/60 text-fuchsia-300', chip: 'bg-fuchsia-500', hex: '#d946ef' },
  { type: 'performance', label: '表演环节', defaultDuration: 360, classes: 'border-orange-500/60 text-orange-300', chip: 'bg-orange-500', hex: '#f97316' },
  { type: 'closing', label: '片尾', defaultDuration: 60, classes: 'border-zinc-500/60 text-zinc-300', chip: 'bg-zinc-500', hex: '#71717a' },
]

export const SEGMENT_TYPE_MAP: Record<SegmentType, SegmentTypeMeta> = Object.fromEntries(
  SEGMENT_TYPES.map((meta) => [meta.type, meta]),
) as Record<SegmentType, SegmentTypeMeta>
