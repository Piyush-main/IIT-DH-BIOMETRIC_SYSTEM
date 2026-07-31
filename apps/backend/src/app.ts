import express from 'express';
import cors from 'cors';
import helmetImport from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { API_PREFIX } from '@attendance/constants';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const helmet = helmetImport as unknown as () => express.RequestHandler;

export function createApp() {
  const app = express();

  // --- Security & parsing middleware -----------------------------------
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '2mb' })); // 2mb covers a base64 fingerprint payload comfortably
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

  // --- Routes ------------------------------------------------------------
  app.use(API_PREFIX, apiRouter);

  // --- 404 + centralized error handling (must be registered last) -------
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
