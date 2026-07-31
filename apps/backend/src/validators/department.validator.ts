import { z } from 'zod';
import { deptCodeSchema } from '@attendance/validation';

export const createDepartmentSchema = z.object({
  deptCode: deptCodeSchema,
  deptName: z.string().trim().min(1, 'Department name is required'),
});

export const updateDepartmentSchema = z.object({
  deptName: z.string().trim().min(1, 'Department name is required'),
});
