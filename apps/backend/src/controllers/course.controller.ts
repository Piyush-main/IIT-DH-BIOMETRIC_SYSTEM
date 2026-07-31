import type { NextFunction, Request, Response } from 'express';
import { courseService } from '../services/course.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import type { PaginationQuery } from '@attendance/validation';

export const courseController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, search } = req.query as unknown as PaginationQuery;
      const { items, total } = await courseService.list({ page, pageSize, search });
      sendSuccess(res, items, 200, { page, pageSize, total });
    } catch (err) {
      next(err);
    }
  },

  /** GET /courses/mine — courses taught by the logged-in professor. */
  async mine(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, search } = req.query as unknown as PaginationQuery;
      const { items, total } = await courseService.list({
        page,
        pageSize,
        search,
        profId: req.user!.refId!,
      });
      sendSuccess(res, items, 200, { page, pageSize, total });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await courseService.getByCode(req.params.courseCode);
      sendSuccess(res, course);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await courseService.create(req.body);
      sendSuccess(res, course, 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await courseService.update(req.params.courseCode, req.body);
      sendSuccess(res, course);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await courseService.remove(req.params.courseCode);
      sendSuccess(res, { courseCode: req.params.courseCode, deleted: true });
    } catch (err) {
      next(err);
    }
  },
};
