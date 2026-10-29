import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getReadinessPercent } from '../../utils/handoverStats.js';

export default function ReadinessCard({ editor }) {
  const { form, findings, saving, checkCompleteness } = editor;

  return (
    <section className="side-card readiness-card">
      <div className="side-card-heading">
        <div className="side-icon purple-icon">
          <ShieldCheck size={18} />
        </div>
        <div>
          <h3>Handover readiness</h3>
          <p>Check for missing context.</p>
        </div>
      </div>
      <div className="readiness-meter">
        <div className="meter-track">
          <div
            className="meter-fill"
            style={{ width: `${getReadinessPercent(form, findings)}%` }}
          />
        </div>
        <span>
          {findings
            ? findings.ready
              ? 'Ready to review'
              : 'Needs attention'
            : 'Draft progress'}
        </span>
      </div>
      <button
        className="btn btn-secondary btn-full"
        onClick={checkCompleteness}
        disabled={saving}
      >
        <CheckCircle2 size={16} /> Run completeness check
      </button>
      {findings && (
        <div className="findings-list">
          <div
            className={`finding-summary ${findings.ready ? 'positive' : 'warning'}`}
          >
            {findings.ready ? (
              <CheckCircle2 size={15} />
            ) : (
              <AlertCircle size={15} />
            )}{' '}
            {findings.ready
              ? 'No blocking warnings'
              : `${findings.warningCount} warning(s) to review`}
          </div>
          {findings.findings.length ? (
            findings.findings.map((f, i) => (
              <div className="finding" key={i}>
                <span
                  className={
                    f.severity === 'WARNING'
                      ? 'finding-dot warn'
                      : 'finding-dot info'
                  }
                />
                <span>{f.message}</span>
              </div>
            ))
          ) : (
            <p className="no-findings">Everything important looks covered.</p>
          )}
        </div>
      )}
    </section>
  );
}
