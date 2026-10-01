import { useEffect } from 'react'
import { useRundownStore } from '../store/rundownStore'
import { useRundownComputed } from '../hooks/useRundown'
import { formatClock, formatWallClock } from '../engine/timeline'
import { SEGMENT_TYPE_MAP } from '../data/segmentTypes'

export function TimelinePanel() {
  const showStartAt = useRundownStore((s) => s.showStartAt)
  const setShowStartAt = useRundownStore((s) => s.setShowStartAt)
  const targetDuration = useRundownStore((s) => s.targetDuration)
  const playhead = useRundownStore((s) => s.playhead)
  const isPlaying = useRundownStore((s) => s.isPlaying)
  const startPlayback = useRundownStore((s) => s.startPlayback)
  const pausePlayback = useRundownStore((s) => s.pausePlayback)
  const stopPlayback = useRundownStore((s) => s.stopPlayback)
  const tickPlayhead = useRundownStore((s) => s.tickPlayhead)

  const { ordered, entries, totalDuration, overtime, conflicts, activeSegmentId } =
    useRundownComputed()

  // Simulated run-through: 60x speed — 1 real second advances the show 60s.
  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => tickPlayhead(6, totalDuration), 100)
    return () => clearInterval(id)
  }, [isPlaying, totalDuration, tickPlayhead])

  const exportCsv = () => {
    const header = ['序号', '环节', '类型', '时长', '累计开始', '累计结束', '锚定时间', '备注']
    const rows = entries.map((entry, i) => {
      const seg = ordered[i]
      return [
        String(i + 1),
        seg.title,
        SEGMENT_TYPE_MAP[seg.type].label,
        formatClock(seg.duration),
        formatClock(entry.start),
        formatClock(entry.end),
        seg.anchorAt ?? '',
        seg.notes,
      ]
    })
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rundown.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2 border-b border-white/10 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">总时长</span>
          <span className="font-mono text-lg text-white">{formatClock(totalDuration)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">目标时长</span>
          <span className="font-mono text-zinc-300">{formatClock(targetDuration)}</span>
        </div>
        <div
          className={`rounded-md px-3 py-2 text-sm ${
            overtime.overtime ? 'bg-rose-500/10 text-rose-300' : 'bg-emerald-500/10 text-emerald-300'
          }`}
        >
          {overtime.overtime
            ? `⚠️ 已超时 ${formatClock(overtime.overtimeSeconds)}`
            : `✓ 富余 ${formatClock(-overtime.remainingSeconds)}`}
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <button
          onClick={isPlaying ? pausePlayback : startPlayback}
          disabled={totalDuration === 0}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPlaying ? '⏸ 暂停' : '▶ 模拟走带'}
        </button>
        <button
          onClick={stopPlayback}
          disabled={playhead === 0}
          className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:text-white disabled:opacity-40"
        >
          重置
        </button>
        <span className="ml-auto font-mono text-sm text-accent-300">{formatClock(playhead)}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-ink-900 text-xs text-zinc-500">
            <tr>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-2 py-2 font-medium">环节</th>
              <th className="px-2 py-2 text-right font-medium">时长</th>
              <th className="px-3 py-2 text-right font-medium">开始</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => {
              const seg = ordered[i]
              const active = seg.id === activeSegmentId
              return (
                <tr
                  key={entry.segmentId}
                  className={`border-t border-white/5 transition ${active ? 'bg-accent-500/10' : ''}`}
                >
                  <td className="px-3 py-2 font-mono text-zinc-500">{i + 1}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${SEGMENT_TYPE_MAP[seg.type].chip}`} />
                      <span className={`truncate ${active ? 'text-white' : 'text-zinc-200'}`}>
                        {seg.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-right font-mono text-zinc-400">
                    {formatClock(seg.duration)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-zinc-400">
                    {formatClock(entry.start)}
                  </td>
                </tr>
              )
            })}
            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-zinc-600">
                  还没有环节 — 从模板开始，或「添加环节」
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 border-t border-white/10 p-4">
        <label className="block">
          <span className="mb-1 block text-xs text-zinc-500">节目开始时间</span>
          <input
            className="w-full rounded-md border border-white/10 bg-ink-800 px-2.5 py-1.5 text-sm text-zinc-100 outline-none focus:border-brand-500/60"
            value={showStartAt}
            onChange={(e) => setShowStartAt(e.target.value)}
            placeholder="如 20:00"
          />
        </label>

        {conflicts.length > 0 && (
          <div className="space-y-2">
            {conflicts.map((c) => (
              <div
                key={c.segmentId}
                className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300"
              >
                ⚠️ 「{c.title}」锚定不符：期望 {formatWallClock(c.expectedStart)}，实际{' '}
                {formatWallClock(c.actualStart)}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={exportCsv}
          className="w-full rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-500"
        >
          导出播出单 (CSV)
        </button>
      </div>
    </div>
  )
}
