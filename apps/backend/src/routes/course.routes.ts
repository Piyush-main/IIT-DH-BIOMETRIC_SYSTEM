import { Router } from 'express';
import { courseController } from '../controllers/course.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCourseSchema, updateCourseSchema, paginationQuerySchema } from '@attendance/validation';

const router = Router();

// All authenticated roles can browse courses (students need this to see
// what they're enrolled in, professors to see the catalog).
router.get(
  '/',
  authenticate,
  requireRole('ADMIN', 'PROFESSOR', 'STUDENT'),
  validate(paginationQuerySchema, 'query'),
  courseController.list,
);

router.get(
  '/mine',
  authenticate,
  requireRole('PROFESSOR'),
  validate(paginationQuerySchema, 'query'),
  courseController.mine,
);

router.get(
  '/:courseCode',
  authenticate,
  requireRole('ADMIN', 'PROFESSOR', 'STUDENT'),
  courseController.getOne,
);

router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(createCourseSchema),
  courseController.create,
);

router.patch(
  '/:courseCode',
  authenticate,
  requireRole('ADMIN'),
  validate(updateCourseSchema),
  courseController.update,
);

router.delete('/:courseCode', authenticate, requireRole('ADMIN'), courseController.remove);

export default router;
