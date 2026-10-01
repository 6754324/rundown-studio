import { useState } from 'react'
import { useRundownStore } from '../store/rundownStore'
import { SEGMENT_TYPES } from '../data/segmentTypes'
import { TEMPLATES } from '../data/templates'
import type { SegmentType } from '../types'

const selectCls =
  'rounded-md border border-ink-200 bg-paper-200 px-2 py-1.5 text-sm text-ink-700 outline-none focus:border-brand-500/60'

export function Toolbar() {
  const addSegment = useRundownStore((s) => s.addSegment)
  const loadTemplate = useRundownStore((s) => s.loadTemplate)
  const clearAll = useRundownStore((s) => s.clearAll)
  const targetDuration = useRundownStore((s) => s.targetDuration)
  const setTargetDuration = useRundownStore((s) => s.setTargetDuration)
  const count = useRundownStore((s) => s.segments.length)

  const [pendingType, setPendingType] = useState('')

  const handleAdd = (value: string) => {
    if (!value) return
    const offset = (count % 5) * 48
    addSegment(value as SegmentType, { x: 120 + offset, y: 120 + offset })
    setPendingType('')
  }

  const handleTemplate = (id: string) => {
    const tpl = TEMPLATES.find((t) => t.id === id)
    if (tpl) loadTemplate(tpl)
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-ink-200 bg-paper-100 px-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-paper-50">
          R
        </span>
        <span className="font-display text-base font-semibold text-ink-900">Rundown Studio</span>
      </div>

      <div className="h-6 w-px bg-ink-900/8" />

      <select className={selectCls} defaultValue="" onChange={(e) => handleTemplate(e.target.value)}>
        <option value="" disabled>
          加载模板…
        </option>
        {TEMPLATES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select className={selectCls} value={pendingType} onChange={(e) => handleAdd(e.target.value)}>
        <option value="" disabled>
          ＋ 添加环节…
        </option>
        {SEGMENT_TYPES.map((t) => (
          <option key={t.type} value={t.type}>
            {t.label}
          </option>
        ))}
      </select>

      <div className="flex-1" />

      <label className="text-xs text-ink-400">目标时长(分)</label>
      <input
        type="number"
        min={1}
        className="w-20 rounded-md border border-ink-200 bg-paper-200 px-2 py-1.5 text-sm text-ink-700 outline-none focus:border-brand-500/60"
        value={Math.round(targetDuration / 60)}
        onChange={(e) => setTargetDuration(Math.max(1, Number(e.target.value)) * 60)}
      />

      <button
        onClick={clearAll}
        className="rounded-md border border-ink-200 px-3 py-1.5 text-sm text-ink-500 transition hover:border-rose-500/50 hover:text-rose-600"
      >
        清空
      </button>
    </header>
  )
}
