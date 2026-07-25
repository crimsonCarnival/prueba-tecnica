import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return <span className={`spinner spinner--${size}`} aria-label="Cargando" />;
}
