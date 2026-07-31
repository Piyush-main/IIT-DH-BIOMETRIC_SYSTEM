import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import type { AuthenticatedUser, Role } from '@attendance/shared-types';

// Express's Request type doesn't know about `user` by default — augment it
// once here so `req.user` is typed everywhere downstream.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

interface SupabaseJwtPayload {
  email?: string;
  user_metadata?: { full_name?: string; name?: string };
  exp: number;
}

/**
 * Role resolution, exactly as specified:
 *   1. Verify the Supabase JWT signature.
 *   2. If the email is in ADMIN_EMAILS -> Admin.
 *   3. Else look up Students by email -> Student.
 *   4. Else look up Professors by email -> Professor.
 *   5. Else 403 — authenticated with Google, but not provisioned in
 *      any role table, so we don't know what they should see.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw AppError.unauthorized('Missing or malformed Authorization header');
    }
    const token = header.slice('Bearer '.length);

    let payload: SupabaseJwtPayload;
    try {
      payload = jwt.verify(token, env.SUPABASE_JWT_SECRET) as SupabaseJwtPayload;
    } catch {
      throw AppError.unauthorized('Invalid or expired session token');
    }

    const email = payload.email?.toLowerCase();
    if (!email) {
      throw AppError.unauthorized('Token did not contain an email claim');
    }

    const name = payload.user_metadata?.full_name ?? payload.user_metadata?.name ?? email;

    if (env.ADMIN_EMAILS.includes(email)) {
      req.user = { email, role: 'ADMIN' as Role, refId: null, name };
      return next();
    }

    const student = await prisma.student.findUnique({
      where: { email },
      select: { studentId: true, name: true },
    });
    if (student) {
      req.user = { email, role: 'STUDENT' as Role, refId: student.studentId, name: student.name };
      return next();
    }

    const professor = await prisma.professor.findUnique({
      where: { email },
      select: { profId: true, name: true },
    });
    if (professor) {
      req.user = {
        email,
        role: 'PROFESSOR' as Role,
        refId: professor.profId,
        name: professor.name,
      };
      return next();
    }

    throw AppError.forbidden(
      'Your Google account is not registered as a Student, Professor, or Admin for this portal.',
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Route guard factory: `requireRole('ADMIN')` or `requireRole('ADMIN', 'PROFESSOR')`.
 * Must run after `authenticate`.
 */
export function requireRole(...allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }
    if (!allowed.includes(req.user.role)) {
      return next(AppError.forbidden());
    }
    next();
  };
}
