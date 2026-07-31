import { prisma } from '../config/prisma.js';

/**
 * Repository layer: raw Prisma queries only. No business rules live here —
 * that belongs in the service layer. Keeping this boundary strict is what
 * lets this module become a standalone microservice later without
 * untangling business logic from data access.
 */
export const departmentRepository = {
  findAll() {
    return prisma.department.findMany({ orderBy: { deptName: 'asc' } });
  },

  findByCode(deptCode: string) {
    return prisma.department.findUnique({ where: { deptCode } });
  },

  create(data: { deptCode: string; deptName: string }) {
    return prisma.department.create({ data });
  },

  update(deptCode: string, data: { deptName: string }) {
    return prisma.department.update({ where: { deptCode }, data });
  },

  remove(deptCode: string) {
    return prisma.department.delete({ where: { deptCode } });
  },
};
