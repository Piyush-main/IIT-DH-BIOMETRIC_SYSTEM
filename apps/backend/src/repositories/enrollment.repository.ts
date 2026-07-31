import { prisma } from '../config/prisma.js';
import type { Prisma } from '@prisma/client';

export const enrollmentRepository = {
  findMany(params: {
    skip: number;
    take: number;
    studentId?: string;
    courseCode?: string;
  }) {
    const where: Prisma.CourseEnrollmentWhereInput = {
      ...(params.studentId && { studentId: params.studentId }),
      ...(params.courseCode && { courseCode: params.courseCode }),
    };

    return Promise.all([
      prisma.courseEnrollment.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { studentId: true, name: true } },
          course: { select: { courseCode: true, courseName: true } },
        },
      }),
      prisma.courseEnrollment.count({ where }),
    ]);
  },

  findById(enrollmentId: bigint) {
    return prisma.courseEnrollment.findUnique({
      where: { enrollmentId },
      include: {
        student: { select: { studentId: true, name: true } },
        course: { select: { courseCode: true, courseName: true } },
      },
    });
  },

  findByStudentAndCourse(studentId: string, courseCode: string) {
    return prisma.courseEnrollment.findUnique({
      where: { uq_student_course: { studentId, courseCode } },
    });
  },

  create(data: Prisma.CourseEnrollmentCreateInput) {
    return prisma.courseEnrollment.create({ data });
  },

  updateStatus(enrollmentId: bigint, status: string) {
    return prisma.courseEnrollment.update({ where: { enrollmentId }, data: { status } });
  },

  remove(enrollmentId: bigint) {
    return prisma.courseEnrollment.delete({ where: { enrollmentId } });
  },
};
