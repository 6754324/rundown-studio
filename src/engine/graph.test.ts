import { describe, it, expect } from 'vitest'
import { topologicalOrder } from './graph'

describe('topologicalOrder', () => {
  it('orders a linear chain', () => {
    const nodes = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ]
    expect(topologicalOrder(nodes, edges)).toEqual(['a', 'b', 'c'])
  })

  it('orders a branch-and-merge graph', () => {
    const nodes = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'a', target: 'c' },
      { source: 'b', target: 'd' },
      { source: 'c', target: 'd' },
    ]
    const order = topologicalOrder(nodes, edges)
    expect(order[0]).toBe('a')
    expect(order[order.length - 1]).toBe('d')
    expect(order).toHaveLength(4)
    expect(order).toContain('b')
    expect(order).toContain('c')
  })

  it('returns a partial order when a cycle exists', () => {
    const nodes = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'c', target: 'a' }, // cycle
    ]
    expect(topologicalOrder(nodes, edges)).toHaveLength(0)
  })

  it('ignores edges that reference unknown nodes', () => {
    const nodes = [{ id: 'a' }, { id: 'b' }]
    const edges = [{ source: 'a', target: 'missing' }]
    expect(topologicalOrder(nodes, edges)).toEqual(['a', 'b'])
  })
})
