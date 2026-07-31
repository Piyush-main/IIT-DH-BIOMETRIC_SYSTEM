import { Router } from 'express';
import { departmentController } from '../controllers/department.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createDepartmentSchema, updateDepartmentSchema } from '../validators/department.validator.js';

const router = Router();

// Any authenticated role can read the department list (needed for dropdowns
// on Student/Professor forms), but only Admin can mutate it.
router.get('/', authenticate, departmentController.list);
router.get('/:deptCode', authenticate, departmentController.getOne);

router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(createDepartmentSchema),
  departmentController.create,
);

router.patch(
  '/:deptCode',
  authenticate,
  requireRole('ADMIN'),
  validate(updateDepartmentSchema),
  departmentController.update,
);

router.delete('/:deptCode', authenticate, requireRole('ADMIN'), departmentController.remove);

export default router;
