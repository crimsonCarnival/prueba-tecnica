export function validateWorkerCode(code: string): string | null {
  if (!code.trim()) return 'El código del trabajador es obligatorio';
  if (code.trim().length > 20) return 'El código no puede tener más de 20 caracteres';
  return null;
}
