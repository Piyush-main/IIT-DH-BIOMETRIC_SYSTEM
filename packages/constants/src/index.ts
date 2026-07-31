/**
 * @attendance/constants
 *
 * Values that must stay identical across frontend and backend but rarely
 * change (department codes, API version prefix, role names). Pulling
 * these from one file avoids a class of bugs where the frontend filters
 * by 'Admin' and the backend checks for 'ADMIN'.
 */

export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

export const ROLES = {
  ADMIN: 'ADMIN',
  PROFESSOR: 'PROFESSOR',
  STUDENT: 'STUDENT',
} as const;

/**
 * Mirrors the `departments` table seeded in Supabase. This is a
 * convenience copy for places that need synchronous access (e.g. a
 * frontend <select> before data has loaded) — the database remains the
 * source of truth and the backend never validates against this list
 * alone; see packages/validation for the schema-level check.
 */
export const DEPARTMENTS = [
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'CH', name: 'Chemical Engineering' },
  { code: 'CS', name: 'Computer Science and Engineering' },
  { code: 'EC', name: 'Electronics and Communication Engineering' },
  { code: 'EE', name: 'Electronics and Electrical Engineering' },
  { code: 'EP', name: 'Engineering Physics' },
  { code: 'IS', name: 'Interdisciplinary Sciences' },
  { code: 'MC', name: 'Mathematics and Computing' },
  { code: 'ME', name: 'Mechanical Engineering' },
] as const;

export const PROGRAMS = [
  { code: 'BT', name: 'B.Tech' },
  { code: 'BM', name: 'B.Sc.' },
  { code: 'MT', name: 'M.Tech' },
  { code: 'MR', name: 'M.S. Research' },
] as const;

export const ENROLLMENT_STATUSES = ['active', 'dropped', 'completed'] as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
