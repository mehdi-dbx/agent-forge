export type NodeKind = 'agent' | 'llm' | 'tool' | 'genie' | 'data'
export type DataVariant = 'table' | 'function' | 'procedure'

export interface ArchNodeData extends Record<string, unknown> {
  kind: NodeKind
  label: string
  subtitle?: string
  sourceFile?: string
  meta?: Record<string, string>
  dataVariant?: DataVariant
}

export interface ArchNode {
  id: string
  type: NodeKind
  position: { x: number; y: number }
  data: ArchNodeData
}

export interface ArchEdge {
  id: string
  source: string
  target: string
  label?: string
  animated?: boolean
}

export interface GraphResponse {
  nodes: ArchNode[]
  edges: ArchEdge[]
  meta: {
    projectRoot: string
    generatedAt: string
  }
}

// ─── Setup types ──────────────────────────────────────────────────────────────

export type StepId = 'host' | 'auth' | 'warehouse' | 'schema' | 'model' | 'genie' | 'ka' | 'mlflow' | 'grants'
export type StepStatus = 'done' | 'warning' | 'error' | 'missing' | 'unknown'
export type SetupPhase = 'choose' | 'configure' | 'execute' | 'done'

export interface StepChoice {
  title: string
  desc: string
  action: string
}

export interface SetupStep {
  id: StepId
  label: string
  title: string
  choices: StepChoice[]
}

export interface DbxProfile {
  name: string
  host: string
  valid: boolean
}

export interface DbxWarehouse {
  id: string
  name: string
  state: string
}

export interface DbxGenieSpace {
  id: string
  name: string
}

export interface ExecLine {
  text: string
  stream: 'out' | 'err'
}

export interface StepState {
  status: StepStatus
  values: Record<string, string>
}
