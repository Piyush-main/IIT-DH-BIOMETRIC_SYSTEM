import { Router } from 'express';
import { professorController } from '../controllers/professor.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createProfessorSchema,
  updateProfessorSchema,
  paginationQuerySchema,
} from '@attendance/validation';

const router = Router();

router.get('/me', authenticate, requireRole('PROFESSOR'), professorController.me);

router.get(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(paginationQuerySchema, 'query'),
  professorController.list,
);

router.get('/:profId', authenticate, requireRole('ADMIN'), professorController.getOne);

router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(createProfessorSchema),
  professorController.create,
);

router.patch(
  '/:profId',
  authenticate,
  requireRole('ADMIN'),
  validate(updateProfessorSchema),
  professorController.update,
);

router.delete('/:profId', authenticate, requireRole('ADMIN'), professorController.remove);

export default router;
