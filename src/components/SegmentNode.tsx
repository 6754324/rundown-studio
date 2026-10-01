import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { Segment } from '../types'
import { SEGMENT_TYPE_MAP } from '../data/segmentTypes'
import { formatClock } from '../engine/timeline'

function SegmentNodeInner({ data, selected }: NodeProps) {
  const segment = data.segment as Segment
  const meta = SEGMENT_TYPE_MAP[segment.type]

  return (
    <div
      className={`w-44 rounded-lg border bg-ink-900 px-3 py-2.5 shadow-lg ${meta.classes} ${
        selected ? 'ring-2 ring-brand-400/60' : ''
      }`}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${meta.chip}`} />
        <span className="truncate text-sm font-medium text-zinc-100">{segment.title}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-zinc-500">
        <span>{meta.label}</span>
        <span>{formatClock(segment.duration)}</span>
      </div>
      {segment.anchorAt && (
        <div className="mt-1 font-mono text-[10px] text-amber-400">⏱ 锚定 {segment.anchorAt}</div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export const SegmentNode = memo(SegmentNodeInner)
