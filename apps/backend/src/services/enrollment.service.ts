import { enrollmentRepository } from '../repositories/enrollment.repository.js';
import { AppError } from '../utils/AppError.js';
import type { CreateEnrollmentInput } from '@attendance/validation';

export const enrollmentService = {
  async list(params: {
    page: number;
    pageSize: number;
    studentId?: string;
    courseCode?: string;
  }) {
    const skip = (params.page - 1) * params.pageSize;
    const [items, total] = await enrollmentRepository.findMany({
      skip,
      take: params.pageSize,
      studentId: params.studentId,
      courseCode: params.courseCode,
    });
    return { items, total, page: params.page, pageSize: params.pageSize };
  },

  async getById(enrollmentId: bigint) {
    const enrollment = await enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw AppError.notFound(`Enrollment '${enrollmentId}' does not exist`);
    }
    return enrollment;
  },

  async create(input: CreateEnrollmentInput) {
    const existing = await enrollmentRepository.findByStudentAndCourse(
      input.studentId,
      input.courseCode,
    );
    if (existing) {
      throw AppError.conflict(
        `Student '${input.studentId}' is already enrolled in '${input.courseCode}'`,
      );
    }
    return enrollmentRepository.create({
      status: input.status,
      student: { connect: { studentId: input.studentId } },
      course: { connect: { courseCode: input.courseCode } },
    });
  },

  async updateStatus(enrollmentId: bigint, status: string) {
    await this.getById(enrollmentId);
    return enrollmentRepository.updateStatus(enrollmentId, status);
  },

  async remove(enrollmentId: bigint) {
    await this.getById(enrollmentId);
    await enrollmentRepository.remove(enrollmentId);
  },
};
