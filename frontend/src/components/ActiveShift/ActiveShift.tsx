import type { ShiftResponse } from '../../types/shift.types';
import { Timer } from '../Timer/Timer';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { formatDate, formatTime } from '../../utils/time.utils';
import './ActiveShift.css';

interface ActiveShiftProps {
  shift: ShiftResponse;
  onEnd: () => Promise<void>;
  isLoading: boolean;
}

export function ActiveShift({ shift, onEnd, isLoading }: ActiveShiftProps) {
  return (
    <div className="active-shift card fade-in">
      <div className="active-shift__header">
        <div>
          <h2 className="active-shift__name">{shift.workerName}</h2>
        </div>
      </div>

      <div className="active-shift__timer-wrapper">
        <Timer serverStartTime={shift.startTime} />
      </div>

      <div className="active-shift__meta">
        <div className="active-shift__meta-item">
          <span className="label">Fecha</span>
          <span className="active-shift__meta-value">{formatDate(shift.date)}</span>
        </div>
        <div className="active-shift__meta-item">
          <span className="label">Hora de inicio</span>
          <span className="active-shift__meta-value">{formatTime(shift.startTime)}</span>
        </div>
      </div>

      <button
        id="btn-end-shift"
        className="btn btn-danger active-shift__end-btn"
        onClick={onEnd}
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner size="sm" /> : ''}
        {isLoading ? 'Finalizando...' : 'Terminar Jornada'}
      </button>
    </div>
  );
}
