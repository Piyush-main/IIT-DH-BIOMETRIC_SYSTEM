import { prisma } from '../config/prisma.js';
import type { Prisma } from '@prisma/client';

const publicSelect = {
  profId: true,
  name: true,
  dept: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProfessorSelect;

export const professorRepository = {
  findMany(params: { skip: number; take: number; search?: string }) {
    const where: Prisma.ProfessorWhereInput = params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: 'insensitive' } },
            { profId: { contains: params.search, mode: 'insensitive' } },
            { email: { contains: params.search, mode: 'insensitive' } },
          ],
        }
      : {};

    return Promise.all([
      prisma.professor.findMany({
        where,
        select: publicSelect,
        skip: params.skip,
        take: params.take,
        orderBy: { name: 'asc' },
      }),
      prisma.professor.count({ where }),
    ]);
  },

  findById(profId: string) {
    return prisma.professor.findUnique({ where: { profId }, select: publicSelect });
  },

  create(data: Prisma.ProfessorCreateInput) {
    return prisma.professor.create({ data, select: publicSelect });
  },

  update(profId: string, data: Prisma.ProfessorUpdateInput) {
    return prisma.professor.update({ where: { profId }, data, select: publicSelect });
  },

  remove(profId: string) {
    return prisma.professor.delete({ where: { profId } });
  },
};
