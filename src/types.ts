/** Broadcast segment kinds used across a rundown. */
export type SegmentType =
  | 'open'
  | 'host'
  | 'news'
  | 'interview'
  | 'vcr'
  | 'commercial'
  | 'interactive'
  | 'performance'
  | 'closing'

export interface Segment {
  id: string
  type: SegmentType
  title: string
  /** Planned duration in seconds. */
  duration: number
  /** Director notes — host lines, source tape, guest info, etc. */
  notes: string
  /** Optional absolute wall-clock start time, e.g. "19:30". */
  anchorAt?: string
  position: { x: number; y: number }
}
