import { Router } from 'express';
import { attendanceController } from '../controllers/attendance.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { markAttendanceSchema } from '@attendance/validation';
import { attendanceListQuerySchema, attendanceIdParamSchema } from '../validators/attendance.validator.js';

const router = Router();

router.get(
  '/me',
  authenticate,
  requireRole('STUDENT'),
  validate(attendanceListQuerySchema, 'query'),
  attendanceController.mine,
);

router.get(
  '/',
  authenticate,
  requireRole('ADMIN', 'PROFESSOR'),
  validate(attendanceListQuerySchema, 'query'),
  attendanceController.list,
);

// Professors mark attendance for their own courses; Admin can mark for any
// course. The ownership check itself lives in attendance.service.ts.
router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'PROFESSOR'),
  validate(markAttendanceSchema),
  attendanceController.mark,
);

router.delete(
  '/:attendanceId',
  authenticate,
  requireRole('ADMIN'),
  validate(attendanceIdParamSchema, 'params'),
  attendanceController.remove,
);

export default router;
