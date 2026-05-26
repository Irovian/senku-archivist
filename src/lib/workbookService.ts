const SERVICE_BASE_URL = 'http://127.0.0.1:8798'

export type WorkbookSummary = {
  workbook_id: string
  parent_document_id: string
  title: string
  artifact_type: string
  renderer_template: string
  render_intent?: {
    digital?: string
    print?: string
  }
  review_questions?: string[]
}

export type WorkbookState = {
  schema_version: string
  workspace_id: string
  parent_document_id: string
  workbook_id: string
  artifact_type: string
  renderer_template: string
  status: 'approved' | 'draft'
  state_payload: Record<string, unknown>
  derived_outputs: Record<string, unknown>
  validation: {
    status: string
    messages: string[]
  }
  audit: {
    created_at?: string
    updated_at?: string
    created_by?: string
    approved_at?: string | null
    approved_by?: string | null
    linked_commit?: string | null
  }
}

type ApiEnvelope<T> = {
  ok: boolean
  data: T
  error?: {
    message: string
  }
  meta?: {
    exists?: boolean
    path?: string
  }
}

export type WorkbookStateResponse = {
  state: WorkbookState
  exists: boolean
  path: string | null
}

async function readApi<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${SERVICE_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const envelope = (await response.json()) as ApiEnvelope<T>
  if (!response.ok || !envelope.ok) {
    throw new Error(envelope.error?.message ?? `Archivist service returned ${response.status}`)
  }
  return envelope
}

export async function listWorkbooks(workspaceId: string): Promise<WorkbookSummary[]> {
  const envelope = await readApi<WorkbookSummary[]>(`/api/workspaces/${workspaceId}/workbooks`)
  return envelope.data
}

export async function readWorkbookState(
  workspaceId: string,
  documentId: string,
  workbookId: string,
  status: 'approved' | 'draft',
): Promise<WorkbookStateResponse> {
  const envelope = await readApi<WorkbookState>(
    `/api/workspaces/${workspaceId}/workbooks/${documentId}/${workbookId}/state?status=${status}`,
  )
  return {
    state: envelope.data,
    exists: envelope.meta?.exists ?? true,
    path: envelope.meta?.path ?? null,
  }
}

export async function writeDraftWorkbookState(
  workspaceId: string,
  documentId: string,
  workbookId: string,
  payload: Pick<WorkbookState, 'state_payload' | 'derived_outputs' | 'validation'>,
): Promise<WorkbookStateResponse> {
  const envelope = await readApi<WorkbookState>(
    `/api/workspaces/${workspaceId}/workbooks/${documentId}/${workbookId}/state?status=draft`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  )
  return {
    state: envelope.data,
    exists: true,
    path: envelope.meta?.path ?? null,
  }
}
