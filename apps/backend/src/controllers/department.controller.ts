import type { NextFunction, Request, Response } from 'express';
import { departmentService } from '../services/department.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const departmentController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await departmentService.list();
      sendSuccess(res, departments);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const dept = await departmentService.getByCode(req.params.deptCode);
      sendSuccess(res, dept);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dept = await departmentService.create(req.body);
      sendSuccess(res, dept, 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dept = await departmentService.update(req.params.deptCode, req.body);
      sendSuccess(res, dept);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await departmentService.remove(req.params.deptCode);
      sendSuccess(res, { deptCode: req.params.deptCode, deleted: true });
    } catch (err) {
      next(err);
    }
  },
};
