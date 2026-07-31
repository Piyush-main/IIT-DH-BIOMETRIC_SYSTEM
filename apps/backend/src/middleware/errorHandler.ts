import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError.js';
import { sendError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

/**
 * Must be registered LAST in app.ts, after all routes. Express recognizes
 * it as an error handler because it takes 4 arguments.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  // Prisma FK / unique-constraint violations surface as recognizable codes.
  // This is where the "hard delete blocked by attendance history" case
  // (P2003 on delete, or P2002 on unique constraints) gets turned into a
  // clean 409 instead of a raw stack trace reaching the client.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2003') {
      sendError(
        res,
        409,
        'FOREIGN_KEY_CONSTRAINT',
        'This record cannot be deleted because related records (e.g. attendance or enrollments) still reference it.',
      );
      return;
    }
    if (err.code === 'P2002') {
      sendError(res, 409, 'UNIQUE_CONSTRAINT', 'A record with this value already exists.', {
        target: err.meta?.target,
      });
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 404, 'NOT_FOUND', 'The requested record does not exist.');
      return;
    }
  }

  console.error('Unhandled error:', err);
  sendError(
    res,
    500,
    'INTERNAL_ERROR',
    'Something went wrong on our end.',
    env.NODE_ENV === 'development' ? err : undefined,
  );
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, 'ROUTE_NOT_FOUND', `No route matches ${req.method} ${req.originalUrl}`);
}
