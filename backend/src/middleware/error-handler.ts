import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app.error';
import { errorResponse } from '../dtos/api-response.dto';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(errorResponse(error.errorCode, error.message));
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json(errorResponse('VALIDATION_ERROR', error.errors[0].message));
    return;
  }

  console.error('[Unhandled Error]', error);
  res.status(500).json(errorResponse('INTERNAL_ERROR', 'Ocurrió un error interno en el servidor'));
}
