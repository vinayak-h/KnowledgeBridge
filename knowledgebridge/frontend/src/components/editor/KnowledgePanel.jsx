import { Plus, Trash2 } from 'lucide-react';
import Field from '../common/Field.jsx';
import { newKnowledgeEntry } from '../../utils/handoverDefaults.js';
import { nice } from '../../utils/formatters.js';

export default function KnowledgePanel({ editor }) {
  const { form, patchArray, addArray, removeArray } = editor;

  return (
    <div className="repeat-list">
      {form.knowledgeEntries.map((k, i) => (
        <div className="repeat-card" key={i}>
          <div className="repeat-card-head">
            <div className="repeat-label">
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <b>{k.title || `Knowledge note ${i + 1}`}</b>
                <small>{nice(k.type || 'GENERAL')}</small>
              </div>
            </div>
            <button
              className="icon-button delete-button"
              title="Remove note"
              onClick={() => removeArray('knowledgeEntries', i)}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="form-grid compact-grid">
            <Field label="Note type">
              <select
                value={k.type || 'GENERAL'}
                onChange={(e) =>
                  patchArray('knowledgeEntries', i, 'type', e.target.value)
                }
              >
                <option value="DECISION">Decision</option>
                <option value="ISSUE">Issue</option>
                <option value="WORKAROUND">Workaround</option>
                <option value="DEPENDENCY">Dependency</option>
                <option value="OPEN_QUESTION">Open question</option>
                <option value="GENERAL">General note</option>
              </select>
            </Field>
            <Field label="Title">
              <input
                value={k.title || ''}
                maxLength={255}
                onChange={(e) =>
                  patchArray('knowledgeEntries', i, 'title', e.target.value)
                }
                placeholder="Short descriptive title"
              />
            </Field>
            <Field label="Details" wide>
              <textarea
                rows="3"
                value={k.content || ''}
                onChange={(e) =>
                  patchArray('knowledgeEntries', i, 'content', e.target.value)
                }
                placeholder="What was decided? What should someone know? Include useful context."
              />
            </Field>
          </div>
        </div>
      ))}
      <button
        className="add-row-button"
        onClick={() => addArray('knowledgeEntries', newKnowledgeEntry())}
      >
        <Plus size={16} /> Add knowledge note
      </button>
      {!form.knowledgeEntries.length && (
        <div className="inline-empty">
          Capture decisions, recurring issues, workarounds and dependencies.
        </div>
      )}
    </div>
  );
}
