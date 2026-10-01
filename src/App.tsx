import { Canvas } from './components/Canvas'
import { Toolbar } from './components/Toolbar'
import { Inspector } from './components/Inspector'
import { TimelinePanel } from './components/TimelinePanel'

export default function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-ink-950 font-sans text-zinc-300">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <main className="relative flex-1">
          <Canvas />
        </main>
        <aside className="flex w-96 shrink-0 flex-col overflow-hidden border-l border-white/10">
          <Inspector />
          <TimelinePanel />
        </aside>
      </div>
    </div>
  )
}
