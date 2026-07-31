import { prisma } from '../config/prisma.js';
import type { Prisma } from '@prisma/client';

// Never select `template` (fingerprint bytes) in list/get queries unless
// explicitly needed — keeps list responses light and avoids leaking
// biometric data to any endpoint that doesn't need it.
const publicSelect = {
  studentId: true,
  name: true,
  dept: true,
  program: true,
  admissionYear: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.StudentSelect;

export const studentRepository = {
  findMany(params: { skip: number; take: number; search?: string }) {
    const where: Prisma.StudentWhereInput = params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: 'insensitive' } },
            { studentId: { contains: params.search, mode: 'insensitive' } },
            { email: { contains: params.search, mode: 'insensitive' } },
          ],
        }
      : {};

    return Promise.all([
      prisma.student.findMany({
        where,
        select: publicSelect,
        skip: params.skip,
        take: params.take,
        orderBy: { name: 'asc' },
      }),
      prisma.student.count({ where }),
    ]);
  },

  findById(studentId: string) {
    return prisma.student.findUnique({ where: { studentId }, select: publicSelect });
  },

  findByIdRaw(studentId: string) {
    // Includes `template` — only for internal use (e.g. Pi sync service),
    // never returned directly from an HTTP controller.
    return prisma.student.findUnique({ where: { studentId } });
  },

  create(data: Prisma.StudentCreateInput) {
    return prisma.student.create({ data, select: publicSelect });
  },

  update(studentId: string, data: Prisma.StudentUpdateInput) {
    return prisma.student.update({ where: { studentId }, data, select: publicSelect });
  },

  remove(studentId: string) {
    return prisma.student.delete({ where: { studentId } });
  },
};
