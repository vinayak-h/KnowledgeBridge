import { Activity } from 'lucide-react';
import Field from '../common/Field.jsx';

export default function WorkflowStatusCard({ form, patch }) {
  const status = form.status || 'DRAFT';

  return (
    <section className="side-card">
      <div className="side-card-heading">
        <div className="side-icon green-icon">
          <Activity size={18} />
        </div>
        <div>
          <h3>Workflow status</h3>
          <p>Choose where this handover stands.</p>
        </div>
      </div>
      <Field label="Current status">
        <select
          value={status}
          onChange={(e) => patch('status', e.target.value)}
        >
          <option value="DRAFT">Draft</option>
          <option value="READY">Ready for review</option>
          <option value="SHARED">Shared</option>
        </select>
      </Field>
      <div className="status-hint">
        <span className={`status-dot ${status.toLowerCase()}`} />
        {form.status === 'SHARED'
          ? 'This handover has been shared with the next owner.'
          : form.status === 'READY'
            ? 'Ready for a teammate to review.'
            : 'Keep editing, then check readiness.'}
      </div>
    </section>
  );
}
