import { Link2, Plus, Trash2 } from 'lucide-react';
import Field from '../common/Field.jsx';
import { newReferenceLink } from '../../utils/handoverDefaults.js';

export default function ReferencesPanel({ editor }) {
  const { form, patchArray, addArray, removeArray } = editor;

  return (
    <div className="repeat-list">
      {form.referenceLinks.map((l, i) => (
        <div className="repeat-card" key={i}>
          <div className="repeat-card-head">
            <div className="repeat-label">
              <span>
                <Link2 size={15} />
              </span>
              <div>
                <b>{l.label || `Reference ${i + 1}`}</b>
                <small>Source of truth</small>
              </div>
            </div>
            <button
              className="icon-button delete-button"
              title="Remove reference"
              onClick={() => removeArray('referenceLinks', i)}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="form-grid compact-grid">
            <Field label="Link label">
              <input
                value={l.label || ''}
                maxLength={255}
                onChange={(e) =>
                  patchArray('referenceLinks', i, 'label', e.target.value)
                }
                placeholder="e.g. Runbook or pull request"
              />
            </Field>
            <Field label="URL">
              <input
                type="url"
                value={l.url || ''}
                maxLength={1500}
                onChange={(e) =>
                  patchArray('referenceLinks', i, 'url', e.target.value)
                }
                placeholder="https://..."
              />
            </Field>
          </div>
        </div>
      ))}
      <button
        className="add-row-button"
        onClick={() => addArray('referenceLinks', newReferenceLink())}
      >
        <Plus size={16} /> Add reference link
      </button>
      {!form.referenceLinks.length && (
        <div className="inline-empty">
          Add runbooks, dashboards, documents, tickets or other useful links.
        </div>
      )}
    </div>
  );
}
