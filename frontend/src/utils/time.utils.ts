export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':');
}

export function formatDateTime(dateTimeStr: string): string {
  const date = new Date(dateTimeStr.replace(' ', 'T'));
  return date.toLocaleString('es-MX', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function formatTime(dateTimeStr: string): string {
  const date = new Date(dateTimeStr.replace(' ', 'T'));
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function elapsedSecondsSince(serverStartTime: string): number {
  const start = new Date(serverStartTime.replace(' ', 'T')).getTime();
  return Math.floor((Date.now() - start) / 1000);
}
