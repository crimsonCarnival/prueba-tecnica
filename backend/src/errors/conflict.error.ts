import { AppError } from './app.error';

export class ConflictError extends AppError {
  constructor(errorCode: string, message: string) {
    super(409, errorCode, message);
    this.name = 'ConflictError';
  }
}
