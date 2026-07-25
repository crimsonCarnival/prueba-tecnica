import { AppError } from './app.error';

export class NotFoundError extends AppError {
  constructor(errorCode: string, message: string) {
    super(404, errorCode, message);
    this.name = 'NotFoundError';
  }
}
