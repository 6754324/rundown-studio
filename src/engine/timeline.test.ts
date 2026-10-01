import { describe, it, expect } from 'vitest'
import {
  computeTimeline,
  checkOvertime,
  parseWallClock,
  formatClock,
  formatWallClock,
  detectAnchorConflicts,
} from './timeline'
import type { Segment } from '../types'

function seg(id: string, duration: number, anchorAt?: string): Segment {
  return { id, type: 'vcr', title: id, duration, notes: '', anchorAt, position: { x: 0, y: 0 } }
}

describe('computeTimeline', () => {
  it('accumulates start/end times in order', () => {
    const ordered = [seg('a', 60), seg('b', 90), seg('c', 30)]
    const { entries, totalDuration } = computeTimeline(ordered)
    expect(entries.map((e) => [e.start, e.end])).toEqual([
      [0, 60],
      [60, 150],
      [150, 180],
    ])
    expect(totalDuration).toBe(180)
  })

  it('handles an empty rundown', () => {
    expect(computeTimeline([]).totalDuration).toBe(0)
  })
})

describe('checkOvertime', () => {
  it('detects overtime', () => {
    const r = checkOvertime(3700, 3600)
    expect(r.overtime).toBe(true)
    expect(r.overtimeSeconds).toBe(100)
    expect(r.remainingSeconds).toBe(-100)
  })

  it('reports remaining time when under budget', () => {
    const r = checkOvertime(3500, 3600)
    expect(r.overtime).toBe(false)
    expect(r.remainingSeconds).toBe(100)
  })
})

describe('formatClock / parseWallClock / formatWallClock', () => {
  it('formats duration as MM:SS under an hour', () => {
    expect(formatClock(65)).toBe('01:05')
  })

  it('formats duration as HH:MM:SS over an hour', () => {
    expect(formatClock(3661)).toBe('01:01:01')
  })

  it('parses wall-clock HH:MM into seconds since midnight', () => {
    expect(parseWallClock('19:00')).toBe(68400)
  })

  it('parses wall-clock HH:MM:SS', () => {
    expect(parseWallClock('01:01:01')).toBe(3661)
  })

  it('round-trips wall-clock', () => {
    expect(formatWallClock(parseWallClock('19:30'))).toBe('19:30')
  })
})

describe('detectAnchorConflicts', () => {
  it('flags a segment that is late relative to its anchor', () => {
    const ordered = [seg('a', 60), seg('b', 300, '19:00')]
    const { entries } = computeTimeline(ordered)
    // Show starts 18:50; segment b is placed at 18:51 but anchored at 19:00.
    const conflicts = detectAnchorConflicts(ordered, entries, '18:50')
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0].segmentId).toBe('b')
    expect(conflicts[0].deltaSeconds).toBe(-540) // 9 minutes early
  })

  it('returns no conflicts when anchors match', () => {
    const ordered = [seg('a', 600), seg('b', 60, '19:10')]
    const { entries } = computeTimeline(ordered)
    expect(detectAnchorConflicts(ordered, entries, '19:00')).toHaveLength(0)
  })

  it('ignores anchors when no show start is set', () => {
    const ordered = [seg('a', 60, '19:00')]
    const { entries } = computeTimeline(ordered)
    expect(detectAnchorConflicts(ordered, entries, '')).toHaveLength(0)
  })
})
