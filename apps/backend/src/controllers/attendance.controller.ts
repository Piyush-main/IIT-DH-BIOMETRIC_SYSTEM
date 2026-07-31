import type { NextFunction, Request, Response } from 'express';
import { attendanceService } from '../services/attendance.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

export const attendanceController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as {
        page: number;
        pageSize: number;
        studentId?: string;
        courseCode?: string;
        sessionDate?: string;
      };
      const { items, total } = await attendanceService.list(query);
      sendSuccess(res, items, 200, { page: query.page, pageSize: query.pageSize, total });
    } catch (err) {
      next(err);
    }
  },

  /** GET /attendance/me — the logged-in student's own records + summary. */
  async mine(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.refId) {
        throw AppError.forbidden('Only students have attendance records of their own');
      }
      const query = req.query as unknown as {
        page: number;
        pageSize: number;
        courseCode?: string;
        sessionDate?: string;
      };
      const [{ items, total }, summary] = await Promise.all([
        attendanceService.list({ ...query, studentId: req.user.refId }),
        attendanceService.summaryForStudent(req.user.refId),
      ]);
      sendSuccess(res, { records: items, summary }, 200, {
        page: query.page,
        pageSize: query.pageSize,
        total,
      });
    } catch (err) {
      next(err);
    }
  },

  /** POST /attendance — mark a student present for a session. */
  async mark(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await attendanceService.mark(req.body, {
        role: req.user!.role,
        profId: req.user!.role === 'PROFESSOR' ? req.user!.refId : null,
      });
      sendSuccess(res, record, 201);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { attendanceId } = req.params as unknown as { attendanceId: number };
      await attendanceService.remove(attendanceId);
      sendSuccess(res, { attendanceId, deleted: true });
    } catch (err) {
      next(err);
    }
  },
};
