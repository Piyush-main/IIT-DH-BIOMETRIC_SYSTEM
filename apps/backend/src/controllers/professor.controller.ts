import type { NextFunction, Request, Response } from 'express';
import { professorService } from '../services/professor.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import type { PaginationQuery } from '@attendance/validation';

export const professorController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, search } = req.query as unknown as PaginationQuery;
      const { items, total } = await professorService.list({ page, pageSize, search });
      sendSuccess(res, items, 200, { page, pageSize, total });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.refId) {
        throw AppError.forbidden('Only professors have a professor profile');
      }
      const prof = await professorService.getById(req.user.refId);
      sendSuccess(res, prof);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const prof = await professorService.getById(req.params.profId);
      sendSuccess(res, prof);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const prof = await professorService.create(req.body);
      sendSuccess(res, prof, 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const prof = await professorService.update(req.params.profId, req.body);
      sendSuccess(res, prof);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await professorService.remove(req.params.profId);
      sendSuccess(res, { profId: req.params.profId, deleted: true });
    } catch (err) {
      next(err);
    }
  },
};
