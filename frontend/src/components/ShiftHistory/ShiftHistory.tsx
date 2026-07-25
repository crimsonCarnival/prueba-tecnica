import type { ShiftResponse } from '../../types/shift.types';
import { formatDate, formatTime, formatDuration } from '../../utils/time.utils';
import './ShiftHistory.css';

interface ShiftHistoryProps {
  shifts: ShiftResponse[];
  workerName: string;
}

export function ShiftHistory({ shifts, workerName }: ShiftHistoryProps) {
  if (shifts.length === 0) return null;

  return (
    <div className="shift-history card fade-in">
      <div className="shift-history__header">
        <h3 className="shift-history__title">Historial de Jornadas</h3>
        <span className="shift-history__worker"><strong>Trabajador </strong>{workerName}</span>
      </div>

      <div className="shift-history__table-wrapper">
        <table className="shift-history__table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Tiempo total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td>{formatDate(shift.date)}</td>
                <td>{formatTime(shift.startTime)}</td>
                <td>{shift.endTime ? formatTime(shift.endTime) : '—'}</td>
                <td className="shift-history__duration">
                  {shift.totalSeconds != null ? formatDuration(shift.totalSeconds) : '—'}
                </td>
                <td>
                  <span className={`badge badge-${shift.status}`}>
                    {shift.status === 'active' ? 'En curso' : 'Completada'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
