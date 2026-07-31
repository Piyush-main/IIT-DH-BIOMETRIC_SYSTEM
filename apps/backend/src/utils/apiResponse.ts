import type { Response } from 'express';
import type { ApiResponse } from '@attendance/shared-types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  status = 200,
  meta?: ApiResponse<T>['meta'],
): void {
  const body: ApiResponse<T> = { success: true, data, error: null, meta };
  res.status(status).json(body);
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
): void {
  const body: ApiResponse<null> = {
    success: false,
    data: null,
    error: { code, message, details },
  };
  res.status(status).json(body);
}
