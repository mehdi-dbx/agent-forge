import { useEffect, useState, useCallback } from 'react'
import { ReactFlowProvider, type Node, type NodeMouseHandler } from '@xyflow/react'
import { Settings2, Moon, Sun } from 'lucide-react'
import { ArchCanvas } from './components/ArchCanvas'
import { Legend } from './components/Legend'
import { NodeDetailPanel } from './components/NodeDetailPanel'
import { EnvEditor } from './components/EnvEditor'
import { SetupView } from './components/SetupView'
import type { GraphResponse, ArchNode, ArchNodeData } from './types'

type View = 'arch' | 'setup'

export default function App() {
  const [view, setView]         = useState<View>('arch')
  const [dark, setDark]         = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [graph, setGraph]       = useState<GraphResponse | null>(null)
  const [error, setError]       = useState<string | null>(null)
  const [selected, setSelected] = useState<ArchNode | null>(null)
  const [envOpen, setEnvOpen]   = useState(false)

  useEffect(() => {
    fetch('/api/graph')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<GraphResponse>
      })
      .then(setGraph)
      .catch((e: unknown) => setError(String(e)))
  }, [])

  const onNodeClick: NodeMouseHandler<Node<ArchNodeData>> = useCallback((_event, node) => {
    setEnvOpen(false)
    setSelected(node as ArchNode)
  }, [])

  const closePanel = useCallback(() => setSelected(null), [])
  const openEnv    = useCallback(() => { setSelected(null); setEnvOpen(true) }, [])
  const closeEnv   = useCallback(() => setEnvOpen(false), [])
  const switchView = (v: View) => { setView(v); setSelected(null); setEnvOpen(false) }

  if (error) {
    return (
      <div className={`${dark ? 'dark' : ''} flex h-full items-center justify-center bg-zinc-50 dark:bg-zinc-950`}>
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 px-6 py-4 text-sm text-red-700 dark:text-red-400">
          Failed to load architecture graph: {error}
        </div>
      </div>
    )
  }

  return (
    <div className={`${dark ? 'dark' : ''} relative h-full w-full overflow-hidden bg-white dark:bg-zinc-950`}>
      {/* Title bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2
        bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Agent Forge</span>
          {/* View tabs */}
          <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded p-0.5">
            <button
              onClick={() => switchView('arch')}
              className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                view === 'arch'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => switchView('setup')}
              className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                view === 'setup'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              Setup
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {graph && (
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {graph.meta.projectRoot.split('/').slice(-1)[0]}
            </span>
          )}
          <button
            onClick={() => setDark(d => !d)}
            className="p-1.5 rounded text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={envOpen ? closeEnv : openEnv}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors
              ${envOpen
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200'}`}
          >
            <Settings2 className="h-3.5 w-3.5" />
            .env
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-full w-full pt-9">
        {view === 'arch' ? (
          !graph ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-sm text-zinc-400 dark:text-zinc-500">Loading architecture…</div>
            </div>
          ) : (
            <ReactFlowProvider>
              <ArchCanvas
                nodes={graph.nodes as Node<ArchNodeData>[]}
                edges={graph.edges}
                onNodeClick={onNodeClick}
              />
              <Legend />
            </ReactFlowProvider>
          )
        ) : (
          <SetupView />
        )}
      </div>

      {view === 'arch' && <NodeDetailPanel node={selected} onClose={closePanel} />}
      <EnvEditor open={envOpen} onClose={closeEnv} />
    </div>
  )
}
