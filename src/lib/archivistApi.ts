const SERVICE_BASE_URL = 'http://127.0.0.1:8798'

type ApiEnvelope<T> = {
  ok: boolean
  data: T
  error?: {
    message: string
  }
  meta?: {
    exists?: boolean
    path?: string | null
  }
}

export type ServiceStatus = {
  local_only: boolean
  service: string
  history_model: string
  workspace_count: number
}

export type WorkspaceSummary = {
  workspace_id: string
  name: string
  description?: string
  document_count: number
  import_summary?: {
    document_count?: number
    provenance_source_count?: number
    retained_regulatory_source_count?: number
  }
  history?: {
    mode?: string
    git_strategy?: string
    latest_view?: string
  }
}

export type NavigationDocument = {
  doc_id: string
  title: string
  library_id: string
  group_id: string
  group_label: string
  subgroup: string
  content_group: string
  content_type: string
  lifecycle_status: string
  editable: boolean
  source_count: number
  requirement_count: number
  placeholder_count: number
  artifact_count: number
}

export type NavigationGroup = {
  id: string
  label: string
  order: number
  library_id: string
  count: number
  documents: NavigationDocument[]
}

export type NavigationLibrary = {
  id: string
  label: string
  count: number
  default_document_id: string | null
  groups: NavigationGroup[]
}

export type WorkspaceNavigation = {
  schema_version: string
  workspace_id: string
  default_document_id: string | null
  document_count: number
  libraries: NavigationLibrary[]
  document_index: Record<
    string,
    {
      title: string
      library_id: string
      group_id: string
      subgroup: string
    }
  >
}

export type DocumentAnchor = {
  id: string
  label: string
  level: number
}

export type EditSection = {
  section_id: string
  level: 2 | 3 | 4
  heading: string
  original_text: string
  block_types: Array<'p' | 'li' | 'blockquote' | 'h2' | 'h3' | 'h4'>
  validation_messages?: string[]
}

export type EditBlock = {
  block_id: string
  block_type: 'p' | 'li' | 'blockquote' | 'h2' | 'h3' | 'h4'
  original_text: string
}

export type SourceReference = {
  source_id: string
  label: string
}

export type ComplianceReference = {
  requirement_id: string
  citation?: string
  e_tags?: string[]
  applicability?: string
  summary?: string
}

export type ArtifactSummary = {
  artifact_id: string
  doc_id: string
  title: string
  artifact_type: string
  renderer_template: string
  render_intent?: {
    digital?: string
    print?: string
  }
  placeholder_ids?: string[]
  review_questions?: string[]
  context?: {
    intro?: {
      title?: string
      purpose?: string
      how_used?: string
      compliance_note?: string
      outputs?: string[]
    }
    methodology?: Record<string, unknown>
    workflow_steps?: Array<{
      id?: string
      label?: string
      description?: string
    }>
    hazard_categories?: Array<{
      id?: string
      label?: string
      description?: string
    }>
    print_rules?: string[]
  }
}

export type BrowserDocument = {
  schema_version: string
  workspace_id: string
  doc_id: string
  title: string
  metadata: {
    content_group: string
    content_type: string
    lifecycle_status: string
    editable: boolean
    placeholder_ids: string[]
    source_ids: string[]
    requirement_ids: string[]
    missing_markdown: boolean
    source_hash: string
  }
  rendered: {
    format: 'html'
    html: string
    anchors: DocumentAnchor[]
    edit_sections: EditSection[]
    edit_blocks: EditBlock[]
  }
  source_orientation: SourceReference[]
  compliance_orientation: ComplianceReference[]
  artifacts: ArtifactSummary[]
}

export type ManualDraftSource = 'manual_edit' | 'model_proposal'
export type ManualDraftChangeType = 'replace_section' | 'insert_section'

export type ManualDraft = {
  draft_id: string
  section_id: string
  section_level: number
  section_heading: string
  block_id: string
  block_type: string
  original_text: string
  draft_text: string
  validation_messages?: string[]
  source: ManualDraftSource
  status: 'pending' | 'rejected'
  change_type?: ManualDraftChangeType
  insert_after_section_id?: string | null
  insert_before_section_id?: string | null
  created_at?: string
  updated_at?: string
}

export type ManualDraftState = {
  schema_version: string
  workspace_id: string
  document_id: string
  source_hash: string
  status: 'draft'
  drafts: ManualDraft[]
  audit: {
    created_at?: string
    updated_at?: string
    created_by?: string
    apply_status?: string
    linked_commit?: string | null
  }
}

export type ManualDraftStateResponse = {
  state: ManualDraftState
  exists: boolean
  path: string | null
}

async function requestApi<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${SERVICE_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  })
  const envelope = (await response.json()) as ApiEnvelope<T>
  if (!response.ok || !envelope.ok) {
    throw new Error(envelope.error?.message ?? `Archivist service returned ${response.status}`)
  }
  return envelope
}

async function readApi<T>(path: string): Promise<T> {
  const envelope = await requestApi<T>(path)
  return envelope.data
}

export async function readStatus(): Promise<ServiceStatus> {
  return readApi<ServiceStatus>('/api/status')
}

export async function listWorkspaces(): Promise<WorkspaceSummary[]> {
  return readApi<WorkspaceSummary[]>('/api/workspaces')
}

export async function readNavigation(workspaceId: string): Promise<WorkspaceNavigation> {
  return readApi<WorkspaceNavigation>(`/api/workspaces/${encodeURIComponent(workspaceId)}/navigation`)
}

export async function readDocument(workspaceId: string, documentId: string): Promise<BrowserDocument> {
  return readApi<BrowserDocument>(
    `/api/workspaces/${encodeURIComponent(workspaceId)}/documents/${encodeURIComponent(documentId)}`,
  )
}

export async function readManualDraftState(
  workspaceId: string,
  documentId: string,
): Promise<ManualDraftStateResponse> {
  const envelope = await requestApi<ManualDraftState>(
    `/api/workspaces/${encodeURIComponent(workspaceId)}/manual-drafts/${encodeURIComponent(documentId)}`,
  )
  return {
    state: envelope.data,
    exists: Boolean(envelope.meta?.exists),
    path: envelope.meta?.path ?? null,
  }
}

export async function writeManualDraftState(
  workspaceId: string,
  documentId: string,
  payload: Pick<ManualDraftState, 'source_hash' | 'drafts'> & { audit?: ManualDraftState['audit'] },
): Promise<ManualDraftStateResponse> {
  const envelope = await requestApi<ManualDraftState>(
    `/api/workspaces/${encodeURIComponent(workspaceId)}/manual-drafts/${encodeURIComponent(documentId)}`,
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
