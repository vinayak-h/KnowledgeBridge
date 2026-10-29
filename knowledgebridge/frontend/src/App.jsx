import { useRef, useState } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import Topbar from './components/layout/Topbar.jsx';
import ConfirmDialog from './components/common/ConfirmDialog.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import { useHandoverList } from './hooks/useHandoverList.js';
import { useHandoverEditor } from './hooks/useHandoverEditor.js';

export default function App() {
  const [screen, setScreen] = useState('dashboard');

  const list = useHandoverList();
  const editor = useHandoverEditor({ list, setScreen });

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const deletingRef = useRef(false);

  const requestDelete = (handoverId) => {
    setPendingDeleteId(handoverId);
  };

  const cancelDelete = () => {
    if (deletingRef.current) return;
    setPendingDeleteId(null);
  };

  // Failures are reported by a toast; the dialog stays open so the user can retry.
  const confirmDelete = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    const deleted = await editor.removeHandover(pendingDeleteId);
    deletingRef.current = false;
    setDeleting(false);
    if (deleted) setPendingDeleteId(null);
  };

  const showDashboard = () => setScreen('dashboard');
  const isEditorOpen = screen === 'editor';
  const title = isEditorOpen
    ? editor.id
      ? 'Edit handover'
      : 'New handover'
    : 'Overview';

  return (
    <div className="app-shell">
      <Sidebar
        isOverviewActive={screen === 'dashboard'}
        isCreateActive={isEditorOpen && !editor.id}
        onShowOverview={showDashboard}
        onCreate={editor.create}
      />

      <main className="main-area">
        <Topbar title={title} />
        <div className="page-content">
          {screen === 'dashboard' ? (
            <DashboardPage
              list={list}
              onCreate={editor.create}
              onOpen={editor.edit}
              onDelete={requestDelete}
            />
          ) : (
            <EditorPage editor={editor} onBack={showDashboard} />
          )}

          <ConfirmDialog
            open={pendingDeleteId !== null}
            title="Delete handover?"
            message="Delete this handover and all its work items, knowledge notes, and references? This action cannot be undone."
            confirmLabel="Delete handover"
            busyLabel="Deleting…"
            busy={deleting}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />

          <footer className="page-footer">
            <span>
              KnowledgeBridge <b>·</b> Keep context connected.
            </span>
            <span>Local development build</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
