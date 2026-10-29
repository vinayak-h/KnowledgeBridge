import { useRef, useState } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import Topbar from './components/layout/Topbar.jsx';
import Toast from './components/common/Toast.jsx';
import ConfirmDialog from './components/common/ConfirmDialog.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import { useHandoverList } from './hooks/useHandoverList.js';
import { useHandoverEditor } from './hooks/useHandoverEditor.js';

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const list = useHandoverList({ onError: setError });
  const editor = useHandoverEditor({ list, setError, setNotice, setScreen });

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const deletingRef = useRef(false);

  const requestDelete = (handoverId) => {
    setDeleteError('');
    setPendingDeleteId(handoverId);
  };

  const cancelDelete = () => {
    if (deletingRef.current) return;
    setDeleteError('');
    setPendingDeleteId(null);
  };

  const confirmDelete = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    setDeleteError('');
    const failure = await editor.removeHandover(pendingDeleteId);
    deletingRef.current = false;
    setDeleting(false);
    if (failure) {
      setDeleteError(failure);
    } else {
      setPendingDeleteId(null);
    }
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
          <Toast
            error={error}
            notice={notice}
            onDismiss={() => {
              setError('');
              setNotice('');
            }}
          />

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
            error={deleteError}
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
