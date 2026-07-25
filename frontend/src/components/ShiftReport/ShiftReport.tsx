import { useState, useEffect } from 'react';
import type { ShiftResponse } from '../../types/shift.types';
import { getAllShifts } from '../../api/shift.api';
import { formatDate, formatTime, formatDuration } from '../../utils/time.utils';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import './ShiftReport.css';

export function ShiftReport() {
  const [shifts, setShifts] = useState<ShiftResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllShifts();
      setShifts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="report-loading">
        <LoadingSpinner />
        <span>Cargando reporte...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-error card">
        <p>{error}</p>
        <button className="btn btn-outline" onClick={loadReport}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="shift-report fade-in">
      {shifts.length === 0 ? (
        <div className="report-empty card">
          <p>No hay jornadas registradas aún.</p>
        </div>
      ) : (
        <div className="card">
          <div className="shift-history__table-wrapper">
            <table className="shift-history__table">
              <thead>
                <tr>
                  <th>Trabajador</th>
                  <th>Código</th>
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
                    <td className="report-worker-name">{shift.workerName}</td>
                    <td className="report-worker-code">{shift.workerCode}</td>
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
      )}
    </div>
  );
}
