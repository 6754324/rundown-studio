import { useMemo } from 'react'
import { useRundownStore } from '../store/rundownStore'
import { topologicalOrder } from '../engine/graph'
import { computeTimeline, checkOvertime, detectAnchorConflicts } from '../engine/timeline'
import type { Segment } from '../types'

/**
 * Derives the broadcast order from the canvas graph, then runs the timeline
 * engine over it. Shared by the canvas (for highlighting) and the timeline
 * panel (for the show sheet + playback).
 */
export function useRundownComputed() {
  const segments = useRundownStore((s) => s.segments)
  const edges = useRundownStore((s) => s.edges)
  const targetDuration = useRundownStore((s) => s.targetDuration)
  const showStartAt = useRundownStore((s) => s.showStartAt)
  const playhead = useRundownStore((s) => s.playhead)

  return useMemo(() => {
    const order = topologicalOrder(
      segments.map((s) => ({ id: s.id })),
      edges.map((e) => ({ source: e.source, target: e.target })),
    )
    const byId = new Map(segments.map((s) => [s.id, s]))
    const ordered = order.map((id) => byId.get(id)).filter((s): s is Segment => Boolean(s))
    const { entries, totalDuration } = computeTimeline(ordered)
    const overtime = checkOvertime(totalDuration, targetDuration)
    const conflicts = detectAnchorConflicts(ordered, entries, showStartAt)
    const activeIndex = entries.findIndex((e) => playhead >= e.start && playhead < e.end)
    const activeSegmentId = activeIndex >= 0 ? entries[activeIndex].segmentId : null
    return { ordered, entries, totalDuration, overtime, conflicts, activeSegmentId }
  }, [segments, edges, targetDuration, showStartAt, playhead])
}
