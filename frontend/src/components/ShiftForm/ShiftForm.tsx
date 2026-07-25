import { useState } from 'react';
import { validateWorkerCode } from '../../utils/validation.utils';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import './ShiftForm.css';

interface ShiftFormProps {
  onStart: (workerCode: string) => Promise<void>;
  isLoading: boolean;
}

export function ShiftForm({ onStart, isLoading }: ShiftFormProps) {
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateWorkerCode(code);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    await onStart(code.trim().toUpperCase());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    if (validationError) setValidationError(null);
  };

  return (
    <div className="shift-form card fade-in">
      <div className="shift-form__header">
        <h1 className="shift-form__title">Control de Jornada</h1>
        <p className="shift-form__subtitle">Ingresa tu código para registrar tu jornada laboral</p>
      </div>

      <form onSubmit={handleSubmit} className="shift-form__body" noValidate>
        <div className="shift-form__field">
          <label htmlFor="worker-code" className="label">Código de trabajador</label>
          <input
            id="worker-code"
            type="text"
            className={`input ${validationError ? 'error' : ''}`}
            value={code}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="off"
            autoFocus
            maxLength={20}
          />
          {validationError && <p className="error-msg">{validationError}</p>}
        </div>

        <button
          id="btn-start-shift"
          type="submit"
          className="btn btn-primary shift-form__submit"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" /> : ''}
          {isLoading ? 'Iniciando...' : 'Iniciar Jornada'}
        </button>
      </form>
    </div>
  );
}
