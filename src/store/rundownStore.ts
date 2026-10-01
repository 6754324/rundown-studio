import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Segment, SegmentType } from '../types'
import { SEGMENT_TYPE_MAP } from '../data/segmentTypes'
import { templateToSegments, type RundownTemplate } from '../data/templates'

export interface FlowEdge {
  id: string
  source: string
  target: string
}

interface RundownState {
  segments: Segment[]
  edges: FlowEdge[]
  /** Target show length in seconds. */
  targetDuration: number
  /** Wall-clock start time of the show, e.g. "20:00". */
  showStartAt: string
  selectedId: string | null
  /** Playback head position in seconds (for the simulated run-through). */
  playhead: number
  isPlaying: boolean

  addSegment: (type: SegmentType, position: { x: number; y: number }) => void
  updateSegment: (id: string, patch: Partial<Segment>) => void
  removeSegment: (id: string) => void
  moveSegment: (id: string, position: { x: number; y: number }) => void
  connect: (source: string, target: string) => void
  disconnect: (edgeId: string) => void
  select: (id: string | null) => void
  loadTemplate: (template: RundownTemplate) => void
  clearAll: () => void
  setTargetDuration: (seconds: number) => void
  setShowStartAt: (clock: string) => void
  setPlayhead: (seconds: number) => void
  startPlayback: () => void
  pausePlayback: () => void
  stopPlayback: () => void
  tickPlayhead: (deltaSeconds: number, totalDuration: number) => void
}

export const useRundownStore = create<RundownState>()(
  persist(
    (set) => ({
      segments: [],
      edges: [],
      targetDuration: 3600,
      showStartAt: '20:00',
      selectedId: null,
      playhead: 0,
      isPlaying: false,

      addSegment: (type, position) => {
        const meta = SEGMENT_TYPE_MAP[type]
        const id = crypto.randomUUID()
        const seg: Segment = {
          id,
          type,
          title: meta.label,
          duration: meta.defaultDuration,
          notes: '',
          position,
        }
        set((s) => ({ segments: [...s.segments, seg], selectedId: id }))
      },

      updateSegment: (id, patch) => {
        set((s) => ({
          segments: s.segments.map((seg) => (seg.id === id ? { ...seg, ...patch } : seg)),
        }))
      },

      removeSegment: (id) => {
        set((s) => ({
          segments: s.segments.filter((seg) => seg.id !== id),
          edges: s.edges.filter((e) => e.source !== id && e.target !== id),
          selectedId: s.selectedId === id ? null : s.selectedId,
        }))
      },

      moveSegment: (id, position) => {
        set((s) => ({
          segments: s.segments.map((seg) => (seg.id === id ? { ...seg, position } : seg)),
        }))
      },

      // A rundown is a linear chain: each node has at most one outgoing edge
      // and one incoming edge. Connecting clears any existing link first.
      connect: (source, target) => {
        set((s) => {
          const remaining = s.edges.filter((e) => e.source !== source && e.target !== target)
          remaining.push({ id: `e-${source}-${target}`, source, target })
          return { edges: remaining }
        })
      },

      disconnect: (edgeId) => {
        set((s) => ({ edges: s.edges.filter((e) => e.id !== edgeId) }))
      },

      select: (id) => set({ selectedId: id }),

      loadTemplate: (template) => {
        set({
          segments: templateToSegments(template),
          edges: [],
          targetDuration: template.targetDuration,
          showStartAt: template.showStartAt,
          selectedId: null,
          playhead: 0,
          isPlaying: false,
        })
      },

      clearAll: () =>
        set({ segments: [], edges: [], selectedId: null, playhead: 0, isPlaying: false }),

      setTargetDuration: (seconds) => set({ targetDuration: seconds }),
      setShowStartAt: (clock) => set({ showStartAt: clock }),

      setPlayhead: (seconds) => set({ playhead: seconds }),
      startPlayback: () => set({ isPlaying: true }),
      pausePlayback: () => set({ isPlaying: false }),
      stopPlayback: () => set({ isPlaying: false, playhead: 0 }),

      tickPlayhead: (deltaSeconds, totalDuration) =>
        set((s) => {
          const next = s.playhead + deltaSeconds
          if (next >= totalDuration) {
            return { playhead: totalDuration, isPlaying: false }
          }
          return { playhead: next }
        }),
    }),
    {
      name: 'rundown-studio',
      partialize: (s) => ({
        segments: s.segments,
        edges: s.edges,
        targetDuration: s.targetDuration,
        showStartAt: s.showStartAt,
      }),
    },
  ),
)
