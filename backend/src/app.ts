import express from 'express';
import cors from 'cors';
import { env } from './config/environment';
import { shiftRoutes } from './routes/shift.routes';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/shifts', shiftRoutes);

app.use(errorHandler);

export { app };
