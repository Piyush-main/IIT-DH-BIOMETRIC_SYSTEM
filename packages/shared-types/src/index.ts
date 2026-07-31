/**
 * @attendance/shared-types
 *
 * Single source of truth for domain types shared between the frontend
 * and backend. Keeping these here (rather than duplicating interfaces
 * in each app) means a schema change only needs to be reflected once,
 * and both apps get compile-time errors if they drift out of sync.
 *
 * IMPORTANT: These types describe the *API contract* shape, not the
 * Prisma model shape directly. Prisma models live in apps/backend/prisma
 * and may include internal-only fields (e.g. raw fingerprint bytes)
 * that should never cross the wire to the frontend.
 */

// ---------------------------------------------------------------------------
// Auth / Roles
// ---------------------------------------------------------------------------

export type Role = 'ADMIN' | 'PROFESSOR' | 'STUDENT';

export interface AuthenticatedUser {
  email: string;
  role: Role;
  /** student_id or prof_id, depending on role. Null for Admin. */
  refId: string | null;
  name: string;
}

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

export interface Department {
  deptCode: string;
  deptName: string;
}

export interface Program {
  programCode: string;
  programName: string;
}

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Student {
  studentId: string;
  name: string;
  dept: string;
  program: string;
  admissionYear: number;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Professor {
  profId: string;
  name: string;
  dept: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  courseCode: string;
  courseName: string;
  profId: string;
  dept: string;
  createdAt: string;
  updatedAt: string;
}

export type EnrollmentStatus = 'active' | 'dropped' | 'completed';

export interface CourseEnrollment {
  enrollmentId: number;
  studentId: string;
  courseCode: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  attendanceId: number;
  courseCode: string;
  studentId: string;
  authorizedBy: string;
  recordedAt: string;
  sessionDate: string;
  synced: boolean;
}

export interface AuditLog {
  auditId: number;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// API envelope
// ---------------------------------------------------------------------------

/**
 * Every /api/v1 endpoint responds with this shape so the frontend can
 * handle success/error uniformly via a single Axios interceptor.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}
