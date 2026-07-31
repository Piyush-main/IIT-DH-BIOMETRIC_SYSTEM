import { z } from 'zod';

// Route params arrive as strings; enrollment_id is a BIGSERIAL in Postgres,
// so we parse to BigInt here rather than in the controller.
export const enrollmentIdParamSchema = z.object({
  enrollmentId: z
    .string()
    .regex(/^\d+$/, 'enrollmentId must be a positive integer')
    .transform((val) => BigInt(val)),
});

export const updateEnrollmentStatusSchema = z.object({
  status: z.enum(['active', 'dropped', 'completed']),
});

export const enrollmentListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  studentId: z.string().trim().optional(),
  courseCode: z.string().trim().optional(),
});
