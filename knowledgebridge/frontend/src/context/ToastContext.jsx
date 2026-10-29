import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import ToastViewport from '../components/common/Toast.jsx';
import { TOAST_MAX_VISIBLE } from '../utils/constants.js';

const ToastContext = createContext(null);

/**
 * Global notification queue. Exposes a stable API via useToast().
 * Duplicate type+message pairs restart the existing toast instead of stacking.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((type, message) => {
    const text = String(message ?? '').trim();
    if (!text) return;
    const id = ++nextId.current;
    setToasts((prev) => {
      const existing = prev.find((t) => t.type === type && t.message === text);
      if (existing) {
        return prev.map((t) =>
          t.id === existing.id ? { ...t, seq: t.seq + 1 } : t
        );
      }
      return [...prev, { id, type, message: text, seq: 0 }].slice(
        -TOAST_MAX_VISIBLE
      );
    });
  }, []);

  const api = useMemo(
    () => ({
      success: (message) => show('success', message),
      error: (message) => show('error', message),
      warning: (message) => show('warning', message),
      info: (message) => show('info', message),
      dismiss,
    }),
    [show, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onRemove={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside ToastProvider');
  return api;
}
