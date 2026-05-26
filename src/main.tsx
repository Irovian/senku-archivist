import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BookOpen,
  Boxes,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Download,
  FileClock,
  GitBranch,
  GitCompare,
  History,
  LockKeyhole,
  RefreshCcw,
  Save,
  Search,
  Sparkles,
} from 'lucide-react'
import { eppSeedWorkspace, type WorkspaceDocument } from './data/eppSeedWorkspace'
import { markdownTitle, parseMarkdown, placeholdersIn, renderInline } from './lib/markdown'
import {
  listWorkbooks,
  readWorkbookState,
  writeDraftWorkbookState,
  type WorkbookState,
  type WorkbookSummary,
} from './lib/workbookService'
import './styles.css'

const historyEvents = [
  {
    label: 'Seed imported',
    detail: 'Three EPP Markdown bundles copied from the original process repo for app scaffolding.',
    when: '2026-05-26',
    commit: 'pending initial commit',
  },
  {
    label: 'Hybrid history selected',
    detail: 'Git will store durable document snapshots; Archivist will store proposal and approval context.',
    when: '2026-05-26',
    commit: 'decision DEC-SG-0003',
  },
]

const auditEvents = [
  {
    label: 'Write posture',
    detail: 'Model-assisted writes require proposal review before touching Markdown.',
    state: 'Active',
  },
  {
    label: 'Draft handling',
    detail: 'Autosaves and drafts stay out of committed document history until accepted.',
    state: 'Planned',
  },
  {
    label: 'Export traceability',
    detail: 'Future exports should link back to the approved document set and audit ledger.',
    state: 'Planned',
  },
]

function App() {
  const [activeDocId, setActiveDocId] = React.useState(eppSeedWorkspace.documents[0]?.docId)
  const [query, setQuery] = React.useState('')
  const [rightTab, setRightTab] = React.useState<'workbook' | 'history' | 'audit'>('workbook')

  const filteredDocuments = eppSeedWorkspace.documents.filter((document) => {
    const haystack = `${document.title} ${document.group} ${document.meta.placeholder_ids?.join(' ') ?? ''}`.toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })
  const activeDocument =
    eppSeedWorkspace.documents.find((document) => document.docId === activeDocId) ?? eppSeedWorkspace.documents[0]

  return (
    <main className="app-shell">
      <aside className="workspace-rail" aria-label="Workspace documents">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <Boxes size={20} />
          </div>
          <div>
            <strong>Archivist</strong>
            <span>{eppSeedWorkspace.name}</span>
          </div>
        </div>

        <div className="workspace-facts" aria-label="Workspace facts">
          <span>
            <GitBranch size={14} />
            Git + ledger
          </span>
          <span>
            <LockKeyhole size={14} />
            Review-gated writes
          </span>
        </div>

        <label className="search-box">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search documents" />
        </label>

        <nav className="document-list" aria-label="Seed workspace documents">
          {filteredDocuments.map((document) => (
            <button
              className={document.docId === activeDocument.docId ? 'document-link active' : 'document-link'}
              key={document.docId}
              type="button"
              onClick={() => setActiveDocId(document.docId)}
            >
              <span className="document-title">{document.title}</span>
              <span className="document-meta">
                {document.group}
                <span>{document.meta.placeholder_ids?.length ?? placeholdersIn(document.markdown).length} blanks</span>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="reader-pane" aria-label="Document reader">
        <header className="reader-toolbar">
          <div>
            <span className="eyebrow">Latest tracked Markdown</span>
            <h1>{markdownTitle(activeDocument.markdown, activeDocument.title)}</h1>
          </div>
          <div className="toolbar-actions">
            <button type="button" title="Draft recommendation">
              <Sparkles size={18} />
              <span>Recommend</span>
            </button>
            <button type="button" title="Compare versions">
              <GitCompare size={18} />
              <span>Compare</span>
            </button>
            <button type="button" title="Export current document">
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </header>

        <div className="document-status-strip">
          <StatusPill icon={<BookOpen size={14} />} label={activeDocument.meta.lifecycle_status ?? 'drafting'} />
          <StatusPill icon={<CheckCircle2 size={14} />} label={activeDocument.meta.review_status ?? 'not started'} />
          <StatusPill icon={<FileClock size={14} />} label={`${placeholdersIn(activeDocument.markdown).length} placeholders`} />
        </div>

        <article className="document-paper">
          <RenderedDocument document={activeDocument} />
        </article>
      </section>

      <aside className="inspector-pane" aria-label="History and audit inspector">
        <div className="inspector-tabs" role="tablist" aria-label="Inspector views">
          <button
            className={rightTab === 'workbook' ? 'active' : ''}
            type="button"
            onClick={() => setRightTab('workbook')}
            role="tab"
            aria-selected={rightTab === 'workbook'}
          >
            <ClipboardList size={16} />
            Workbook
          </button>
          <button
            className={rightTab === 'history' ? 'active' : ''}
            type="button"
            onClick={() => setRightTab('history')}
            role="tab"
            aria-selected={rightTab === 'history'}
          >
            <History size={16} />
            History
          </button>
          <button
            className={rightTab === 'audit' ? 'active' : ''}
            type="button"
            onClick={() => setRightTab('audit')}
            role="tab"
            aria-selected={rightTab === 'audit'}
          >
            <Clock3 size={16} />
            Audit
          </button>
        </div>

        {rightTab === 'workbook' && <WorkbookPanel />}
        {rightTab === 'history' && <HistoryPanel document={activeDocument} />}
        {rightTab === 'audit' && <AuditPanel />}
      </aside>
    </main>
  )
}

function StatusPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="status-pill">
      {icon}
      {label.replace(/_/g, ' ')}
    </span>
  )
}

function RenderedDocument({ document }: { document: WorkspaceDocument }) {
  const blocks = parseMarkdown(document.markdown)
  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind === 'heading') {
          if (block.level === 1) return null
          const HeadingTag = `h${Math.min(block.level + 1, 4)}` as 'h2' | 'h3' | 'h4'
          return (
            <HeadingTag id={block.id} key={`${block.id}-${index}`}>
              {block.text}
            </HeadingTag>
          )
        }
        if (block.kind === 'list') {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ul>
          )
        }
        return <p key={`paragraph-${index}`}>{renderInline(block.text)}</p>
      })}
    </>
  )
}

function HistoryPanel({ document }: { document: WorkspaceDocument }) {
  return (
    <section className="inspector-section">
      <div className="section-heading">
        <span className="eyebrow">Document timeline</span>
        <h2>{document.title}</h2>
      </div>
      <div className="history-mode">
        <GitBranch size={18} />
        <div>
          <strong>{eppSeedWorkspace.history.mode.replace(/_/g, ' ')}</strong>
          <span>{eppSeedWorkspace.history.gitStrategy.replace(/_/g, ' ')}</span>
        </div>
      </div>
      <div className="timeline">
        {historyEvents.map((event) => (
          <div className="timeline-event" key={event.label}>
            <span className="timeline-dot" />
            <strong>{event.label}</strong>
            <p>{event.detail}</p>
            <small>
              {event.when} · {event.commit}
            </small>
          </div>
        ))}
      </div>
    </section>
  )
}

type HvaDraftFields = {
  facilityName: string
  reviewer: string
  reviewDate: string
  communitySources: string
  changesMade: string
}

const emptyHvaDraftFields: HvaDraftFields = {
  facilityName: '',
  reviewer: '',
  reviewDate: '',
  communitySources: '',
  changesMade: '',
}

function WorkbookPanel() {
  const workspaceId = 'epp-full'
  const [workbook, setWorkbook] = React.useState<WorkbookSummary | null>(null)
  const [approvedState, setApprovedState] = React.useState<WorkbookState | null>(null)
  const [draftState, setDraftState] = React.useState<WorkbookState | null>(null)
  const [draftExists, setDraftExists] = React.useState(false)
  const [draftPath, setDraftPath] = React.useState<string | null>(null)
  const [fields, setFields] = React.useState<HvaDraftFields>(emptyHvaDraftFields)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const loadWorkbook = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const workbooks = await listWorkbooks(workspaceId)
      const firstWorkbook = workbooks[0]
      if (!firstWorkbook) {
        setWorkbook(null)
        setApprovedState(null)
        setDraftState(null)
        setFields(emptyHvaDraftFields)
        return
      }
      const [approved, draft] = await Promise.all([
        readWorkbookState(workspaceId, firstWorkbook.parent_document_id, firstWorkbook.workbook_id, 'approved'),
        readWorkbookState(workspaceId, firstWorkbook.parent_document_id, firstWorkbook.workbook_id, 'draft'),
      ])
      setWorkbook(firstWorkbook)
      setApprovedState(approved.state)
      setDraftState(draft.state)
      setDraftExists(draft.exists)
      setDraftPath(draft.path)
      setFields(fieldsFromPayload(draft.exists ? draft.state.state_payload : approved.state.state_payload))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load workbook state.')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void loadWorkbook()
  }, [loadWorkbook])

  async function saveDraft() {
    if (!workbook) return
    setSaving(true)
    setError(null)
    try {
      const nextState = await writeDraftWorkbookState(workspaceId, workbook.parent_document_id, workbook.workbook_id, {
        state_payload: payloadFromFields(fields),
        derived_outputs: {
          prototype_summary: 'HVA draft state captured from the first workbook inspector UI.',
        },
        validation: {
          status: 'draft',
          messages: [],
        },
      })
      setDraftState(nextState.state)
      setDraftExists(true)
      setDraftPath(nextState.path)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save draft workbook state.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="inspector-section">
        <div className="section-heading">
          <span className="eyebrow">Workbook</span>
          <h2>Loading</h2>
        </div>
      </section>
    )
  }

  if (!workbook) {
    return (
      <section className="inspector-section">
        <div className="section-heading">
          <span className="eyebrow">Workbook</span>
          <h2>None found</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="inspector-section workbook-panel">
      <div className="section-heading">
        <span className="eyebrow">Workbook draft</span>
        <h2>{workbook.title}</h2>
      </div>

      <div className="workbook-state-strip">
        <StatusPill icon={<ClipboardList size={14} />} label={draftExists ? 'draft sidecar' : 'approved sidecar'} />
        <StatusPill icon={<LockKeyhole size={14} />} label="approved locked" />
      </div>

      <div className="workbook-summary">
        <strong>{workbook.renderer_template}</strong>
        <span>{approvedState?.schema_version ?? 'archivist-workbook-state/v1'}</span>
        {draftPath && <small>{draftPath}</small>}
      </div>

      <div className="workbook-fields">
        <label>
          <span>Facility</span>
          <input
            value={fields.facilityName}
            onChange={(event) => setFields((current) => ({ ...current, facilityName: event.target.value }))}
          />
        </label>
        <label>
          <span>Reviewer</span>
          <input
            value={fields.reviewer}
            onChange={(event) => setFields((current) => ({ ...current, reviewer: event.target.value }))}
          />
        </label>
        <label>
          <span>Review date</span>
          <input
            type="date"
            value={fields.reviewDate}
            onChange={(event) => setFields((current) => ({ ...current, reviewDate: event.target.value }))}
          />
        </label>
        <label>
          <span>Community sources</span>
          <textarea
            value={fields.communitySources}
            onChange={(event) => setFields((current) => ({ ...current, communitySources: event.target.value }))}
            rows={3}
          />
        </label>
        <label>
          <span>Changes made</span>
          <textarea
            value={fields.changesMade}
            onChange={(event) => setFields((current) => ({ ...current, changesMade: event.target.value }))}
            rows={3}
          />
        </label>
      </div>

      {error && <p className="workbook-error">{error}</p>}

      <div className="workbook-actions">
        <button type="button" onClick={() => void saveDraft()} disabled={saving}>
          <Save size={16} />
          {saving ? 'Saving' : 'Save Draft'}
        </button>
        <button type="button" onClick={() => void loadWorkbook()} disabled={saving}>
          <RefreshCcw size={16} />
          Reload
        </button>
      </div>

      <div className="workbook-audit">
        <span>Approved: {approvedState?.audit.updated_at ?? 'not started'}</span>
        <span>Draft: {draftState?.audit.updated_at ?? 'not started'}</span>
      </div>
    </section>
  )
}

function fieldsFromPayload(payload: Record<string, unknown>): HvaDraftFields {
  const reviewEvidence = valueAsRecord(payload.review_evidence)
  return {
    facilityName: valueAsString(payload.facility_name),
    reviewer: valueAsString(reviewEvidence.reviewer),
    reviewDate: valueAsString(reviewEvidence.review_date),
    communitySources: valueAsString(reviewEvidence.community_sources),
    changesMade: valueAsString(reviewEvidence.changes_made),
  }
}

function payloadFromFields(fields: HvaDraftFields): Record<string, unknown> {
  return {
    facility_name: fields.facilityName,
    review_evidence: {
      review_date: fields.reviewDate,
      reviewer: fields.reviewer,
      community_sources: fields.communitySources,
      changes_made: fields.changesMade,
    },
  }
}

function valueAsRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

function valueAsString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function AuditPanel() {
  return (
    <section className="inspector-section">
      <div className="section-heading">
        <span className="eyebrow">Review ledger</span>
        <h2>Policy context</h2>
      </div>
      <div className="audit-list">
        {auditEvents.map((event) => (
          <div className="audit-row" key={event.label}>
            <span>{event.state}</span>
            <strong>{event.label}</strong>
            <p>{event.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
