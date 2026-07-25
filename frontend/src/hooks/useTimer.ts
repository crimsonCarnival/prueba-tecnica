import { useState, useEffect, useRef } from 'react';
import { elapsedSecondsSince } from '../utils/time.utils';

export function useTimer(serverStartTime: string | null): number {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!serverStartTime) {
      setElapsed(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setElapsed(elapsedSecondsSince(serverStartTime));

    intervalRef.current = setInterval(() => {
      setElapsed(elapsedSecondsSince(serverStartTime));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [serverStartTime]);

  return elapsed;
}
