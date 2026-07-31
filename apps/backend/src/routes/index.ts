import { Router } from 'express';
import departmentRoutes from './department.routes.js';
import studentRoutes from './student.routes.js';
import professorRoutes from './professor.routes.js';
import courseRoutes from './course.routes.js';
import enrollmentRoutes from './enrollment.routes.js';
import attendanceRoutes from './attendance.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/students', studentRoutes);
router.use('/professors', professorRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/attendance', attendanceRoutes);

export default router;
