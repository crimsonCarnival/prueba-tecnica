import { useTimer } from '../../hooks/useTimer';
import { formatDuration } from '../../utils/time.utils';
import './Timer.css';

interface TimerProps {
  serverStartTime: string;
}

export function Timer({ serverStartTime }: TimerProps) {
  const elapsed = useTimer(serverStartTime);
  const formatted = formatDuration(elapsed);
  const [hh, mm, ss] = formatted.split(':');

  return (
    <div className="timer" aria-live="polite" aria-label={`Tiempo transcurrido: ${formatted}`}>
      <div className="timer__segments">
        <div className="timer__segment">
          <span className="timer__digit">{hh}</span>
          <span className="timer__unit">h</span>
        </div>
        <span className="timer__colon">:</span>
        <div className="timer__segment">
          <span className="timer__digit">{mm}</span>
          <span className="timer__unit">m</span>
        </div>
        <span className="timer__colon">:</span>
        <div className="timer__segment">
          <span className="timer__digit">{ss}</span>
          <span className="timer__unit">s</span>
        </div>
      </div>
    </div>
  );
}
