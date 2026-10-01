import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { Segment } from '../types'
import { SEGMENT_TYPE_MAP } from '../data/segmentTypes'
import { formatClock } from '../engine/timeline'

function SegmentNodeInner({ data, selected }: NodeProps) {
  const segment = data.segment as Segment
  const active = Boolean(data.active)
  const meta = SEGMENT_TYPE_MAP[segment.type]

  return (
    <div
      className={`w-44 rounded-lg border bg-paper-100 px-3 py-2.5 shadow-lg transition ${meta.classes} ${
        active ? 'ring-2 ring-accent-400/80' : ''
      } ${selected && !active ? 'ring-2 ring-brand-400/60' : ''}`}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${meta.chip}`} />
        <span className="truncate text-sm font-medium text-ink-900">{segment.title}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-ink-400">
        <span>{meta.label}</span>
        <span>{formatClock(segment.duration)}</span>
      </div>
      {segment.anchorAt && (
        <div className="mt-1 font-mono text-[10px] text-amber-600">⏱ 锚定 {segment.anchorAt}</div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export const SegmentNode = memo(SegmentNodeInner)
