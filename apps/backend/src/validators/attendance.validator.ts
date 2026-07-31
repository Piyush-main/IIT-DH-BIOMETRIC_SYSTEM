import { z } from 'zod';

export const attendanceListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  studentId: z.string().trim().optional(),
  courseCode: z.string().trim().optional(),
  sessionDate: z.string().optional(),
});

export const attendanceIdParamSchema = z.object({
  attendanceId: z
    .string()
    .regex(/^\d+$/, 'attendanceId must be a positive integer')
    .transform((val) => Number(val)),
});
