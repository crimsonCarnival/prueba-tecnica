import { z } from 'zod';

export const startShiftSchema = z.object({
  workerCode: z
    .string({ required_error: 'El código del trabajador es obligatorio' })
    .trim()
    .min(1, 'El código del trabajador no puede estar vacío')
    .max(20, 'El código del trabajador no puede tener más de 20 caracteres'),
});

export const shiftIdParamSchema = z.object({
  id: z
    .string({ required_error: 'El ID de jornada es obligatorio' })
    .uuid('El ID de jornada no tiene un formato válido'),
});

export const workerCodeParamSchema = z.object({
  workerCode: z
    .string()
    .trim()
    .min(1, 'El código del trabajador no puede estar vacío'),
});
