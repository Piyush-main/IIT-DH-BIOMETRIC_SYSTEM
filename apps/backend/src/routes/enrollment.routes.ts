import { Router } from 'express';
import { enrollmentController } from '../controllers/enrollment.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createEnrollmentSchema } from '@attendance/validation';
import {
  enrollmentIdParamSchema,
  updateEnrollmentStatusSchema,
  enrollmentListQuerySchema,
} from '../validators/enrollment.validator.js';

const router = Router();

router.get('/me', authenticate, requireRole('STUDENT'), enrollmentController.mine);

router.get(
  '/',
  authenticate,
  requireRole('ADMIN', 'PROFESSOR'),
  validate(enrollmentListQuerySchema, 'query'),
  enrollmentController.list,
);

router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(createEnrollmentSchema),
  enrollmentController.create,
);

router.patch(
  '/:enrollmentId',
  authenticate,
  requireRole('ADMIN'),
  validate(enrollmentIdParamSchema, 'params'),
  validate(updateEnrollmentStatusSchema),
  enrollmentController.updateStatus,
);

router.delete(
  '/:enrollmentId',
  authenticate,
  requireRole('ADMIN'),
  validate(enrollmentIdParamSchema, 'params'),
  enrollmentController.remove,
);

export default router;
