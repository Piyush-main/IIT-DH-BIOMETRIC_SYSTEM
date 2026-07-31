import type { NextFunction, Request, Response } from 'express';
import { enrollmentService } from '../services/enrollment.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

export const enrollmentController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, studentId, courseCode } = req.query as unknown as {
        page: number;
        pageSize: number;
        studentId?: string;
        courseCode?: string;
      };
      const { items, total } = await enrollmentService.list({
        page,
        pageSize,
        studentId,
        courseCode,
      });
      sendSuccess(res, items, 200, { page, pageSize, total });
    } catch (err) {
      next(err);
    }
  },

  /** GET /enrollments/me — the logged-in student's own enrollments. */
  async mine(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.refId) {
        throw AppError.forbidden('Only students have enrollments of their own');
      }
      const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
      const { items, total } = await enrollmentService.list({
        page,
        pageSize,
        studentId: req.user.refId,
      });
      sendSuccess(res, items, 200, { page, pageSize, total });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollment = await enrollmentService.create(req.body);
      sendSuccess(res, enrollment, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { enrollmentId } = req.params as unknown as { enrollmentId: bigint };
      const enrollment = await enrollmentService.updateStatus(enrollmentId, req.body.status);
      sendSuccess(res, enrollment);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { enrollmentId } = req.params as unknown as { enrollmentId: bigint };
      await enrollmentService.remove(enrollmentId);
      sendSuccess(res, { enrollmentId: enrollmentId.toString(), deleted: true });
    } catch (err) {
      next(err);
    }
  },
};
