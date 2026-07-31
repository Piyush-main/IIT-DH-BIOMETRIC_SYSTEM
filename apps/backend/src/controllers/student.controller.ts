import type { NextFunction, Request, Response } from 'express';
import { studentService } from '../services/student.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import type { PaginationQuery } from '@attendance/validation';

export const studentController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, search } = req.query as unknown as PaginationQuery;
      const { items, total } = await studentService.list({ page, pageSize, search });
      sendSuccess(res, items, 200, { page, pageSize, total });
    } catch (err) {
      next(err);
    }
  },

  /** GET /students/me — the logged-in student's own profile. */
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.refId) {
        throw AppError.forbidden('Only students have a student profile');
      }
      const student = await studentService.getById(req.user.refId);
      sendSuccess(res, student);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.getById(req.params.studentId);
      sendSuccess(res, student);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.create(req.body);
      sendSuccess(res, student, 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.update(req.params.studentId, req.body);
      sendSuccess(res, student);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await studentService.remove(req.params.studentId);
      sendSuccess(res, { studentId: req.params.studentId, deleted: true });
    } catch (err) {
      next(err);
    }
  },
};
