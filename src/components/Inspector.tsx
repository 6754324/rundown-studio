import type { ReactNode } from 'react'
import { useRundownStore } from '../store/rundownStore'
import { SEGMENT_TYPES } from '../data/segmentTypes'
import { formatClock } from '../engine/timeline'
import type { SegmentType } from '../types'

const inputCls =
  'w-full rounded-md border border-ink-200 bg-paper-200 px-2.5 py-1.5 text-sm text-ink-900 outline-none focus:border-brand-500/60'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-400">{label}</span>
      {children}
    </label>
  )
}

export function Inspector() {
  const segment = useRundownStore((s) => s.segments.find((seg) => seg.id === s.selectedId))
  const updateSegment = useRundownStore((s) => s.updateSegment)
  const removeSegment = useRundownStore((s) => s.removeSegment)

  if (!segment) {
    return (
      <div className="border-b border-ink-200 p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">环节编辑</h3>
        <p className="text-sm leading-relaxed text-ink-400">
          选中画布上的环节进行编辑。拖拽节点右侧的圆点连线，即可编排播出顺序。
        </p>
      </div>
    )
  }

  return (
    <div className="border-b border-ink-200 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">环节编辑</h3>
      <div className="space-y-3">
        <Field label="标题">
          <input
            className={inputCls}
            value={segment.title}
            onChange={(e) => updateSegment(segment.id, { title: e.target.value })}
          />
        </Field>

        <Field label="类型">
          <select
            className={inputCls}
            value={segment.type}
            onChange={(e) => updateSegment(segment.id, { type: e.target.value as SegmentType })}
          >
            {SEGMENT_TYPES.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="时长（秒）">
          <input
            type="number"
            min={1}
            className={inputCls}
            value={segment.duration}
            onChange={(e) => updateSegment(segment.id, { duration: Math.max(1, Number(e.target.value)) })}
          />
        </Field>

        <Field label="锚定时间（可选，如 19:00）">
          <input
            className={inputCls}
            placeholder="留空表示不锚定"
            value={segment.anchorAt ?? ''}
            onChange={(e) => updateSegment(segment.id, { anchorAt: e.target.value || undefined })}
          />
        </Field>

        <Field label="备注">
          <textarea
            className={`${inputCls} min-h-20 resize-y`}
            placeholder="台词、素材名、嘉宾信息…"
            value={segment.notes}
            onChange={(e) => updateSegment(segment.id, { notes: e.target.value })}
          />
        </Field>

        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-xs text-ink-400">{formatClock(segment.duration)}</span>
          <button
            onClick={() => removeSegment(segment.id)}
            className="rounded-md border border-rose-500/40 px-3 py-1.5 text-sm text-rose-600 transition hover:bg-rose-500/10"
          >
            删除环节
          </button>
        </div>
      </div>
    </div>
  )
}
