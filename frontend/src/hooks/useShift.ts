import { useState, useCallback } from 'react';
import type { ShiftResponse } from '../types/shift.types';
import { startShift, endShift, getActiveShift, getShiftHistory } from '../api/shift.api';

interface ShiftState {
  activeShift: ShiftResponse | null;
  history: ShiftResponse[];
  isLoading: boolean;
  error: string | null;
}

interface UseShiftReturn extends ShiftState {
  handleStartShift: (workerCode: string) => Promise<void>;
  handleEndShift: () => Promise<void>;
  handleLookupWorker: (workerCode: string) => Promise<void>;
  clearError: () => void;
}

export function useShift(): UseShiftReturn {
  const [state, setState] = useState<ShiftState>({
    activeShift: null,
    history: [],
    isLoading: false,
    error: null,
  });

  const setLoading = () => setState((s) => ({ ...s, isLoading: true, error: null }));
  const setError = (error: string) => setState((s) => ({ ...s, isLoading: false, error }));
  const clearError = () => setState((s) => ({ ...s, error: null }));

  const handleLookupWorker = useCallback(async (workerCode: string) => {
    setLoading();
    try {
      const [active, history] = await Promise.all([
        getActiveShift(workerCode),
        getShiftHistory(workerCode),
      ]);
      setState({ activeShift: active, history, isLoading: false, error: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar trabajador');
    }
  }, []);

  const handleStartShift = useCallback(async (workerCode: string) => {
    setLoading();
    try {
      const existing = await getActiveShift(workerCode);
      if (existing) {
        const history = await getShiftHistory(workerCode);
        setState({ activeShift: existing, history, isLoading: false, error: null });
        return;
      }
      const shift = await startShift(workerCode);
      const history = await getShiftHistory(workerCode);
      setState({ activeShift: shift, history, isLoading: false, error: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar jornada');
    }
  }, []);

  const handleEndShift = useCallback(async () => {
    if (!state.activeShift) return;
    setLoading();
    try {
      const completed = await endShift(state.activeShift.id);
      const history = await getShiftHistory(completed.workerCode);
      setState({ activeShift: null, history, isLoading: false, error: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al finalizar jornada');
    }
  }, [state.activeShift]);

  return { ...state, handleStartShift, handleEndShift, handleLookupWorker, clearError };
}
