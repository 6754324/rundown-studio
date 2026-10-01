/**
 * Minimal node/edge shapes, independent of any UI library, so the graph
 * logic stays pure and unit-testable.
 */
export interface FlowNode {
  id: string
}

export interface FlowEdge {
  source: string
  target: string
}

/**
 * Kahn's algorithm for topological sorting. Returns an ordered list of node
 * ids. If the graph contains a cycle, the returned list is shorter than the
 * input (the leftover nodes form the cycle) — callers can detect this by
 * comparing lengths.
 */
export function topologicalOrder(nodes: FlowNode[], edges: FlowEdge[]): string[] {
  const indegree = new Map<string, number>()
  const adjacency = new Map<string, string[]>()

  for (const node of nodes) {
    indegree.set(node.id, 0)
    adjacency.set(node.id, [])
  }

  for (const edge of edges) {
    if (!adjacency.has(edge.source) || !indegree.has(edge.target)) continue
    adjacency.get(edge.source)!.push(edge.target)
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1)
  }

  const queue = nodes.filter((n) => (indegree.get(n.id) ?? 0) === 0).map((n) => n.id)
  const order: string[] = []

  while (queue.length > 0) {
    const id = queue.shift()!
    order.push(id)
    for (const next of adjacency.get(id) ?? []) {
      const nextDegree = (indegree.get(next) ?? 1) - 1
      indegree.set(next, nextDegree)
      if (nextDegree === 0) queue.push(next)
    }
  }

  return order
}
