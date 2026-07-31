import { prisma } from '../config/prisma.js';
import type { Prisma } from '@prisma/client';

export const courseRepository = {
  findMany(params: { skip: number; take: number; search?: string; profId?: string }) {
    const where: Prisma.CourseWhereInput = {
      ...(params.search && {
        OR: [
          { courseName: { contains: params.search, mode: 'insensitive' } },
          { courseCode: { contains: params.search, mode: 'insensitive' } },
        ],
      }),
      ...(params.profId && { profId: params.profId }),
    };

    return Promise.all([
      prisma.course.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { courseName: 'asc' },
        include: { professor: { select: { profId: true, name: true } } },
      }),
      prisma.course.count({ where }),
    ]);
  },

  findByCode(courseCode: string) {
    return prisma.course.findUnique({
      where: { courseCode },
      include: { professor: { select: { profId: true, name: true } } },
    });
  },

  create(data: Prisma.CourseCreateInput) {
    return prisma.course.create({ data });
  },

  update(courseCode: string, data: Prisma.CourseUpdateInput) {
    return prisma.course.update({ where: { courseCode }, data });
  },

  remove(courseCode: string) {
    return prisma.course.delete({ where: { courseCode } });
  },
};
