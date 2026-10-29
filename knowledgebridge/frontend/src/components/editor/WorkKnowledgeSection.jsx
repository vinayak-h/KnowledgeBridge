import { BookOpen, Link2, ListTodo } from 'lucide-react';
import WorkItemsPanel from './WorkItemsPanel.jsx';
import KnowledgePanel from './KnowledgePanel.jsx';
import ReferencesPanel from './ReferencesPanel.jsx';

export default function WorkKnowledgeSection({ editor }) {
  const { form, tab, setTab } = editor;

  return (
    <section className="form-card work-card">
      <div className="form-section-head">
        <div className="section-number">02</div>
        <div>
          <h2>Work and knowledge</h2>
          <p>Document open work, key decisions and useful references.</p>
        </div>
      </div>
      <div className="content-tabs">
        <button
          className={tab === 'work' ? 'active' : ''}
          onClick={() => setTab('work')}
        >
          <ListTodo size={16} /> Work items <span>{form.workItems.length}</span>
        </button>
        <button
          className={tab === 'knowledge' ? 'active' : ''}
          onClick={() => setTab('knowledge')}
        >
          <BookOpen size={16} /> Knowledge{' '}
          <span>{form.knowledgeEntries.length}</span>
        </button>
        <button
          className={tab === 'links' ? 'active' : ''}
          onClick={() => setTab('links')}
        >
          <Link2 size={16} /> References{' '}
          <span>{form.referenceLinks.length}</span>
        </button>
      </div>
      {tab === 'work' && <WorkItemsPanel editor={editor} />}
      {tab === 'knowledge' && <KnowledgePanel editor={editor} />}
      {tab === 'links' && <ReferencesPanel editor={editor} />}
    </section>
  );
}
