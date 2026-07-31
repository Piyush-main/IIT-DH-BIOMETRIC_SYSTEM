import { studentRepository } from '../repositories/student.repository.js';
import { AppError } from '../utils/AppError.js';
import type { CreateStudentInput, UpdateStudentInput } from '@attendance/validation';

const DEFAULT_PAGE_SIZE = 20;

export const studentService = {
  async list(params: { page: number; pageSize: number; search?: string }) {
    const skip = (params.page - 1) * params.pageSize;
    const [items, total] = await studentRepository.findMany({
      skip,
      take: params.pageSize,
      search: params.search,
    });
    return { items, total, page: params.page, pageSize: params.pageSize };
  },

  async getById(studentId: string) {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw AppError.notFound(`Student '${studentId}' does not exist`);
    }
    return student;
  },

  async create(input: CreateStudentInput) {
    const existing = await studentRepository.findById(input.studentId);
    if (existing) {
      throw AppError.conflict(`Student '${input.studentId}' already exists`);
    }
    return studentRepository.create({
      studentId: input.studentId,
      name: input.name,
      admissionYear: input.admissionYear,
      email: input.email ?? null,
      department: { connect: { deptCode: input.dept } },
      programRef: { connect: { programCode: input.program } },
    });
  },

  async update(studentId: string, input: UpdateStudentInput) {
    await this.getById(studentId); // 404 if missing

    return studentRepository.update(studentId, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.admissionYear !== undefined && { admissionYear: input.admissionYear }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.dept !== undefined && { department: { connect: { deptCode: input.dept } } }),
      ...(input.program !== undefined && {
        programRef: { connect: { programCode: input.program } },
      }),
    });
  },

  async remove(studentId: string) {
    await this.getById(studentId); // 404 if missing
    // Hard delete — fails with a 409 (via errorHandler's P2003 branch) if
    // the student has attendance or enrollment history. That's intentional.
    await studentRepository.remove(studentId);
  },
};

export { DEFAULT_PAGE_SIZE };
