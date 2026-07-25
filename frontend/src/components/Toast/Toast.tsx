import type { ToastType } from '../../hooks/useToast';
import './Toast.css';


interface ToastItemProps {
  id: number;
  message: string;
  type: ToastType;
  onDismiss: (id: number) => void;
}

function ToastItem({ id, message, type, onDismiss }: ToastItemProps) {
  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast__icon">{type === 'success' ? '✓' : '✕'}</span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={() => onDismiss(id)} aria-label="Cerrar">×</button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: number; message: string; type: ToastType }>;
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
