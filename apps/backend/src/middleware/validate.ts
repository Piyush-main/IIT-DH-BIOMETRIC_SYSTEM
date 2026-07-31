import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError.js';

type Target = 'body' | 'query' | 'params';

/**
 * Usage: router.post('/', validate(createStudentSchema), studentController.create)
 *
 * Replaces req[target] with the parsed (and coerced/defaulted) result, so
 * downstream code can trust the shape without re-checking it.
 */
export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(
        AppError.badRequest('Validation failed', result.error.flatten().fieldErrors),
      );
    }
    req[target] = result.data;
    next();
  };
}
