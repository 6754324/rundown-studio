import type { Segment } from '../types'

/** One segment's computed position on the running timeline. */
export interface TimelineEntry {
  segmentId: string
  index: number
  /** Cumulative start time in seconds. */
  start: number
  /** Cumulative end time in seconds. */
  end: number
}

export interface OvertimeResult {
  overtime: boolean
  overtimeSeconds: number
  remainingSeconds: number
}

export interface AnchorConflict {
  segmentId: string
  title: string
  expectedStart: number
  actualStart: number
  deltaSeconds: number
}

/**
 * Compute cumulative start/end times for a list of segments already in
 * broadcast order. Pure function — no I/O, fully unit-testable.
 */
export function computeTimeline(ordered: Segment[]): {
  entries: TimelineEntry[]
  totalDuration: number
} {
  let cursor = 0
  const entries: TimelineEntry[] = ordered.map((seg, index) => {
    const start = cursor
    const end = cursor + seg.duration
    cursor = end
    return { segmentId: seg.id, index, start, end }
  })
  return { entries, totalDuration: cursor }
}

/** Compare total duration against a target show length. */
export function checkOvertime(totalDuration: number, targetDuration: number): OvertimeResult {
  const remainingSeconds = targetDuration - totalDuration
  return {
    overtime: totalDuration > targetDuration,
    overtimeSeconds: Math.max(0, totalDuration - targetDuration),
    remainingSeconds,
  }
}

/**
 * Parse a wall-clock time "HH:MM" or "HH:MM:SS" into seconds since midnight.
 * Note this is wall-clock, not duration — "19:10" is 7:10 PM, not 19 minutes.
 */
export function parseWallClock(value: string): number {
  const parts = value.trim().split(':').map((n) => parseInt(n, 10))
  const h = Number.isNaN(parts[0]) ? 0 : parts[0]
  const m = parts[1] ?? 0
  const s = parts[2] ?? 0
  return h * 3600 + m * 60 + s
}

/** Format seconds as a duration "HH:MM:SS" or "MM:SS" (cumulative, from zero). */
export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

/** Format seconds-since-midnight as a wall-clock "HH:MM". */
export function formatWallClock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  const h = Math.floor(s / 3600) % 24
  const m = Math.floor((s % 3600) / 60)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}`
}

/**
 * Flag segments whose required wall-clock start (`anchorAt`) does not match
 * where the cumulative timeline actually places them, relative to the show's
 * own start time.
 */
export function detectAnchorConflicts(
  ordered: Segment[],
  entries: TimelineEntry[],
  showStartClock: string,
): AnchorConflict[] {
  if (!showStartClock.trim()) return []
  const showStart = parseWallClock(showStartClock)
  const byId = new Map(ordered.map((s) => [s.id, s]))
  const conflicts: AnchorConflict[] = []

  for (const entry of entries) {
    const seg = byId.get(entry.segmentId)
    if (!seg?.anchorAt) continue
    const expected = parseWallClock(seg.anchorAt)
    const actual = showStart + entry.start
    if (expected !== actual) {
      conflicts.push({
        segmentId: seg.id,
        title: seg.title,
        expectedStart: expected,
        actualStart: actual,
        deltaSeconds: actual - expected,
      })
    }
  }

  return conflicts
}
