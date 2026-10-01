import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { SegmentNode } from './SegmentNode'
import { useRundownStore } from '../store/rundownStore'
import { useRundownComputed } from '../hooks/useRundown'
import { SEGMENT_TYPE_MAP } from '../data/segmentTypes'
import type { Segment } from '../types'

const nodeTypes = { segment: SegmentNode }

export function Canvas() {
  const segments = useRundownStore((s) => s.segments)
  const edges = useRundownStore((s) => s.edges)
  const selectedId = useRundownStore((s) => s.selectedId)
  const moveSegment = useRundownStore((s) => s.moveSegment)
  const removeSegment = useRundownStore((s) => s.removeSegment)
  const select = useRundownStore((s) => s.select)
  const connect = useRundownStore((s) => s.connect)
  const disconnect = useRundownStore((s) => s.disconnect)

  const { activeSegmentId } = useRundownComputed()

  const nodes: Node[] = segments.map((seg) => ({
    id: seg.id,
    type: 'segment',
    position: seg.position,
    data: { segment: seg, active: seg.id === activeSegmentId },
    selected: seg.id === selectedId,
  }))

  const flowEdges: Edge[] = edges.map((e) => ({ id: e.id, source: e.source, target: e.target }))

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          moveSegment(change.id, change.position)
        } else if (change.type === 'select' && change.selected) {
          select(change.id)
        } else if (change.type === 'remove') {
          removeSegment(change.id)
        }
      }
    },
    [moveSegment, removeSegment, select],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      for (const change of changes) {
        if (change.type === 'remove') {
          disconnect(change.id)
        }
      }
    },
    [disconnect],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        connect(connection.source, connection.target)
      }
    },
    [connect],
  )

  const onPaneClick = useCallback(() => select(null), [select])

  return (
    <ReactFlow
      nodes={nodes}
      edges={flowEdges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      fitView
      minZoom={0.2}
      defaultEdgeOptions={{ type: 'smoothstep' }}
    >
      <Background gap={22} color="#181822" />
      <Controls className="!bg-ink-900" />
      <MiniMap
        pannable
        zoomable
        className="!bg-ink-900"
        nodeColor={(n) => SEGMENT_TYPE_MAP[(n.data.segment as Segment).type].hex}
      />
    </ReactFlow>
  )
}
