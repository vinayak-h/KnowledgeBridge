import { memo, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { TOAST_DURATION_MS, TOAST_EXIT_MS } from '../../utils/constants.js';
import './Toast.css';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

// Each toast owns its timer. Hover or focus pauses it; leaving resumes with the remaining time.
const ToastItem = memo(function ToastItem({ toast, onRemove }) {
  const { id, type, message, seq } = toast;
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const remainingRef = useRef(TOAST_DURATION_MS);
  const startedAtRef = useRef(0);
  const Icon = ICONS[type] || Info;

  // A repeated message restarts the full duration.
  useEffect(() => {
    remainingRef.current = TOAST_DURATION_MS;
  }, [seq]);

  useEffect(() => {
    if (paused || leaving) return undefined;
    startedAtRef.current = Date.now();
    const timer = setTimeout(() => setLeaving(true), remainingRef.current);
    return () => {
      clearTimeout(timer);
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAtRef.current)
      );
    };
  }, [paused, leaving, seq]);

  useEffect(() => {
    if (!leaving) return undefined;
    const timer = setTimeout(() => onRemove(id), TOAST_EXIT_MS);
    return () => clearTimeout(timer);
  }, [leaving, id, onRemove]);

  const isAssertive = type === 'error';

  return (
    <div
      className={`kb-toast kb-toast-${type}${leaving ? ' kb-toast-leaving' : ''}`}
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <span className="kb-toast-icon">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="kb-toast-message">{message}</div>
      <button
        type="button"
        className="kb-toast-close"
        aria-label="Dismiss notification"
        disabled={leaving}
        onClick={() => setLeaving(true)}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
});

export default function ToastViewport({ toasts, onRemove }) {
  return (
    <div className="kb-toast-viewport" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
