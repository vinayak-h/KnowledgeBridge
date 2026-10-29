import Field from '../common/Field.jsx';

export default function DetailsSection({ form, patch }) {
  return (
    <section className="form-card">
      <div className="form-section-head">
        <div className="section-number">01</div>
        <div>
          <h2>Handover details</h2>
          <p>Set the context, people and timing.</p>
        </div>
      </div>
      <div className="form-grid">
        <Field label="Handover title" required>
          <input
            value={form.title}
            maxLength={255}
            onChange={(e) => patch('title', e.target.value)}
            placeholder="e.g. Payments API — planned leave"
          />
        </Field>
        <Field label="Handover type">
          <select
            value={form.type || 'LEAVE'}
            onChange={(e) => patch('type', e.target.value)}
          >
            <option value="LEAVE">Planned / unplanned leave</option>
            <option value="PROJECT_TRANSITION">Project transition</option>
            <option value="ROLE_CHANGE">Role change</option>
            <option value="RESPONSIBILITY_TRANSFER">
              Responsibility transfer
            </option>
          </select>
        </Field>
        <Field label="Created by" required>
          <input
            value={form.creator}
            maxLength={255}
            onChange={(e) => patch('creator', e.target.value)}
            placeholder="Your name"
          />
        </Field>
        <Field label="Handover recipient">
          <input
            value={form.recipient || ''}
            maxLength={255}
            onChange={(e) => patch('recipient', e.target.value)}
            placeholder="Who will pick this up?"
          />
        </Field>
        <Field label="Start date">
          <input
            type="date"
            value={form.startDate || ''}
            onChange={(e) => patch('startDate', e.target.value)}
          />
        </Field>
        <Field label="End date">
          <input
            type="date"
            min={form.startDate || undefined}
            value={form.endDate || ''}
            onChange={(e) => patch('endDate', e.target.value)}
          />
        </Field>
        <Field label="Overview and current situation" wide>
          <textarea
            rows="4"
            maxLength={4000}
            value={form.summary || ''}
            onChange={(e) => patch('summary', e.target.value)}
            placeholder="What is happening, what matters most, and what should the next person know?"
          />
          <div className="field-meta">
            {(form.summary || '').length}/4000 characters
          </div>
        </Field>
      </div>
    </section>
  );
}
