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
type SmokeScenario = 'edit-switch' | 'hover-handle' | null
type PendingCaretPoint = { sectionId: string; x: number; y: number }
type EditHandlePlacement = { sectionId: string; top: number; left: number }
type MagneticEditSection = { sectionId: string; element: HTMLElement; exact: boolean }
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
  const readerStageRef = React.useRef<HTMLDivElement | null>(null)
  const articleRef = React.useRef<HTMLElement | null>(null)
  const articleHtmlRef = React.useRef<{ docId: string; html: string; version: number } | null>(null)
  const draftTransitionRef = React.useRef(false)
  const editingSectionIdRef = React.useRef<string | null>(null)
  const lastSavedDraftsRef = React.useRef<ManualDraft[]>([])
  const pendingCaretPointRef = React.useRef<PendingCaretPoint | null>(null)
  const editHandlePlacementRef = React.useRef<EditHandlePlacement | null>(null)
  const smokeEditSwitchRanRef = React.useRef(false)
  const smokeHoverHandleRanRef = React.useRef(false)
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
  const [readerRenderVersion, setReaderRenderVersion] = React.useState(0)
  const [draftTransitioning, setDraftTransitioning] = React.useState(false)
  const [editHandlePlacement, setEditHandlePlacement] = React.useState<EditHandlePlacement | null>(null)
  const [smokeEditSwitchStatus, setSmokeEditSwitchStatus] = React.useState<string | null>(null)
  const [smokeHoverHandleStatus, setSmokeHoverHandleStatus] = React.useState<string | null>(null)
  const smokeScenario = smokeScenarioFromSearch()

  const pendingDrafts = React.useMemo(
    () => draftState?.drafts.filter((draft) => draft.status === 'pending') ?? [],
    [draftState],
  )
  const draftStateReady = draftState !== null
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

  React.useLayoutEffect(() => {
    const root = articleRef.current
    if (!root || !readyDocument) return
    const previous = articleHtmlRef.current
    if (
      previous?.docId === readyDocument.doc_id &&
      previous?.html === readyDocument.rendered.html &&
      previous?.version === readerRenderVersion
    ) {
      return
    }
    root.innerHTML = readyDocument.rendered.html
    articleHtmlRef.current = {
      docId: readyDocument.doc_id,
      html: readyDocument.rendered.html,
      version: readerRenderVersion,
    }
  }, [readerRenderVersion, readyDocument])

  const persistDrafts = React.useCallback(
    async (drafts: ManualDraft[]) => {
      if (!readyDocument?.metadata.editable) return false
      setDraftError(null)
      try {
        const response = await writeManualDraftState(WORKSPACE_ID, readyDocument.doc_id, {
          source_hash: readyDocument.metadata.source_hash,
          drafts,
          audit: draftState?.audit,
        })
        setDraftState(response.state)
        setReviewIndex((current) => Math.min(current, Math.max(response.state.drafts.length - 1, 0)))
        return true
      } catch (caught) {
        setDraftError(caught instanceof Error ? caught.message : 'Unable to save draft.')
        return false
      }
    },
    [draftState?.audit, readyDocument],
  )

  const runDraftTransition = React.useCallback(async (action: () => Promise<void>) => {
    if (draftTransitionRef.current) return false
    draftTransitionRef.current = true
    setDraftTransitioning(true)
    try {
      await action()
      return true
    } finally {
      draftTransitionRef.current = false
      setDraftTransitioning(false)
    }
  }, [])

  const syncEditableDomForSection = React.useCallback(
    (sectionId: string | null) => {
      const root = articleRef.current
      if (!root) return false
      root.querySelectorAll<HTMLElement>('.editable-section[contenteditable="true"]').forEach((element) => {
        if (element.dataset.editSectionId !== sectionId) {
          element.removeAttribute('contenteditable')
          element.classList.remove('manual-section-editing')
        }
      })
      if (!sectionId) return true
      const section = editSections.find((candidate) => candidate.section_id === sectionId)
      const element = findEditSectionElement(root, sectionId)
      if (!section || !element) {
        return false
      }
      const alreadyEditable = element.getAttribute('contenteditable') === 'true'
      const caretPoint = pendingCaretPointRef.current?.sectionId === sectionId ? pendingCaretPointRef.current : null
      pendingCaretPointRef.current = null
      element.setAttribute('contenteditable', 'true')
      element.classList.add('manual-section-editing')
      if (!alreadyEditable || document.activeElement !== element) {
        focusEditableSection(element, caretPoint)
      }
      return true
    },
    [editSections],
  )

  const saveCurrentDraft = React.useCallback(async (sectionId = editingSectionId) => {
    if (!sectionId || !readyDocument?.metadata.editable) return false
    const section = editSections.find((candidate) => candidate.section_id === sectionId)
    const element = findEditSectionElement(articleRef.current, sectionId)
    if (!section || !element) {
      setEditingSectionId((current) => (current === sectionId ? null : current))
      return false
    }
    const draftText = serializeEditedSection(element)
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
    setEditingSectionId((current) => (current === section.section_id ? null : current))
    const saved = await persistDrafts(nextDrafts)
    if (saved) {
      lastSavedDraftsRef.current = nextDrafts
    }
    return saved
  }, [editSections, editingSectionId, pendingDrafts, persistDrafts, readyDocument?.metadata.editable])

  const activateSection = React.useCallback(
    async (sectionId: string | null | undefined, options: { edit?: boolean } = {}) => {
      if (!readyDocument?.metadata.editable || !sectionId) return false
      return runDraftTransition(async () => {
        const currentEditingSectionId = editingSectionIdRef.current
        if (currentEditingSectionId && currentEditingSectionId !== sectionId) {
          await saveCurrentDraft(currentEditingSectionId)
        }
        setSelectedSectionId(sectionId)
        if (options.edit) {
          setReviewOpen(false)
          setEditingSectionId(sectionId)
          window.requestAnimationFrame(() => syncEditableDomForSection(sectionId))
        }
      })
    },
    [readyDocument?.metadata.editable, runDraftTransition, saveCurrentDraft, syncEditableDomForSection],
  )

  const placeEditHandle = React.useCallback((sectionId: string) => {
    const placement = measureEditHandlePlacement(readerStageRef.current, articleRef.current, sectionId)
    if (!placement) return false
    setEditHandlePlacement((current) =>
      current &&
      current.sectionId === placement.sectionId &&
      Math.abs(current.top - placement.top) < 2 &&
      Math.abs(current.left - placement.left) < 2
        ? current
        : placement,
    )
    return true
  }, [])

  const startEditing = React.useCallback(
    (sectionId?: string | null) => {
      pendingCaretPointRef.current = null
      const nextSectionId = sectionId ?? selectedSectionId ?? editSections[0]?.section_id
      void activateSection(nextSectionId, { edit: true })
    },
    [activateSection, editSections, selectedSectionId],
  )

  const flushCurrentDraft = React.useCallback(
    () => {
      void runDraftTransition(async () => {
        await saveCurrentDraft()
      })
    },
    [runDraftTransition, saveCurrentDraft],
  )

  const undoCurrentEdit = React.useCallback(() => {
    if (!editingSectionId) return
    setEditingSectionId(null)
    setReaderRenderVersion((version) => version + 1)
  }, [editingSectionId])

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
    setReaderRenderVersion(0)
    setEditHandlePlacement(null)
    setSmokeEditSwitchStatus(null)
    setSmokeHoverHandleStatus(null)
    smokeEditSwitchRanRef.current = false
    smokeHoverHandleRanRef.current = false
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
      delete element.dataset.manualDraftPreview
    })
  }, [editingSectionId, pendingDrafts, selectedSectionId, readyDocument?.doc_id])

  React.useEffect(() => {
    editingSectionIdRef.current = editingSectionId
  }, [editingSectionId])

  React.useEffect(() => {
    editHandlePlacementRef.current = editHandlePlacement
  }, [editHandlePlacement])

  React.useEffect(() => {
    const targetSectionId = editingSectionId ?? editHandlePlacement?.sectionId ?? selectedSectionId
    if (!targetSectionId || !readyDocument?.metadata.editable) return
    placeEditHandle(targetSectionId)
  }, [
    editingSectionId,
    editHandlePlacement?.sectionId,
    draftState?.audit.updated_at,
    placeEditHandle,
    readerRenderVersion,
    readyDocument?.metadata.editable,
    selectedSectionId,
  ])

  React.useLayoutEffect(() => {
    syncEditableDomForSection(editingSectionId)
  }, [draftState?.audit.updated_at, editingSectionId, readerRenderVersion, syncEditableDomForSection])

  React.useEffect(() => {
    if (
      smokeScenario !== 'edit-switch' ||
      smokeEditSwitchRanRef.current ||
      !readyDocument?.metadata.editable ||
      !draftStateReady ||
      editSections.length < 2
    ) {
      return
    }
    const firstSection = editSections.find((section) => section.block_types.includes('p')) ?? editSections[0]
    const secondSection =
      editSections.find((section) => section.section_id !== firstSection.section_id && section.block_types.includes('p')) ??
      editSections.find((section) => section.section_id !== firstSection.section_id)
    if (!secondSection) return

    const targetSection = secondSection
    smokeEditSwitchRanRef.current = true
    const smokeMarker = 'Browser smoke switched section autosave'

    async function runSmokeProbe() {
      setSmokeEditSwitchStatus('single-active-editor running')
      try {
        await activateSection(firstSection.section_id, { edit: true })
        const firstElement = await waitForEditableSection(() => articleRef.current, firstSection.section_id)
        if (!firstElement) throw new Error('first section did not become editable')
        const firstSelectionCollapsed = window.getSelection()?.isCollapsed !== false
        appendSmokeText(firstElement, smokeMarker)
        await activateSection(targetSection.section_id, { edit: true })
        const secondElement = await waitForEditableSection(() => articleRef.current, targetSection.section_id)
        if (!secondElement) throw new Error('second section did not become editable')
        const secondSelectionCollapsed = window.getSelection()?.isCollapsed !== false
        const activeElements = Array.from(
          articleRef.current?.querySelectorAll<HTMLElement>('.editable-section[contenteditable="true"]') ?? [],
        )
        const firstDraftSaved = lastSavedDraftsRef.current.some(
          (draft) =>
            draft.status === 'pending' &&
            draft.source === 'manual_edit' &&
            draftSectionId(draft) === firstSection.section_id &&
            draft.draft_text.includes(smokeMarker),
        )
        const onlySecondEditable =
          activeElements.length === 1 && activeElements[0]?.dataset.editSectionId === targetSection.section_id
        const clickReadyCaret = firstSelectionCollapsed && secondSelectionCollapsed
        if (!firstDraftSaved || !onlySecondEditable || !clickReadyCaret) {
          throw new Error(
            `draft_saved=${String(firstDraftSaved)} caret_collapsed=${String(clickReadyCaret)} active_sections=${activeElements
              .map((element) => element.dataset.editSectionId)
              .join(',')}`,
          )
        }
        setSmokeEditSwitchStatus(`single-active-editor passed editable-caret collapsed ${smokeMarker}`)
      } catch (caught) {
        setSmokeEditSwitchStatus(
          `single-active-editor failed ${caught instanceof Error ? caught.message : 'unknown error'}`,
        )
      }
    }

    void runSmokeProbe()
  }, [activateSection, draftStateReady, editSections, readyDocument, smokeScenario])

  React.useEffect(() => {
    if (
      smokeScenario !== 'hover-handle' ||
      smokeHoverHandleRanRef.current ||
      !readyDocument?.metadata.editable ||
      !draftStateReady ||
      editSections.length < 2
    ) {
      return
    }
    const firstSection = editSections.find((section) => section.block_types.includes('p')) ?? editSections[0]
    const secondSection =
      editSections.find((section) => section.section_id !== firstSection.section_id && section.block_types.includes('p')) ??
      editSections.find((section) => section.section_id !== firstSection.section_id)
    if (!secondSection) return

    const targetSection = secondSection
    smokeHoverHandleRanRef.current = true

    async function runHoverProbe() {
      setSmokeHoverHandleStatus('hover-handle running')
      try {
        setSelectedSectionId(firstSection.section_id)
        if (!placeEditHandle(firstSection.section_id)) throw new Error('first handle placement failed')
        await waitForUiTick()
        const firstHandle = findEditHandleElement(readerStageRef.current)
        if (
          !firstHandle ||
          firstHandle.dataset.hoverEditSectionId !== firstSection.section_id ||
          firstHandle.dataset.editHandleMode !== 'compact'
        ) {
          throw new Error('first compact handle was not anchored')
        }
        const firstTop = firstHandle.style.top
        const firstLeft = firstHandle.style.left

        const secondElement = findEditSectionElement(articleRef.current, targetSection.section_id)
        if (!secondElement) throw new Error('second section missing')
        const secondRect = secondElement.getBoundingClientRect()
        setSelectedSectionId(targetSection.section_id)
        if (!placeEditHandle(targetSection.section_id)) {
          throw new Error('second handle placement failed')
        }
        await waitForUiTick()
        const secondHandle = findEditHandleElement(readerStageRef.current)
        if (!secondHandle) throw new Error('second handle missing')
        const handleMoved = secondHandle.style.top !== firstTop || secondHandle.style.left !== firstLeft
        if (
          secondHandle.dataset.hoverEditSectionId !== targetSection.section_id ||
          secondHandle.dataset.editHandleMode !== 'compact' ||
          !handleMoved
        ) {
          throw new Error('second compact handle was not magnetic')
        }
        const sectionMiddleY = secondRect.top + Math.min(46, secondRect.height / 2)
        dispatchPointerMove(readerStageRef.current, secondRect.left + 24, sectionMiddleY)
        await waitForUiTick()
        const insideHandle = findEditHandleElement(readerStageRef.current)
        if (!insideHandle) throw new Error('inside-section handle missing')
        const anchoredTop = insideHandle.style.top
        const anchoredLeft = insideHandle.style.left
        if (anchoredTop !== secondHandle.style.top || anchoredLeft !== secondHandle.style.left) {
          throw new Error('handle moved while hovering inside section')
        }
        dispatchPointerMove(readerStageRef.current, secondRect.left - 72, sectionMiddleY + 16)
        await waitForUiTick()
        const approachableHandle = findEditHandleElement(readerStageRef.current)
        if (
          !approachableHandle ||
          approachableHandle.dataset.hoverEditSectionId !== targetSection.section_id ||
          approachableHandle.style.top !== anchoredTop ||
          approachableHandle.style.left !== anchoredLeft
        ) {
          throw new Error('handle moved away during gutter approach')
        }
        await activateSection(targetSection.section_id, { edit: true })
        await waitForEditableSection(() => articleRef.current, targetSection.section_id)
        await waitForUiTick()
        const expandedHandle = findEditHandleElement(readerStageRef.current)
        if (
          !expandedHandle ||
          expandedHandle.dataset.hoverEditSectionId !== targetSection.section_id ||
          expandedHandle.dataset.editHandleMode !== 'expanded'
        ) {
          throw new Error('active handle did not expand')
        }
        setSmokeHoverHandleStatus('hover-handle passed fixed-edit-handle stable compact expanded')
      } catch (caught) {
        setSmokeHoverHandleStatus(
          `hover-handle failed ${caught instanceof Error ? caught.message : 'unknown error'}`,
        )
      }
    }

    void runHoverProbe()
  }, [activateSection, draftStateReady, editSections, placeEditHandle, readyDocument, smokeScenario])

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
    if (demoMode === 'edit') {
      pendingCaretPointRef.current = {
        sectionId: nextSectionId,
        x: event.clientX,
        y: event.clientY,
      }
    }
    void activateSection(nextSectionId, { edit: demoMode === 'edit' })
  }

  function handleReaderStagePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!editable || reviewOpen || draftTransitioning) return
    const handle = findEditHandleElement(readerStageRef.current)
    const pointerInHandle = handle ? pointInElement(handle, event.clientX, event.clientY) : false
    if (editingSectionId) {
      if (editHandlePlacementRef.current?.sectionId !== editingSectionId) {
        placeEditHandle(editingSectionId)
      }
      return
    }
    const match = findMagneticEditSection(articleRef.current, event.clientX, event.clientY)
    if (!match) {
      if (!pointerInHandle) setEditHandlePlacement(null)
      return
    }
    setSelectedSectionId((current) => (current === match.sectionId ? current : match.sectionId))
    if (editHandlePlacementRef.current?.sectionId !== match.sectionId) {
      placeEditHandle(match.sectionId)
    }
  }

  function handleReaderStagePointerLeave() {
    if (editingSectionId) {
      placeEditHandle(editingSectionId)
      return
    }
    setEditHandlePlacement(null)
  }

  function handlePaperBlur(event: React.FocusEvent<HTMLElement>) {
    const relatedTarget = event.relatedTarget
    if (!editingSectionId) return
    if (relatedTarget instanceof Node && event.currentTarget.contains(relatedTarget)) return
    const root = event.currentTarget
    window.setTimeout(() => {
      const activeElement = document.activeElement
      if (activeElement instanceof Node && root.contains(activeElement)) return
      flushCurrentDraft()
    }, 0)
  }

  function handlePaperKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && editingSectionId) {
      event.preventDefault()
      flushCurrentDraft()
    }
  }

  return (
    <section
      className={`manual-reader demo-${demoMode}${reviewOpen ? ' review-open' : ''}`}
      data-demo-mode={demoMode}
      data-draft-count={pendingDrafts.length}
      data-editor-transition-state={draftTransitioning ? 'saving' : 'idle'}
      data-active-edit-section-id={editingSectionId ?? ''}
      aria-busy={draftTransitioning}
    >
      {smokeEditSwitchStatus && (
        <div hidden data-smoke-marker="Single active editor smoke" data-smoke-result={smokeEditSwitchStatus}>
          {smokeEditSwitchStatus}
        </div>
      )}
      {smokeHoverHandleStatus && (
        <div hidden data-smoke-marker="Magnetic edit handle smoke" data-smoke-result={smokeHoverHandleStatus}>
          {smokeHoverHandleStatus}
        </div>
      )}
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

      <div
        className="reader-stage"
        ref={readerStageRef}
        onPointerLeave={handleReaderStagePointerLeave}
        onPointerMove={handleReaderStagePointerMove}
      >
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
          draftTransitioning={draftTransitioning}
          editHandlePlacement={editHandlePlacement}
          onStartEdit={() => startEditing(editHandlePlacement?.sectionId ?? selectedSectionId)}
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
            key={`${browserDocument.doc_id}-${readerRenderVersion}`}
            ref={articleRef}
            className={demoMode === 'edit' || editingSectionId ? 'document-paper manual-edit-preview' : 'document-paper'}
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
  draftTransitioning,
  editHandlePlacement,
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
  draftTransitioning: boolean
  editHandlePlacement: EditHandlePlacement | null
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

  const controlsVisible = Boolean(editingSection)
  const showEditHandle = Boolean(mode === 'edit' || selectedSection || editingSection || editHandlePlacement)
  const editHandleStyle = editHandlePlacement
    ? ({ top: `${editHandlePlacement.top}px`, left: `${editHandlePlacement.left}px` } as React.CSSProperties)
    : undefined

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

      {showEditHandle && !reviewOpen && (
        <section
          className="manual-edit-affordance"
          aria-label="Editable section preview"
          data-hover-edit-section-id={editHandlePlacement?.sectionId ?? ''}
          data-edit-handle-mode={controlsVisible ? 'expanded' : 'compact'}
          data-edit-handle-left={editHandlePlacement ? Math.round(editHandlePlacement.left) : ''}
          data-edit-handle-top={editHandlePlacement ? Math.round(editHandlePlacement.top) : ''}
          style={editHandleStyle}
        >
          <div
            className={controlsVisible ? 'manual-edit-tools expanded' : 'manual-edit-tools compact'}
            aria-label={controlsVisible ? 'Inline edit toolbar' : 'Edit section handle'}
            onMouseDown={(event) => event.preventDefault()}
          >
            <button
              type="button"
              title="Edit section"
              aria-label="Edit section"
              disabled={draftTransitioning}
              onClick={onStartEdit}
            >
              <PencilLine size={15} />
            </button>
            {controlsVisible && (
              <>
                <button type="button" title="Undo" aria-label="Undo" disabled={draftTransitioning} onClick={onUndo}>
                  <RefreshCcw size={15} />
                </button>
                <button type="button" title="Bold selected text" aria-label="Bold selected text">B</button>
                <button type="button" title="Italic selected text" aria-label="Italic selected text">I</button>
                <button type="button" title="Paragraph" aria-label="Paragraph">P</button>
                <button type="button" title="Heading 2" aria-label="Heading 2" disabled={draftTransitioning} onClick={() => onInsertHeading(2)}>H2</button>
                <button type="button" title="Heading 3" aria-label="Heading 3" disabled={draftTransitioning} onClick={() => onInsertHeading(3)}>H3</button>
                <button type="button" title="Heading 4" aria-label="Heading 4" disabled={draftTransitioning} onClick={() => onInsertHeading(4)}>H4</button>
                <button type="button" title="Bullet list" aria-label="Bullet list">*</button>
              </>
            )}
          </div>
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
  const headingLevels = Array.from(draftText.matchAll(/^(#{2,4})\s+.+$/gm)).map((match) => match[1].length)
  if (headingLevels.length === 0) {
    messages.push('Section draft should keep a visible H2, H3, or H4 heading.')
  } else if (headingLevels[0] !== section.level) {
    messages.push(`Section draft should start with the selected H${section.level} heading.`)
  }
  const stack: number[] = []
  headingLevels.forEach((level) => {
    while (stack.length && stack[stack.length - 1] >= level) {
      stack.pop()
    }
    const parentLevel = stack[stack.length - 1]
    if (level > 2 && parentLevel !== level - 1) {
      messages.push(`H${level} section must sit under an H${level - 1} heading.`)
    }
    stack.push(level)
  })
  return Array.from(new Set(messages))
}

function draftSectionId(draft: ManualDraft): string {
  return draft.section_id || draft.block_id
}

function findEditSectionElement(root: HTMLElement | null, sectionId: string): HTMLElement | null {
  if (!root) return null
  return root.querySelector<HTMLElement>(`.editable-section[data-edit-section-id="${cssEscape(sectionId)}"]`)
}

function findEditHandleElement(root: HTMLElement | null): HTMLElement | null {
  if (!root) return null
  return root.querySelector<HTMLElement>('.manual-edit-affordance')
}

function findMagneticEditSection(root: HTMLElement | null, x: number, y: number): MagneticEditSection | null {
  if (!root) return null
  const candidates = Array.from(root.querySelectorAll<HTMLElement>('.editable-section[data-edit-section-id]'))
  let bestSectionId: string | null = null
  let bestElement: HTMLElement | null = null
  let bestDistance = Number.POSITIVE_INFINITY
  let bestExact = false
  candidates.forEach((element) => {
    const sectionId = element.dataset.editSectionId
    if (!sectionId) return
    const rect = element.getBoundingClientRect()
    const exact = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    const near =
      x >= rect.left - 112 &&
      x <= rect.right + 24 &&
      y >= rect.top - 18 &&
      y <= rect.bottom + 18
    if (!exact && !near) return
    const centerY = rect.top + rect.height / 2
    const distance = exact ? 0 : Math.abs(y - centerY)
    if (!bestElement || (exact && !bestExact) || distance < bestDistance) {
      bestSectionId = sectionId
      bestElement = element
      bestDistance = distance
      bestExact = exact
    }
  })
  return bestSectionId && bestElement ? { sectionId: bestSectionId, element: bestElement, exact: bestExact } : null
}

function pointInElement(element: HTMLElement, x: number, y: number): boolean {
  const rect = element.getBoundingClientRect()
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

function measureEditHandlePlacement(
  stage: HTMLElement | null,
  root: HTMLElement | null,
  sectionId: string,
): EditHandlePlacement | null {
  const section = findEditSectionElement(root, sectionId)
  if (!stage || !section) return null
  const stageRect = stage.getBoundingClientRect()
  const sectionRect = section.getBoundingClientRect()
  return {
    sectionId,
    top: Math.round(sectionRect.top - stageRect.top + 8),
    left: Math.round(sectionRect.left - stageRect.left - 72),
  }
}

function insertHeadingAtSelection(container: HTMLElement, level: 2 | 3 | 4) {
  const selection = window.getSelection()
  if (!selection) return
  let range: Range
  if (selection && selection.rangeCount > 0 && container.contains(selection.anchorNode)) {
    range = selection.getRangeAt(0)
  } else {
    container.focus()
    range = window.document.createRange()
    range.selectNodeContents(container)
    range.collapse(false)
  }
  const heading = document.createElement(`h${level}`)
  heading.textContent = `New H${level} Section`
  heading.dataset.draftHeadingLevel = `${level}`
  range.deleteContents()
  range.insertNode(heading)
  const spacer = document.createTextNode('\n')
  heading.after(spacer)
  const nextRange = document.createRange()
  nextRange.selectNodeContents(heading)
  selection.removeAllRanges()
  selection.addRange(nextRange)
}

function serializeEditedSection(element: HTMLElement): string {
  const blocks: string[] = []

  function pushBlock(value: string) {
    const normalized = normalizeEditedText(value)
    if (normalized) blocks.push(normalized)
  }

  function serializeElement(child: HTMLElement) {
    if (child.getAttribute('contenteditable') === 'false' || child.closest('[contenteditable="false"]')) {
      return
    }
    const tagName = child.tagName.toLowerCase()
    if (/^h[2-4]$/.test(tagName)) {
      pushBlock(`${'#'.repeat(Number(tagName.slice(1)))} ${child.textContent ?? ''}`)
      return
    }
    if (tagName === 'li') {
      pushBlock(`- ${child.textContent ?? ''}`)
      return
    }
    if (tagName === 'ul' || tagName === 'ol') {
      Array.from(child.children).forEach((listItem, index) => {
        if (!(listItem instanceof HTMLElement) || listItem.tagName.toLowerCase() !== 'li') return
        const marker = tagName === 'ol' ? `${index + 1}.` : '-'
        pushBlock(`${marker} ${listItem.textContent ?? ''}`)
      })
      return
    }
    if (tagName === 'blockquote') {
      pushBlock(`> ${child.textContent ?? ''}`)
      return
    }
    if (tagName === 'p') {
      pushBlock(child.textContent ?? '')
      return
    }
    Array.from(child.children).forEach((nested) => {
      if (nested instanceof HTMLElement) serializeElement(nested)
    })
  }

  Array.from(element.childNodes).forEach((child) => {
    if (child instanceof HTMLElement) {
      serializeElement(child)
    } else if (child.nodeType === Node.TEXT_NODE) {
      pushBlock(child.textContent ?? '')
    }
  })

  return normalizeEditedText(blocks.join('\n\n'))
}

function cssEscape(value: string): string {
  if ('CSS' in window && typeof window.CSS.escape === 'function') {
    return window.CSS.escape(value)
  }
  return value.replace(/["\\]/g, '\\$&')
}

function focusEditableSection(element: HTMLElement, caretPoint: PendingCaretPoint | null) {
  element.focus({ preventScroll: true })
  if (caretPoint && placeCaretAtPoint(element, caretPoint.x, caretPoint.y)) {
    return
  }
  placeCaretAtEnd(element)
}

function placeCaretAtPoint(container: HTMLElement, x: number, y: number): boolean {
  const range = editableRangeFromPoint(x, y)
  if (!range || !container.contains(range.startContainer)) return false
  const parentElement =
    range.startContainer instanceof HTMLElement ? range.startContainer : range.startContainer.parentElement
  if (parentElement?.closest('[contenteditable="false"]')) return false
  const selection = window.getSelection()
  if (!selection) return false
  selection?.removeAllRanges()
  selection?.addRange(range)
  return true
}

function editableRangeFromPoint(x: number, y: number): Range | null {
  const doc = window.document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null
    caretRangeFromPoint?: (x: number, y: number) => Range | null
  }
  const position = doc.caretPositionFromPoint?.(x, y)
  if (position) {
    const range = document.createRange()
    range.setStart(position.offsetNode, position.offset)
    range.collapse(true)
    return range
  }
  const range = doc.caretRangeFromPoint?.(x, y) ?? null
  if (range) range.collapse(true)
  return range
}

function placeCaretAtEnd(element: HTMLElement) {
  const range = window.document.createRange()
  range.selectNodeContents(element)
  range.collapse(false)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

async function waitForEditableSection(root: () => HTMLElement | null, sectionId: string): Promise<HTMLElement | null> {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const element = findEditSectionElement(root(), sectionId)
    if (element?.getAttribute('contenteditable') === 'true') {
      return element
    }
    await waitForUiTick()
  }
  return null
}

function waitForUiTick(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 25))
}

function dispatchPointerMove(element: HTMLElement | null, clientX: number, clientY: number) {
  element?.dispatchEvent(
    new PointerEvent('pointermove', {
      bubbles: true,
      clientX,
      clientY,
    }),
  )
}

function appendSmokeText(element: HTMLElement, marker: string) {
  const target = element.querySelector<HTMLElement>('p') ?? element
  target.textContent = normalizeEditedText(`${target.textContent ?? ''} ${marker}.`)
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

function smokeScenarioFromSearch(): SmokeScenario {
  const value = new URLSearchParams(window.location.search).get('archivist-smoke')
  if (value === 'edit-switch') return value
  if (value === 'hover-handle') return value
  return null
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
