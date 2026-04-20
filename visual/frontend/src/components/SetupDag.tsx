import type { StepId, StepStatus, StepState } from '../types'

interface SetupDagProps {
  stepStates: Record<StepId, StepState>
  activeStep: StepId
  onActivate: (id: StepId) => void
  readyCount: number
  totalCount: number
}

const ORB_CLASS: Record<StepStatus, string> = {
  done:    'bg-[#1D9E75]',
  warning: 'bg-[#EF9F27] animate-pulse',
  error:   'bg-[#E24B4A]',
  missing: 'bg-zinc-300 dark:bg-zinc-600',
  unknown: 'bg-zinc-300 dark:bg-zinc-600',
}

function subLabel(id: StepId, state: StepState): string {
  const v = state.values
  if (state.status === 'missing') return 'not configured'
  switch (id) {
    case 'host':      return v.DATABRICKS_HOST?.replace('https://', '').split('.')[0] || 'set'
    case 'auth':      return 'token set'
    case 'warehouse': return v.DATABRICKS_WAREHOUSE_ID?.slice(0, 10) || 'set'
    case 'schema':    return v.PROJECT_UNITY_CATALOG_SCHEMA || 'set'
    case 'model':     return 'endpoint set'
    case 'genie':     return v.PROJECT_GENIE_CHECKIN?.slice(0, 8) + '…' || 'set'
    case 'ka':        return v.PROJECT_KA_PASSENGERS?.slice(0, 12) || 'set'
    case 'mlflow':    return v.MLFLOW_EXPERIMENT_ID || 'set'
    case 'grants':    return 'run to apply'
    default:          return 'set'
  }
}

const ALL_STEPS: StepId[] = ['host', 'auth', 'warehouse', 'schema', 'model', 'genie', 'ka', 'mlflow', 'grants']

export function SetupDag({ stepStates, activeStep, onActivate, readyCount, totalCount }: SetupDagProps) {
  return (
    <div className="flex flex-col h-full px-4 py-4">
      {/* Top pill */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full px-2.5 py-0.5">
          .env.local
        </span>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          {readyCount} / {totalCount}
        </span>
      </div>

      {/* Nodes — single column, flex-grow connectors fill height */}
      <div className="flex flex-col flex-1 min-h-0">
        {ALL_STEPS.map((id, idx) => {
          const state  = stepStates[id]
          const active = activeStep === id
          return (
            <div key={id} className="flex flex-col items-center" style={{ flex: idx < ALL_STEPS.length - 1 ? '1 1 0' : '0 0 auto' }}>
              <button
                onClick={() => onActivate(id)}
                className={`
                  w-[140px] flex items-center gap-2.5 px-3 py-2 rounded border text-left transition-colors duration-100 flex-shrink-0
                  font-mono
                  ${active
                    ? 'border-[#534AB7] bg-[#EEEDFE] dark:bg-[#2d2960]/50 dark:border-[#7b74e8]'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600'}
                `}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ORB_CLASS[state.status]}`} />
                <div className="min-w-0">
                  <div className={`text-[12px] font-medium leading-tight truncate ${active ? 'text-[#534AB7] dark:text-[#9f9af5]' : 'text-zinc-800 dark:text-zinc-100'}`}>
                    {id}
                  </div>
                  <div className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight truncate">
                    {subLabel(id, state)}
                  </div>
                </div>
              </button>

              {/* Connector — flex-1 fills gap between nodes */}
              {idx < ALL_STEPS.length - 1 && (
                <div className="flex justify-center flex-1 min-h-[8px]">
                  <div className="w-px bg-zinc-200 dark:bg-zinc-800" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
