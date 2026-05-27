import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  AlertTriangle,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  GitBranch,
  History,
  Link2,
  LockKeyhole,
  PencilLine,
  RefreshCcw,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react'
import {
  listWorkspaces,
  readDocument,
  readManualDraftState,
  readNavigation,
  readStatus,
  writeManualDraftState,
  type ArtifactSummary,
  type BrowserDocument,
  type EditSection,
  type ManualDraft,
  type ManualDraftState,
  type ManualDraftSource,
  type NavigationDocument,
  type NavigationGroup,
  type NavigationLibrary,
  type ServiceStatus,
  type WorkspaceNavigation,
  type WorkspaceSummary,
} from './lib/archivistApi'
import './styles.css'

const WORKSPACE_ID = 'epp-full'

type AppLoadState = 'loading' | 'ready' | 'error'
type DemoMode = 'reader' | 'agent' | 'edit' | 'draft-review'
type ReviewVersion = 'draft' | 'original'
type DocumentLoadState =
  | { status: 'idle' | 'loading'; document: null; error: null }
  | { status: 'ready'; document: BrowserDocument; error: null }
  | { status: 'error'; document: null; error: string }

function App() {
  const [appState, setAppState] = React.useState<AppLoadState>('loading')
  const [serviceStatus, setServiceStatus] = React.useState<ServiceStatus | null>(null)
  const [workspaces, setWorkspaces] = React.useState<WorkspaceSummary[]>([])
  const [navigation, setNavigation] = React.useState<WorkspaceNavigation | null>(null)
  const [activeLibraryId, setActiveLibraryId] = React.useState('epp')
  const [activeDocumentId, setActiveDocumentId] = React.useState<string | null>(null)
  const [documentState, setDocumentState] = React.useState<DocumentLoadState>({
    status: 'idle',
    document: null,
    error: null,
  })
  const [query, setQuery] = React.useState('')
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({})
  const [loadError, setLoadError] = React.useState<string | null>(null)

  const loadWorkspace = React.useCallback(async () => {
    setAppState('loading')
    setLoadError(null)
    setDocumentState({ status: 'idle', document: null, error: null })
    try {
      const [status, workspaceList, nextNavigation] = await Promise.all([
        readStatus(),
        listWorkspaces(),
        readNavigation(WORKSPACE_ID),
      ])
      const routeDocumentId = documentIdFromHash()
      const initialDocumentId =
        routeDocumentId && nextNavigation.document_index[routeDocumentId]
          ? routeDocumentId
          : nextNavigation.default_document_id
      const initialLibraryId =
        (initialDocumentId && nextNavigation.document_index[initialDocumentId]?.library_id) ??
        nextNavigation.libraries[0]?.id ??
        'epp'

      setServiceStatus(status)
      setWorkspaces(workspaceList)
      setNavigation(nextNavigation)
      setActiveDocumentId(initialDocumentId)
      setActiveLibraryId(initialLibraryId)
      if (initialDocumentId && routeDocumentId !== initialDocumentId) {
        replaceRoute(initialDocumentId)
      }
      setAppState('ready')
    } catch (caught) {
      setLoadError(caught instanceof Error ? caught.message : 'Archivist service is unavailable.')
      setNavigation(null)
      setActiveDocumentId(null)
      setAppState('error')
    }
  }, [])

  React.useEffect(() => {
    void loadWorkspace()
  }, [loadWorkspace])

  React.useEffect(() => {
    function syncFromRoute() {
      if (!navigation) return
      const routeDocumentId = documentIdFromHash()
      if (routeDocumentId && navigation.document_index[routeDocumentId]) {
        setActiveDocumentId(routeDocumentId)
        setActiveLibraryId(navigation.document_index[routeDocumentId].library_id)
      }
    }

    window.addEventListener('hashchange', syncFromRoute)
    window.addEventListener('popstate', syncFromRoute)
    return () => {
      window.removeEventListener('hashchange', syncFromRoute)
      window.removeEventListener('popstate', syncFromRoute)
    }
  }, [navigation])

  React.useEffect(() => {
    if (!activeDocumentId || !navigation?.document_index[activeDocumentId]) return
    setActiveLibraryId(navigation.document_index[activeDocumentId].library_id)
    setExpandedGroups((current) => ({
      ...current,
      [navigation.document_index[activeDocumentId].group_id]: true,
    }))
    setDocumentState({ status: 'loading', document: null, error: null })
    readDocument(WORKSPACE_ID, activeDocumentId)
      .then((document) => setDocumentState({ status: 'ready', document, error: null }))
      .catch((caught) =>
        setDocumentState({
          status: 'error',
          document: null,
          error: caught instanceof Error ? caught.message : 'Unable to load document.',
        }),
      )
  }, [activeDocumentId, navigation])

  const activeWorkspace = workspaces.find((workspace) => workspace.workspace_id === WORKSPACE_ID)
  const activeLibrary = navigation?.libraries.find((library) => library.id === activeLibraryId) ?? null
  const activeNavDocument =
    activeLibrary && activeDocumentId ? findNavDocument(activeLibrary, activeDocumentId) : undefined
  const activeGroupId = activeDocumentId ? navigation?.document_index[activeDocumentId]?.group_id : undefined
  const demoMode = demoModeFromSearch()
  const filteredGroups = React.useMemo(
    () => filterGroups(activeLibrary?.groups ?? [], query),
    [activeLibrary, query],
  )
  const filteredCount = filteredGroups.reduce((total, group) => total + group.documents.length, 0)

  function navigateToDocument(documentId: string) {
    setActiveDocumentId(documentId)
    pushRoute(documentId)
  }

  function switchLibrary(library: NavigationLibrary) {
    setActiveLibraryId(library.id)
    const currentInLibrary = activeDocumentId ? navigation?.document_index[activeDocumentId]?.library_id === library.id : false
    if (!currentInLibrary && library.default_document_id) {
      navigateToDocument(library.default_document_id)
    }
  }

  function toggleGroup(groupId: string) {
    setExpandedGroups((current) => ({ ...current, [groupId]: !(current[groupId] ?? false) }))
  }

  if (appState === 'loading') {
    return <ServiceRequiredScreen state="loading" onRetry={loadWorkspace} />
  }

  if (appState === 'error' || !navigation || !activeLibrary) {
    return <ServiceRequiredScreen state="error" message={loadError} onRetry={loadWorkspace} />
  }

  return (
    <main className="app-shell">
      <header className="global-header">
        <DovaxisLogo />
        <strong>Emergency Preparedness Program</strong>
        <div className="global-actions" aria-label="Global utilities">
          <button type="button" title="Bookmarks">
            <Bookmark size={16} />
            <span>Bookmarks</span>
          </button>
          <button type="button" title="History">
            <History size={16} />
            <span>History</span>
          </button>
          <button type="button" title="Settings">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </header>

      <aside className="nav-pane" aria-label="Workspace navigation">
        <div className="nav-context">
          <span>{navigation.document_count} docs</span>
          <small>{formatLabel(activeWorkspace?.history?.mode ?? serviceStatus?.history_model ?? 'git_plus_ledger')}</small>
        </div>

        <div className="workspace-facts" aria-label="Workspace facts">
          <span>
            <BookOpen size={14} />
            {navigation.document_count} documents
          </span>
          <span>
            <GitBranch size={14} />
            {formatLabel(activeWorkspace?.history?.mode ?? serviceStatus?.history_model ?? 'git_plus_ledger')}
          </span>
        </div>

        <label className="search-box">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, tag, or group"
          />
        </label>

        <div className="library-tabs" role="tablist" aria-label="Library selector">
          {navigation.libraries.map((library) => (
            <button
              className={library.id === activeLibrary.id ? 'active' : ''}
              key={library.id}
              onClick={() => switchLibrary(library)}
              role="tab"
              type="button"
              aria-selected={library.id === activeLibrary.id}
            >
              <span>{library.label}</span>
              <strong>{library.count}</strong>
            </button>
          ))}
        </div>

        <div className="nav-count" aria-live="polite">
          <span>{filteredCount} shown</span>
          <span>{activeLibrary.count} in {activeLibrary.label}</span>
        </div>

        <nav className="nav-tree" aria-label={`${activeLibrary.label} documents`}>
          {filteredGroups.map((group) => {
            const expanded = Boolean(query.trim()) || expandedGroups[group.id] || group.id === activeGroupId
            return (
              <section className="nav-group" key={group.id}>
                <button className="group-toggle" type="button" onClick={() => toggleGroup(group.id)}>
                  {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span>{group.label}</span>
                  <strong>{group.documents.length}</strong>
                </button>
                {expanded && (
                  <div className="subgroup-list">
                    {documentsBySubgroup(group.documents).map(([subgroup, documents]) => (
                      <div className="subgroup-block" key={`${group.id}-${subgroup}`}>
                        <span>{subgroup}</span>
                        {documents.map((document) => (
                          <button
                            className={document.doc_id === activeDocumentId ? 'document-link active' : 'document-link'}
                            key={document.doc_id}
                            type="button"
                            onClick={() => navigateToDocument(document.doc_id)}
                          >
                            <FileText size={15} />
                            <span className="document-link-copy">
                              <strong>{document.title}</strong>
                              <small>
                                {document.requirement_count} req · {document.placeholder_count} blanks
                                {document.artifact_count ? ` · ${document.artifact_count} artifact` : ''}
                              </small>
                            </span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </nav>
      </aside>

      <section className="reader-pane" aria-label="Document reader">
        <header className="reader-topbar">
          <div className="route-lockup">
            <span>{activeLibrary.label}</span>
            <strong>{activeNavDocument?.group_label ?? 'Workspace'}</strong>
          </div>
          <div className="toolbar-actions">
            <button type="button" title="Draft recommendation">
              <Sparkles size={18} />
              <span>Recommend</span>
            </button>
            <button type="button" title="History">
              <History size={18} />
              <span>History</span>
            </button>
            <button type="button" title="Settings">
              <Settings size={18} />
            </button>
          </div>
        </header>

        <DocumentReader
          activeNavDocument={activeNavDocument}
          demoMode={demoMode}
          documentState={documentState}
          onRetry={() => activeDocumentId && navigateToDocument(activeDocumentId)}
        />
      </section>
    </main>
  )
}

function ServiceRequiredScreen({
  state,
  message,
  onRetry,
}: {
  state: 'loading' | 'error'
  message?: string | null
  onRetry: () => void
}) {
  return (
    <main className="service-screen">
      <section className="service-panel" aria-live="polite">
        <div className={state === 'error' ? 'service-mark error' : 'service-mark'}>
          {state === 'error' ? <AlertTriangle size={28} /> : <RefreshCcw size={28} />}
        </div>
        <span className="eyebrow">Archivist local service</span>
        <h1>{state === 'error' ? 'Service Required' : 'Connecting'}</h1>
        <p>{state === 'error' ? (message ?? 'Unable to reach the local service.') : 'Opening epp-full.'}</p>
        <button type="button" onClick={() => void onRetry()}>
          <RefreshCcw size={17} />
          Retry
        </button>
      </section>
    </main>
  )
}

function DocumentReader({
  activeNavDocument,
  demoMode,
  documentState,
  onRetry,
}: {
  activeNavDocument?: NavigationDocument
  demoMode: DemoMode
  documentState: DocumentLoadState
  onRetry: () => void
}) {
  const articleRef = React.useRef<HTMLElement | null>(null)
  const readyDocument = documentState.status === 'ready' ? documentState.document : null
  const editable = Boolean(readyDocument?.metadata.editable)
  const editSections = React.useMemo(() => readyDocument?.rendered.edit_sections ?? [], [readyDocument])
  const [draftState, setDraftState] = React.useState<ManualDraftState | null>(null)
  const [draftError, setDraftError] = React.useState<string | null>(null)
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null)
  const [editingSectionId, setEditingSectionId] = React.useState<string | null>(null)
  const [reviewOpen, setReviewOpen] = React.useState(false)
  const [reviewIndex, setReviewIndex] = React.useState(0)
  const [reviewVersion, setReviewVersion] = React.useState<ReviewVersion>('draft')

  const pendingDrafts = React.useMemo(
    () => draftState?.drafts.filter((draft) => draft.status === 'pending') ?? [],
    [draftState],
  )
  const selectedSection = selectedSectionId
    ? editSections.find((section) => section.section_id === selectedSectionId) ?? null
    : null
  const editingSection = editingSectionId
    ? editSections.find((section) => section.section_id === editingSectionId) ?? null
    : null
  const reviewDraft =
    pendingDrafts[reviewIndex] ??
    pendingDrafts[0] ??
    fallbackReviewDraft(preferredEditSection(editSections), readyDocument?.title)

  const persistDrafts = React.useCallback(
    async (drafts: ManualDraft[]) => {
      if (!readyDocument?.metadata.editable) return
      setDraftError(null)
      try {
        const response = await writeManualDraftState(WORKSPACE_ID, readyDocument.doc_id, {
          source_hash: readyDocument.metadata.source_hash,
          drafts,
          audit: draftState?.audit,
        })
        setDraftState(response.state)
        setReviewIndex((current) => Math.min(current, Math.max(response.state.drafts.length - 1, 0)))
      } catch (caught) {
        setDraftError(caught instanceof Error ? caught.message : 'Unable to save draft.')
      }
    },
    [draftState?.audit, readyDocument],
  )

  const saveCurrentDraft = React.useCallback(async () => {
    if (!editingSectionId || !readyDocument?.metadata.editable) return
    const section = editSections.find((candidate) => candidate.section_id === editingSectionId)
    const element = findEditSectionElement(articleRef.current, editingSectionId)
    if (!section || !element) {
      setEditingSectionId(null)
      return
    }
    const draftText = normalizeEditedText(element.innerText || element.textContent || '')
    const otherDrafts = pendingDrafts.filter(
      (draft) => !(draftSectionId(draft) === section.section_id && draft.source === 'manual_edit'),
    )
    const nextDrafts =
      draftText && draftText !== section.original_text
        ? [
            ...otherDrafts,
            buildManualDraft(section, draftText, 'manual_edit', validateSectionDraft(section, draftText)),
          ]
        : otherDrafts
    await persistDrafts(nextDrafts)
    setEditingSectionId(null)
  }, [editSections, editingSectionId, pendingDrafts, persistDrafts, readyDocument?.metadata.editable])

  const startEditing = React.useCallback(
    (sectionId?: string | null) => {
      if (!readyDocument?.metadata.editable) return
      const nextSectionId = sectionId ?? selectedSectionId ?? editSections[0]?.section_id
      if (!nextSectionId) return
      setSelectedSectionId(nextSectionId)
      setEditingSectionId(nextSectionId)
      setReviewOpen(false)
    },
    [editSections, readyDocument?.metadata.editable, selectedSectionId],
  )

  const undoCurrentEdit = React.useCallback(() => {
    if (!editingSectionId) return
    const section = editSections.find((candidate) => candidate.section_id === editingSectionId)
    const element = findEditSectionElement(articleRef.current, editingSectionId)
    if (section && element && !hasNestedEditSections(element)) {
      element.textContent = section.original_text
    }
  }, [editSections, editingSectionId])

  const insertHeading = React.useCallback(
    (level: 2 | 3 | 4) => {
      if (!editingSectionId) {
        startEditing()
        return
      }
      const element = findEditSectionElement(articleRef.current, editingSectionId)
      if (element) {
        insertHeadingAtSelection(element, level)
      }
    },
    [editingSectionId, startEditing],
  )

  const rejectDraft = React.useCallback(
    async (draftId: string) => {
      const nextDrafts = pendingDrafts.filter((draft) => draft.draft_id !== draftId)
      await persistDrafts(nextDrafts)
      if (nextDrafts.length === 0) {
        setReviewOpen(false)
      }
    },
    [pendingDrafts, persistDrafts],
  )

  const createProposalPreview = React.useCallback(async () => {
    const section =
      selectedSection?.block_types.includes('p') ? selectedSection : preferredEditSection(editSections) ?? selectedSection
    if (!section) return
    const nextDraft = buildManualDraft(section, proposalTextFor(section.original_text), 'model_proposal')
    const otherDrafts = pendingDrafts.filter((draft) => draft.draft_id !== nextDraft.draft_id)
    await persistDrafts([...otherDrafts, nextDraft])
    setReviewVersion('draft')
    setReviewOpen(true)
  }, [editSections, pendingDrafts, persistDrafts, selectedSection])

  React.useEffect(() => {
    setDraftState(null)
    setDraftError(null)
    setSelectedSectionId(null)
    setEditingSectionId(null)
    setReviewOpen(false)
    setReviewIndex(0)
    if (!readyDocument?.metadata.editable) return

    let cancelled = false
    readManualDraftState(WORKSPACE_ID, readyDocument.doc_id)
      .then((response) => {
        if (!cancelled) setDraftState(response.state)
      })
      .catch((caught) => {
        if (!cancelled) setDraftError(caught instanceof Error ? caught.message : 'Unable to load draft state.')
      })
    return () => {
      cancelled = true
    }
  }, [readyDocument?.doc_id, readyDocument?.metadata.editable])

  React.useEffect(() => {
    if (!readyDocument?.metadata.editable || !editSections.length || selectedSectionId) return
    if (demoMode === 'edit' || demoMode === 'agent' || demoMode === 'draft-review') {
      setSelectedSectionId((preferredEditSection(editSections) ?? editSections[0]).section_id)
    }
  }, [demoMode, editSections, readyDocument?.metadata.editable, selectedSectionId])

  React.useEffect(() => {
    const root = articleRef.current
    if (!root) return
    const bySection = new Map(pendingDrafts.map((draft) => [draftSectionId(draft), draft]))
    root.querySelectorAll<HTMLElement>('.editable-section[data-edit-section-id]').forEach((element) => {
      const sectionId = element.dataset.editSectionId
      if (!sectionId) return
      element.classList.toggle('manual-section-selected', sectionId === selectedSectionId)
      element.classList.toggle('manual-section-editing', sectionId === editingSectionId)
      element.classList.toggle('manual-section-has-draft', bySection.has(sectionId))
      const draft = bySection.get(sectionId)
      const canReplacePreview = !hasNestedEditSections(element)
      if (draft && sectionId !== editingSectionId && canReplacePreview) {
        element.textContent = draft.draft_text
        element.dataset.manualDraftPreview = 'true'
      } else if (!draft && element.dataset.manualDraftPreview === 'true' && canReplacePreview) {
        const section = editSections.find((candidate) => candidate.section_id === sectionId)
        if (section) element.textContent = section.original_text
        delete element.dataset.manualDraftPreview
      }
    })
  }, [editSections, editingSectionId, pendingDrafts, selectedSectionId, readyDocument?.doc_id])

  React.useEffect(() => {
    if (!editingSectionId) return
    const section = editSections.find((candidate) => candidate.section_id === editingSectionId)
    const element = findEditSectionElement(articleRef.current, editingSectionId)
    if (!section || !element) return
    const draft = pendingDrafts.find(
      (candidate) => draftSectionId(candidate) === editingSectionId && candidate.source === 'manual_edit',
    )
    if (draft && !hasNestedEditSections(element)) {
      element.textContent = draft.draft_text
    }
    element.setAttribute('contenteditable', 'true')
    element.classList.add('manual-section-editing')
    element.focus()
    selectElementContents(element)
    return () => {
      element.removeAttribute('contenteditable')
      element.classList.remove('manual-section-editing')
    }
  }, [editSections, editingSectionId, pendingDrafts])

  if (documentState.status === 'idle' || documentState.status === 'loading') {
    return (
      <section className="reader-empty">
        <Clock3 size={24} />
        <strong>Loading document</strong>
      </section>
    )
  }

  if (documentState.status === 'error') {
    return (
      <section className="reader-empty error">
        <AlertTriangle size={24} />
        <strong>Document unavailable</strong>
        <p>{documentState.error}</p>
        <button type="button" onClick={onRetry}>
          <RefreshCcw size={17} />
          Retry
        </button>
      </section>
    )
  }

  const browserDocument = documentState.document
  if (!browserDocument) {
    return null
  }

  function handlePaperClick(event: React.MouseEvent<HTMLElement>) {
    if (!editable) return
    const target = (event.target as HTMLElement).closest<HTMLElement>('.editable-section[data-edit-section-id]')
    const nextSectionId = target?.dataset.editSectionId
    if (!nextSectionId) return
    if (editingSectionId && editingSectionId !== nextSectionId) {
      void saveCurrentDraft()
    }
    setSelectedSectionId(nextSectionId)
    if (demoMode === 'edit') {
      startEditing(nextSectionId)
    }
  }

  function handlePaperBlur(event: React.FocusEvent<HTMLElement>) {
    const relatedTarget = event.relatedTarget
    if (
      editingSectionId &&
      (!relatedTarget || !(relatedTarget instanceof Node) || !event.currentTarget.contains(relatedTarget))
    ) {
      void saveCurrentDraft()
    }
  }

  function handlePaperKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && editingSectionId) {
      event.preventDefault()
      void saveCurrentDraft()
    }
  }

  return (
    <section
      className={`manual-reader demo-${demoMode}${reviewOpen ? ' review-open' : ''}`}
      data-demo-mode={demoMode}
      data-draft-count={pendingDrafts.length}
    >
      <header className="reader-header manual-document-hero">
        <div className="manual-hero-copy">
          <span className="eyebrow">{activeNavDocument?.subgroup ?? formatLabel(browserDocument.metadata.content_group)}</span>
          <h1>{browserDocument.title}</h1>
        </div>
        <DovaxisLogo compact />
        <div className="reader-utility-tray" aria-label="Document utilities">
          <button type="button" title="Copy document link" aria-label="Copy document link">
            <Link2 size={17} />
          </button>
          <button type="button" title="Document history" aria-label="Document history">
            <History size={17} />
          </button>
          <button type="button" title={editable ? 'Edit preview' : 'Static regulatory reference'} aria-label={editable ? 'Edit preview' : 'Static regulatory reference'}>
            {editable ? <PencilLine size={17} /> : <LockKeyhole size={17} />}
          </button>
          <button type="button" title="Document details" aria-label="Document details">
            <FileText size={17} />
          </button>
          <button type="button" title="Reader settings" aria-label="Reader settings">
            <Settings size={17} />
          </button>
        </div>
      </header>

      {browserDocument.metadata.missing_markdown && (
        <div className="reader-alert">
          <AlertTriangle size={17} />
          <span>Manifest entry present; Markdown file missing from this workspace snapshot.</span>
        </div>
      )}

      <div className="reader-stage">
        <ManualAgentAffordances
          mode={demoMode}
          editable={editable}
          title={browserDocument.title}
          selectedSection={selectedSection}
          editingSection={editingSection}
          draftCount={pendingDrafts.length}
          draftError={draftError}
          reviewDraft={reviewDraft}
          reviewOpen={reviewOpen || demoMode === 'draft-review'}
          reviewVersion={reviewVersion}
          onStartEdit={() => startEditing()}
          onUndo={undoCurrentEdit}
          onOpenReview={() => {
            setReviewVersion('draft')
            setReviewOpen(true)
          }}
          onCloseReview={() => setReviewOpen(false)}
          onRejectDraft={rejectDraft}
          onReviewVersionChange={setReviewVersion}
          onCreateProposal={createProposalPreview}
          onInsertHeading={insertHeading}
        />

        <ArtifactEntry artifacts={browserDocument.artifacts} />

        <div className="reader-grid">
          <article
            key={`${browserDocument.doc_id}-${draftState?.audit.updated_at ?? 'clean'}`}
            ref={articleRef}
            className={demoMode === 'edit' || editingSectionId ? 'document-paper manual-edit-preview' : 'document-paper'}
            dangerouslySetInnerHTML={{ __html: browserDocument.rendered.html }}
            aria-label={browserDocument.title}
            onBlur={handlePaperBlur}
            onClick={handlePaperClick}
            onKeyDown={handlePaperKeyDown}
          />
          <aside className="anchor-rail" aria-label="Document context">
            <span>On this page</span>
            {browserDocument.rendered.anchors.slice(0, 10).map((anchor) => (
              <button key={anchor.id} type="button" onClick={() => scrollToAnchor(anchor.id)}>
                {anchor.label}
              </button>
            ))}
            <div className="context-stack">
              <OrientationPanel title="Sources" count={browserDocument.source_orientation.length}>
                {browserDocument.source_orientation.slice(0, 4).map((source) => (
                  <span key={source.source_id}>{source.label}</span>
                ))}
              </OrientationPanel>
              <OrientationPanel title="Compliance" count={browserDocument.compliance_orientation.length}>
                {browserDocument.compliance_orientation.slice(0, 4).map((reference) => (
                  <span key={reference.requirement_id}>
                    {reference.citation ?? reference.requirement_id}
                    {reference.e_tags?.length ? ` · ${reference.e_tags.join(', ')}` : ''}
                  </span>
                ))}
              </OrientationPanel>
              <div className={editable ? 'static-lockout editable' : 'static-lockout'}>
                {editable ? <PencilLine size={14} /> : <LockKeyhole size={14} />}
                <span>{editable ? 'Editable manual document' : 'Static regulatory reference'}</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="status-strip reader-status-strip">
          <StatusPill icon={<BookOpen size={14} />} label={formatLabel(browserDocument.metadata.content_type)} />
          <StatusPill icon={<CheckCircle2 size={14} />} label={formatLabel(browserDocument.metadata.lifecycle_status)} />
          <StatusPill icon={<FileText size={14} />} label={`${browserDocument.metadata.placeholder_ids.length} blanks`} />
          <StatusPill icon={<ClipboardList size={14} />} label={`${browserDocument.artifacts.length} artifacts`} />
        </div>
      </div>

      <AssistantBubble active={demoMode === 'agent'} />
    </section>
  )
}

function DovaxisLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'dovaxis-logo compact' : 'dovaxis-logo'} aria-label="DOVAXIS">
      <span className="dovaxis-drop" aria-hidden="true" />
      <strong>DOVAXIS</strong>
    </div>
  )
}

function ManualAgentAffordances({
  mode,
  editable,
  title,
  selectedSection,
  editingSection,
  draftCount,
  draftError,
  reviewDraft,
  reviewOpen,
  reviewVersion,
  onStartEdit,
  onUndo,
  onOpenReview,
  onCloseReview,
  onRejectDraft,
  onReviewVersionChange,
  onCreateProposal,
  onInsertHeading,
}: {
  mode: DemoMode
  editable: boolean
  title: string
  selectedSection: EditSection | null
  editingSection: EditSection | null
  draftCount: number
  draftError: string | null
  reviewDraft: ManualDraft | null
  reviewOpen: boolean
  reviewVersion: ReviewVersion
  onStartEdit: () => void
  onUndo: () => void
  onOpenReview: () => void
  onCloseReview: () => void
  onRejectDraft: (draftId: string) => void | Promise<void>
  onReviewVersionChange: (version: ReviewVersion) => void
  onCreateProposal: () => void | Promise<void>
  onInsertHeading: (level: 2 | 3 | 4) => void
}) {
  if (!editable) {
    return (
      <section className="manual-agent-static" aria-label="Static regulatory lockout">
        <LockKeyhole size={15} />
        <span>Static regulatory reference</span>
      </section>
    )
  }

  return (
    <>
      {!reviewOpen && (
        <section className={mode === 'edit' ? 'manual-agent-dock editing' : 'manual-agent-dock'} aria-label="Review handle">
          <div className="manual-agent-dock-bar">
            <span className="manual-agent-dock-rest" aria-hidden="true" />
          </div>
          <div className="manual-agent-dock-lens" aria-hidden="true">
            <span />
          </div>
          {draftCount > 0 && (
            <button className="manual-draft-count" type="button" onClick={onOpenReview}>
              <span>{draftCount}</span>
              Drafts
            </button>
          )}
        </section>
      )}

      {mode === 'agent' && (
        <section className="manual-agent-panel" aria-label="Assistant">
          <header>
            <span className="assistant-grip" aria-hidden="true" />
            <div>
              <span>Local workspace</span>
              <h2>Assistant</h2>
            </div>
            <button type="button" title="Developer tools" aria-label="Developer tools">
              <Settings size={15} />
            </button>
          </header>
          <div className="assistant-status">
            <span />
            Local model ready
            <small>Preview</small>
          </div>
          <p>{title}</p>
          <label>
            Message
            <textarea defaultValue="Make this easier for facility staff to scan without changing the meaning." />
          </label>
          <div className="assistant-panel-footer">
            <span>manual_markdown</span>
            <button type="button" onClick={() => void onCreateProposal()}>
              <Sparkles size={15} />
              Preview
            </button>
          </div>
        </section>
      )}

      {(mode === 'edit' || selectedSection || editingSection) && !reviewOpen && (
        <section className="manual-edit-affordance" aria-label="Editable section preview">
          <div className="manual-edit-tools" aria-label="Inline edit toolbar" onMouseDown={(event) => event.preventDefault()}>
            <button type="button" title="Edit section" aria-label="Edit section" onClick={onStartEdit}>
              <PencilLine size={15} />
            </button>
            <button type="button" title="Undo" aria-label="Undo" disabled={!editingSection} onClick={onUndo}>
              <RefreshCcw size={15} />
            </button>
            <button type="button" title="Bold selected text" aria-label="Bold selected text">B</button>
            <button type="button" title="Italic selected text" aria-label="Italic selected text">I</button>
            <button type="button" title="Paragraph" aria-label="Paragraph">P</button>
            <button type="button" title="Heading 2" aria-label="Heading 2" onClick={() => onInsertHeading(2)}>H2</button>
            <button type="button" title="Heading 3" aria-label="Heading 3" onClick={() => onInsertHeading(3)}>H3</button>
            <button type="button" title="Heading 4" aria-label="Heading 4" onClick={() => onInsertHeading(4)}>H4</button>
            <button type="button" title="Bullet list" aria-label="Bullet list">*</button>
          </div>
          {selectedSection && (
            <div className="manual-selected-block">
              <span>H{selectedSection.level}</span>
              <strong>{truncateText(selectedSection.heading || selectedSection.original_text, 72)}</strong>
            </div>
          )}
          <div className="manual-edit-outline" />
          {draftError && <div className="manual-draft-error">{draftError}</div>}
        </section>
      )}

      {reviewOpen && reviewDraft && (
        <section className="manual-draft-lens" aria-label="Draft change" data-smoke-marker="Draft review probe">
          <div className="manual-draft-handle">
            <strong>{reviewDraft.source === 'model_proposal' ? 'Proposal' : 'Draft'}</strong>
            <button
              type="button"
              className={reviewVersion === 'draft' ? 'active' : ''}
              title="Draft version"
              aria-label="Draft version"
              onClick={() => onReviewVersionChange('draft')}
            >
              New
            </button>
            <button
              type="button"
              className={reviewVersion === 'original' ? 'active' : ''}
              title="Original version"
              aria-label="Original version"
              onClick={() => onReviewVersionChange('original')}
            >
              Old
            </button>
          </div>
          <div className="manual-draft-glass">
            <canvas aria-hidden="true" />
            <div>
              <span>
                H{reviewDraft.section_level || 2} · {formatLabel(reviewDraft.section_heading || reviewDraft.block_type)} ·{' '}
                {formatLabel(reviewDraft.source)}
              </span>
              <h2>{reviewVersion === 'draft' ? 'Draft version' : 'Original version'}</h2>
              <p>{reviewVersion === 'draft' ? reviewDraft.draft_text : reviewDraft.original_text}</p>
              <div className="manual-review-actions">
                <button type="button" disabled title="Apply requires review/apply workflow">
                  Apply locked
                </button>
                {reviewDraft.draft_id !== 'demo-draft' && (
                  <button type="button" onClick={() => void onRejectDraft(reviewDraft.draft_id)}>
                    Reject
                  </button>
                )}
                <button type="button" onClick={onCloseReview}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function AssistantBubble({ active }: { active: boolean }) {
  return (
    <button className={active ? 'assistant-bubble active' : 'assistant-bubble'} type="button" title="Manual agent" aria-label="Manual agent">
      <Sparkles size={22} />
      <span aria-hidden="true" />
    </button>
  )
}

function ArtifactEntry({ artifacts }: { artifacts: ArtifactSummary[] }) {
  const [open, setOpen] = React.useState(false)
  if (!artifacts.length) return null
  const primary = artifacts[0]
  const intro = primary.context?.intro
  const outputs = intro?.outputs ?? []
  const steps = primary.context?.workflow_steps ?? []
  const categories = primary.context?.hazard_categories ?? []
  const isWorkbook = `${primary.artifact_type} ${primary.renderer_template}`.includes('workbook')

  return (
    <section className="artifact-entry" aria-label="Artifact entry point">
      <div className="artifact-icon" aria-hidden="true">
        <ClipboardList size={24} />
      </div>
      <div className="artifact-copy">
        <span className="eyebrow">{formatLabel(primary.renderer_template)}</span>
        <h2>{primary.title}</h2>
        {intro?.purpose && <p>{intro.purpose}</p>}
        <div className="artifact-outputs">
          {outputs.map((output) => (
            <span key={output}>{output}</span>
          ))}
        </div>
      </div>
      <div className="artifact-actions">
        <button type="button" disabled={!isWorkbook} onClick={() => setOpen((current) => !current)}>
          <ClipboardList size={17} />
          {open ? 'Close Workbook' : 'Open Workbook'}
        </button>
        <small>{steps.length} steps</small>
      </div>
      {open && (
        <div className="workbook-preview">
          <section>
            <strong>Workflow</strong>
            {steps.map((step) => (
              <span key={step.id ?? step.label}>{step.label}</span>
            ))}
          </section>
          <section>
            <strong>Hazard Groups</strong>
            {categories.map((category) => (
              <span key={category.id ?? category.label}>{category.label}</span>
            ))}
          </section>
        </div>
      )}
    </section>
  )
}

function OrientationPanel({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="orientation-panel">
      <strong>
        {title}
        <span>{count}</span>
      </strong>
      <div>{children}</div>
    </section>
  )
}

function StatusPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="status-pill">
      {icon}
      {label}
    </span>
  )
}

function buildManualDraft(
  section: EditSection,
  draftText: string,
  source: ManualDraftSource,
  validationMessages: string[] = [],
): ManualDraft {
  return {
    draft_id: `${source}-${section.section_id}`,
    section_id: section.section_id,
    section_level: section.level,
    section_heading: section.heading,
    block_id: section.section_id,
    block_type: `h${section.level}`,
    original_text: section.original_text,
    draft_text: draftText,
    validation_messages: validationMessages,
    source,
    status: 'pending',
  }
}

function preferredEditSection(sections: EditSection[]): EditSection | undefined {
  return sections.find((section) => section.block_types.includes('p')) ?? sections[0]
}

function fallbackReviewDraft(section?: EditSection, title = 'Document'): ManualDraft | null {
  if (!section) {
    return null
  }
  return {
    draft_id: 'demo-draft',
    section_id: section.section_id,
    section_level: section.level,
    section_heading: section.heading,
    block_id: section.section_id,
    block_type: `h${section.level}`,
    original_text: section.original_text,
    draft_text: proposalTextFor(section.original_text || title),
    validation_messages: section.validation_messages ?? [],
    source: 'model_proposal',
    status: 'pending',
  }
}

function proposalTextFor(text: string): string {
  const normalized = normalizeEditedText(text)
  if (!normalized) {
    return 'Draft language pending source text review.'
  }
  if (normalized.length < 180) {
    return `${normalized} Facility staff should verify this wording before approval.`
  }
  return `${normalized.slice(0, 180).trim()}... Facility staff should verify this wording before approval.`
}

function normalizeEditedText(value: string): string {
  return value.replace(/\u00a0/g, ' ').replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

function validateSectionDraft(section: EditSection, draftText: string): string[] {
  const messages = [...(section.validation_messages ?? [])]
  if (!draftText.trim()) {
    messages.push('Section cannot be empty.')
  }
  if (![2, 3, 4].includes(section.level)) {
    messages.push('Section heading level must be H2, H3, or H4.')
  }
  return Array.from(new Set(messages))
}

function draftSectionId(draft: ManualDraft): string {
  return draft.section_id || draft.block_id
}

function findEditSectionElement(root: HTMLElement | null, sectionId: string): HTMLElement | null {
  if (!root) return null
  return root.querySelector<HTMLElement>(`.editable-section[data-edit-section-id="${cssEscape(sectionId)}"]`)
}

function hasNestedEditSections(element: HTMLElement): boolean {
  return Boolean(element.querySelector('.editable-section[data-edit-section-id]'))
}

function insertHeadingAtSelection(container: HTMLElement, level: 2 | 3 | 4) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || !container.contains(selection.anchorNode)) {
    container.focus()
    return
  }
  const range = selection.getRangeAt(0)
  const heading = document.createElement(`h${level}`)
  heading.textContent = `New H${level} Section`
  range.deleteContents()
  range.insertNode(heading)
  const spacer = document.createTextNode('\n')
  heading.after(spacer)
  const nextRange = document.createRange()
  nextRange.selectNodeContents(heading)
  selection.removeAllRanges()
  selection.addRange(nextRange)
}

function cssEscape(value: string): string {
  if ('CSS' in window && typeof window.CSS.escape === 'function') {
    return window.CSS.escape(value)
  }
  return value.replace(/["\\]/g, '\\$&')
}

function selectElementContents(element: HTMLElement) {
  const range = window.document.createRange()
  range.selectNodeContents(element)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 3).trim()}...`
}

function filterGroups(groups: NavigationGroup[], query: string): NavigationGroup[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return groups
  return groups
    .map((group) => ({
      ...group,
      documents: group.documents.filter((document) => documentMatches(document, group, normalizedQuery)),
    }))
    .filter((group) => group.documents.length > 0)
}

function documentMatches(document: NavigationDocument, group: NavigationGroup, normalizedQuery: string): boolean {
  const haystack = [
    document.title,
    document.doc_id,
    document.content_group,
    document.content_type,
    document.subgroup,
    group.label,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(normalizedQuery)
}

function documentsBySubgroup(documents: NavigationDocument[]): Array<[string, NavigationDocument[]]> {
  const buckets = new Map<string, NavigationDocument[]>()
  documents.forEach((document) => {
    const subgroup = document.subgroup || 'Documents'
    buckets.set(subgroup, [...(buckets.get(subgroup) ?? []), document])
  })
  return Array.from(buckets.entries())
}

function findNavDocument(library: NavigationLibrary, documentId: string): NavigationDocument | undefined {
  for (const group of library.groups) {
    const match = group.documents.find((document) => document.doc_id === documentId)
    if (match) return match
  }
  return undefined
}

function documentIdFromHash(): string | null {
  const match = window.location.hash.match(/^#\/workspaces\/([^/]+)\/documents\/([^/]+)$/)
  if (!match || decodeURIComponent(match[1]) !== WORKSPACE_ID) return null
  return decodeURIComponent(match[2])
}

function pushRoute(documentId: string) {
  const nextHash = routeHash(documentId)
  if (window.location.hash !== nextHash) {
    window.history.pushState(null, '', nextHash)
  }
}

function replaceRoute(documentId: string) {
  window.history.replaceState(null, '', routeHash(documentId))
}

function demoModeFromSearch(): DemoMode {
  const value = new URLSearchParams(window.location.search).get('archivist-demo')
  if (value === 'agent' || value === 'edit' || value === 'draft-review') return value
  return 'reader'
}

function routeHash(documentId: string): string {
  return `#/workspaces/${WORKSPACE_ID}/documents/${encodeURIComponent(documentId)}`
}

function formatLabel(value: string): string {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

function scrollToAnchor(anchorId: string) {
  document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
