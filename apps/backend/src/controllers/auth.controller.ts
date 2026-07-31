import type { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

export const authController = {
  /** GET /auth/me — resolves role from the JWT via the `authenticate` middleware. */
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }
      sendSuccess(res, req.user);
    } catch (err) {
      next(err);
    }
  },
};
