import workspaceManifest from '../../workspaces/epp-seed/workspace.json'
import continuityMarkdown from '../../workspaces/epp-seed/content/governance-and-planning/continuity-of-operations/document.md?raw'
import continuityMeta from '../../workspaces/epp-seed/content/governance-and-planning/continuity-of-operations/document.meta.json'
import riskMarkdown from '../../workspaces/epp-seed/content/governance-and-planning/risk-assessment-process/document.md?raw'
import riskMeta from '../../workspaces/epp-seed/content/governance-and-planning/risk-assessment-process/document.meta.json'
import communicationsMarkdown from '../../workspaces/epp-seed/content/all-hazards-response/communications-plan/document.md?raw'
import communicationsMeta from '../../workspaces/epp-seed/content/all-hazards-response/communications-plan/document.meta.json'

export type DocumentMeta = {
  doc_id: string
  title: string
  content_group: string
  content_type: string
  source_ids?: string[]
  requirement_ids?: string[]
  placeholder_ids?: string[]
  lifecycle_status?: string
  review_status?: string
}

export type WorkspaceDocument = {
  docId: string
  title: string
  group: string
  path: string
  editable: boolean
  markdown: string
  meta: DocumentMeta
}

export type WorkspaceHistory = {
  mode: string
  gitStrategy: string
  latestView: string
  draftsCommitted: boolean
}

export type Workspace = {
  id: string
  name: string
  description: string
  canonicalSource: string
  writePolicy: string
  history: WorkspaceHistory
  documents: WorkspaceDocument[]
}

const manifestDocuments = workspaceManifest.documents

const markdownByDocId: Record<string, string> = {
  [continuityMeta.doc_id]: continuityMarkdown,
  [riskMeta.doc_id]: riskMarkdown,
  [communicationsMeta.doc_id]: communicationsMarkdown,
}

const metaByDocId: Record<string, DocumentMeta> = {
  [continuityMeta.doc_id]: continuityMeta,
  [riskMeta.doc_id]: riskMeta,
  [communicationsMeta.doc_id]: communicationsMeta,
}

export const eppSeedWorkspace: Workspace = {
  id: workspaceManifest.workspace_id,
  name: workspaceManifest.name,
  description: workspaceManifest.description,
  canonicalSource: workspaceManifest.canonical_source.kind,
  writePolicy: workspaceManifest.canonical_source.write_policy,
  history: {
    mode: workspaceManifest.history.mode,
    gitStrategy: workspaceManifest.history.git_strategy,
    latestView: workspaceManifest.history.latest_view,
    draftsCommitted: workspaceManifest.history.drafts_committed,
  },
  documents: manifestDocuments.map((document) => ({
    docId: document.doc_id,
    title: document.title,
    group: document.group,
    path: document.path,
    editable: document.editable,
    markdown: markdownByDocId[document.doc_id] ?? '',
    meta: metaByDocId[document.doc_id],
  })),
}

