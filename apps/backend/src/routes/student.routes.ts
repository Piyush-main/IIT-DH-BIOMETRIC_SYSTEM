import { Router } from 'express';
import { studentController } from '../controllers/student.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createStudentSchema,
  updateStudentSchema,
  paginationQuerySchema,
} from '@attendance/validation';

const router = Router();

// A student's own profile — must be registered BEFORE '/:studentId' or
// Express would try to look up a student literally named "me".
router.get('/me', authenticate, requireRole('STUDENT'), studentController.me);

router.get(
  '/',
  authenticate,
  requireRole('ADMIN', 'PROFESSOR'),
  validate(paginationQuerySchema, 'query'),
  studentController.list,
);

router.get('/:studentId', authenticate, requireRole('ADMIN', 'PROFESSOR'), studentController.getOne);

router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(createStudentSchema),
  studentController.create,
);

router.patch(
  '/:studentId',
  authenticate,
  requireRole('ADMIN'),
  validate(updateStudentSchema),
  studentController.update,
);

router.delete('/:studentId', authenticate, requireRole('ADMIN'), studentController.remove);

export default router;
