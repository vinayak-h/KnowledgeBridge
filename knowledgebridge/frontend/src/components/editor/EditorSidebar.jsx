import ReadinessCard from './ReadinessCard.jsx';
import ExportCard from './ExportCard.jsx';
import WorkflowStatusCard from './WorkflowStatusCard.jsx';
import { ShieldCheck } from 'lucide-react';

export default function EditorSidebar({ editor }) {
  return (
    <aside className="editor-aside">
      <ReadinessCard editor={editor} />
      <ExportCard id={editor.id} onExport={editor.exportDoc} />
      <WorkflowStatusCard form={editor.form} patch={editor.patch} />
      <div className="privacy-note">
        <ShieldCheck size={15} />
        <span>
          <b>Local-first workspace</b>
          <br />
          This POC stores data in your local MySQL database. Authentication is
          not included.
        </span>
      </div>
      <button className="text-action" onClick={editor.clearForm}>
        Clear form and start over
      </button>
    </aside>
  );
}
