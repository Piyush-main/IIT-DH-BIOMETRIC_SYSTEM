import { departmentRepository } from '../repositories/department.repository.js';
import { AppError } from '../utils/AppError.js';

export const departmentService = {
  async list() {
    return departmentRepository.findAll();
  },

  async getByCode(deptCode: string) {
    const dept = await departmentRepository.findByCode(deptCode);
    if (!dept) {
      throw AppError.notFound(`Department '${deptCode}' does not exist`);
    }
    return dept;
  },

  async create(input: { deptCode: string; deptName: string }) {
    const existing = await departmentRepository.findByCode(input.deptCode);
    if (existing) {
      throw AppError.conflict(`Department '${input.deptCode}' already exists`);
    }
    return departmentRepository.create(input);
  },

  async update(deptCode: string, input: { deptName: string }) {
    await this.getByCode(deptCode); // throws 404 if missing
    return departmentRepository.update(deptCode, input);
  },

  async remove(deptCode: string) {
    await this.getByCode(deptCode); // throws 404 if missing
    // Hard delete, per project decision. If students/courses still
    // reference this dept, Prisma raises P2003 and errorHandler.ts
    // converts that into a clean 409 for the client.
    await departmentRepository.remove(deptCode);
  },
};
