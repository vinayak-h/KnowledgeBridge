import { Plus, Trash2 } from 'lucide-react';
import Field from '../common/Field.jsx';
import { newWorkItem } from '../../utils/handoverDefaults.js';

export default function WorkItemsPanel({ editor }) {
  const { form, patchArray, addArray, removeArray } = editor;

  return (
    <div className="repeat-list">
      {form.workItems.map((w, i) => (
        <div className="repeat-card" key={i}>
          <div className="repeat-card-head">
            <div className="repeat-label">
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <b>{w.title || `Work item ${i + 1}`}</b>
                <small>Task and ownership</small>
              </div>
            </div>
            <button
              className="icon-button delete-button"
              title="Remove work item"
              onClick={() => removeArray('workItems', i)}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="form-grid compact-grid">
            <Field label="Work item title" required>
              <input
                value={w.title || ''}
                maxLength={255}
                onChange={(e) =>
                  patchArray('workItems', i, 'title', e.target.value)
                }
                placeholder="What needs to be done?"
              />
            </Field>
            <Field label="Status">
              <select
                value={w.status || 'NOT_STARTED'}
                onChange={(e) =>
                  patchArray('workItems', i, 'status', e.target.value)
                }
              >
                <option value="NOT_STARTED">Not started</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="BLOCKED">Blocked</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </Field>
            <Field label="Owner">
              <input
                value={w.owner || ''}
                maxLength={255}
                onChange={(e) =>
                  patchArray('workItems', i, 'owner', e.target.value)
                }
                placeholder="Person responsible"
              />
            </Field>
            <Field label="Due date">
              <input
                type="date"
                value={w.dueDate || ''}
                onChange={(e) =>
                  patchArray('workItems', i, 'dueDate', e.target.value)
                }
              />
            </Field>
            <Field label="Description" wide>
              <textarea
                rows="2"
                value={w.description || ''}
                onChange={(e) =>
                  patchArray('workItems', i, 'description', e.target.value)
                }
                placeholder="Scope, current state, or acceptance criteria"
              />
            </Field>
            <Field label="Completed work">
              <textarea
                rows="2"
                value={w.completedWork || ''}
                onChange={(e) =>
                  patchArray('workItems', i, 'completedWork', e.target.value)
                }
                placeholder="What has already been done?"
              />
            </Field>
            <Field label="Next action">
              <textarea
                rows="2"
                value={w.nextAction || ''}
                onChange={(e) =>
                  patchArray('workItems', i, 'nextAction', e.target.value)
                }
                placeholder="The next concrete step"
              />
            </Field>
            {w.status === 'BLOCKED' && (
              <Field label="Blocker details" wide>
                <textarea
                  rows="2"
                  value={w.blocker || ''}
                  onChange={(e) =>
                    patchArray('workItems', i, 'blocker', e.target.value)
                  }
                  placeholder="What is blocking progress?"
                />
              </Field>
            )}
          </div>
        </div>
      ))}
      <button
        className="add-row-button"
        onClick={() => addArray('workItems', newWorkItem())}
      >
        <Plus size={16} /> Add work item
      </button>
      {!form.workItems.length && (
        <div className="inline-empty">
          No work items yet. Add open tasks, follow-ups, or recently completed
          work.
        </div>
      )}
    </div>
  );
}
