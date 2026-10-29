import { useState } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import Topbar from './components/layout/Topbar.jsx';
import Toast from './components/common/Toast.jsx';
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
              onDelete={editor.removeHandover}
            />
          ) : (
            <EditorPage editor={editor} onBack={showDashboard} />
          )}

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
