import { ArrowLeft, Check, LoaderCircle } from 'lucide-react';

export default function EditorHeader({ id, saving, onBack, onSave }) {
  return (
    <div className="editor-title-row">
      <div>
        <button className="back-link" onClick={onBack}>
          <ArrowLeft size={15} /> Back to overview
        </button>
        <div className="eyebrow editor-eyebrow">
          <span className="eyebrow-dot" /> HANDOVER WORKSPACE
        </div>
        <h1>{id ? 'Shape the handover.' : 'Create a handover.'}</h1>
        <p>
          Capture the information someone needs to confidently continue the
          work.
        </p>
      </div>
      <div className="editor-title-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onSave} disabled={saving}>
          {saving ? (
            <LoaderCircle size={16} className="spin" />
          ) : (
            <Check size={16} />
          )}{' '}
          {saving ? 'Saving…' : 'Save handover'}
        </button>
      </div>
    </div>
  );
}
