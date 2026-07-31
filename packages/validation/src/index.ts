/**
 * @attendance/validation
 *
 * Shared Zod schemas. These are used in two places:
 *   1. Backend: as Express middleware (`validate(schema)`) guarding every
 *      write endpoint before it reaches a controller.
 *   2. Frontend: as the resolver for react-hook-form, so client-side
 *      validation errors match server-side ones exactly.
 *
 * Keeping ONE definition means "email must be valid" can never drift
 * between what the form allows and what the API accepts.
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export const deptCodeSchema = z
  .string()
  .trim()
  .min(2, 'Department code is required')
  .max(4)
  .toUpperCase();

export const programCodeSchema = z.string().trim().min(2).max(4).toUpperCase();

export const emailSchema = z.string().trim().email('Must be a valid email address');

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------

export const createStudentSchema = z.object({
  studentId: z.string().trim().min(1, 'Student ID is required'),
  name: z.string().trim().min(1, 'Name is required'),
  dept: deptCodeSchema,
  program: programCodeSchema,
  admissionYear: z
    .number()
    .int()
    .min(2000, 'Admission year looks too old')
    .max(new Date().getFullYear() + 1, 'Admission year cannot be in the future'),
  email: emailSchema.optional().nullable(),
});

export const updateStudentSchema = createStudentSchema.partial().omit({ studentId: true });

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

// ---------------------------------------------------------------------------
// Professors
// ---------------------------------------------------------------------------

export const createProfessorSchema = z.object({
  profId: z.string().trim().min(1, 'Professor ID is required'),
  name: z.string().trim().min(1, 'Name is required'),
  dept: deptCodeSchema,
  email: emailSchema.optional().nullable(),
});

export const updateProfessorSchema = createProfessorSchema.partial().omit({ profId: true });

export type CreateProfessorInput = z.infer<typeof createProfessorSchema>;
export type UpdateProfessorInput = z.infer<typeof updateProfessorSchema>;

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export const createCourseSchema = z.object({
  courseCode: z.string().trim().min(1, 'Course code is required'),
  courseName: z.string().trim().min(1, 'Course name is required'),
  profId: z.string().trim().min(1, 'A course must have an assigned professor'),
  dept: deptCodeSchema,
});

export const updateCourseSchema = createCourseSchema.partial().omit({ courseCode: true });

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

// ---------------------------------------------------------------------------
// Enrollments
// ---------------------------------------------------------------------------

export const enrollmentStatusSchema = z.enum(['active', 'dropped', 'completed']);

export const createEnrollmentSchema = z.object({
  studentId: z.string().trim().min(1),
  courseCode: z.string().trim().min(1),
  status: enrollmentStatusSchema.default('active'),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

export const markAttendanceSchema = z.object({
  courseCode: z.string().trim().min(1),
  studentId: z.string().trim().min(1),
  authorizedBy: z.string().trim().min(1, 'Attendance must be authorized by a professor'),
  sessionDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: 'sessionDate must be a valid date',
  }),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;

// ---------------------------------------------------------------------------
// Pagination (shared query-param schema for all list endpoints)
// ---------------------------------------------------------------------------

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
