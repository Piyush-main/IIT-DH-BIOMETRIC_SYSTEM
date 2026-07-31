import { prisma } from '../config/prisma.js';
import type { Prisma } from '@prisma/client';

export const attendanceRepository = {
  findMany(params: {
    skip: number;
    take: number;
    studentId?: string;
    courseCode?: string;
    sessionDate?: Date;
  }) {
    const where: Prisma.AttendanceWhereInput = {
      ...(params.studentId && { studentId: params.studentId }),
      ...(params.courseCode && { courseCode: params.courseCode }),
      ...(params.sessionDate && { sessionDate: params.sessionDate }),
    };

    return Promise.all([
      prisma.attendance.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { sessionDate: 'desc' },
        include: {
          student: { select: { studentId: true, name: true } },
          course: { select: { courseCode: true, courseName: true } },
        },
      }),
      prisma.attendance.count({ where }),
    ]);
  },

  findExisting(courseCode: string, studentId: string, sessionDate: Date) {
    return prisma.attendance.findFirst({ where: { courseCode, studentId, sessionDate } });
  },

  create(data: Prisma.AttendanceCreateInput) {
    return prisma.attendance.create({ data });
  },

  remove(attendanceId: number) {
    return prisma.attendance.delete({ where: { attendanceId } });
  },

  /**
   * Sessions attended per course for a student. NOTE: this counts distinct
   * dates on which the student has an attendance record — it is "sessions
   * attended", not "attendance %". A true percentage needs a scheduled-
   * sessions table (how many classes were HELD) which doesn't exist yet;
   * see docs/README.md for that as a future addition.
   */
  countByStudentGroupedByCourse(studentId: string) {
    return prisma.attendance.groupBy({
      by: ['courseCode'],
      where: { studentId },
      _count: { attendanceId: true },
    });
  },
};
