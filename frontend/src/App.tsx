import { useState, useEffect, useRef } from 'react';
import { useShift } from './hooks/useShift';
import { useToast } from './hooks/useToast';
import { ShiftForm } from './components/ShiftForm/ShiftForm';
import { ActiveShift } from './components/ActiveShift/ActiveShift';
import { ShiftHistory } from './components/ShiftHistory/ShiftHistory';
import { ShiftReport } from './components/ShiftReport/ShiftReport';
import { ToastContainer } from './components/Toast/Toast';
import './App.css';

export default function App() {
  const [isReportView, setIsReportView] = useState(false);
  const { activeShift, history, isLoading, error, handleStartShift, handleEndShift, clearError } =
    useShift();
  const { toasts, showToast, dismissToast } = useToast();
  const prevError = useRef<string | null>(null);

  useEffect(() => {
    if (error && error !== prevError.current) {
      showToast(error, 'error');
      clearError();
    }
    prevError.current = error;
  }, [error, showToast, clearError]);

  const onStart = async (code: string) => {
    await handleStartShift(code);
  };

  const onEnd = async () => {
    await handleEndShift();
    showToast('Jornada finalizada correctamente', 'success');
  };

  const workerName = activeShift?.workerName ?? history[0]?.workerName ?? '';

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-inner">
          <h1 className="app__title">Control de Jornada</h1>
          <div className="app__header-actions">
            <button
              className="btn btn-outline app__toggle-btn"
              onClick={() => setIsReportView(!isReportView)}
            >
              {isReportView ? 'Ver registro' : 'Ver reporte general'}
            </button>

          </div>
        </div>
      </header>

      <main className="app__main">
        {isReportView ? (
          <ShiftReport />
        ) : (
          <div className="app__content">
            {activeShift ? (
              <ActiveShift shift={activeShift} onEnd={onEnd} isLoading={isLoading} />
            ) : (
              <ShiftForm onStart={onStart} isLoading={isLoading} />
            )}

            {history.length > 0 && (
              <ShiftHistory shifts={history} workerName={workerName} />
            )}
          </div>
        )}
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
