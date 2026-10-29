import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function Toast({ error, notice, onDismiss }) {
  if (!error && !notice) return null;

  return (
    <div className={`toast ${error ? 'toast-error' : 'toast-success'}`}>
      <span>
        {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      </span>
      <div>{error || notice}</div>
      <button aria-label="Dismiss message" onClick={onDismiss}>
        <X size={17} />
      </button>
    </div>
  );
}
