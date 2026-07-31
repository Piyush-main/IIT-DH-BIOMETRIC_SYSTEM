import { courseRepository } from '../repositories/course.repository.js';
import { AppError } from '../utils/AppError.js';
import type { CreateCourseInput, UpdateCourseInput } from '@attendance/validation';

export const courseService = {
  async list(params: { page: number; pageSize: number; search?: string; profId?: string }) {
    const skip = (params.page - 1) * params.pageSize;
    const [items, total] = await courseRepository.findMany({
      skip,
      take: params.pageSize,
      search: params.search,
      profId: params.profId,
    });
    return { items, total, page: params.page, pageSize: params.pageSize };
  },

  async getByCode(courseCode: string) {
    const course = await courseRepository.findByCode(courseCode);
    if (!course) {
      throw AppError.notFound(`Course '${courseCode}' does not exist`);
    }
    return course;
  },

  async create(input: CreateCourseInput) {
    const existing = await courseRepository.findByCode(input.courseCode);
    if (existing) {
      throw AppError.conflict(`Course '${input.courseCode}' already exists`);
    }
    return courseRepository.create({
      courseCode: input.courseCode,
      courseName: input.courseName,
      professor: { connect: { profId: input.profId } },
      department: { connect: { deptCode: input.dept } },
    });
  },

  async update(courseCode: string, input: UpdateCourseInput) {
    await this.getByCode(courseCode);
    return courseRepository.update(courseCode, {
      ...(input.courseName !== undefined && { courseName: input.courseName }),
      ...(input.profId !== undefined && { professor: { connect: { profId: input.profId } } }),
      ...(input.dept !== undefined && { department: { connect: { deptCode: input.dept } } }),
    });
  },

  async remove(courseCode: string) {
    await this.getByCode(courseCode);
    // Hard delete — blocked by attendance/enrollment history via FK RESTRICT.
    await courseRepository.remove(courseCode);
  },
};
