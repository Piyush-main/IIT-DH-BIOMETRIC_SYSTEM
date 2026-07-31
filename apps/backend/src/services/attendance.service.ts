import { attendanceRepository } from '../repositories/attendance.repository.js';
import { courseRepository } from '../repositories/course.repository.js';
import { AppError } from '../utils/AppError.js';
import type { MarkAttendanceInput } from '@attendance/validation';

export const attendanceService = {
  async list(params: {
    page: number;
    pageSize: number;
    studentId?: string;
    courseCode?: string;
    sessionDate?: string;
  }) {
    const skip = (params.page - 1) * params.pageSize;
    const [items, total] = await attendanceRepository.findMany({
      skip,
      take: params.pageSize,
      studentId: params.studentId,
      courseCode: params.courseCode,
      sessionDate: params.sessionDate ? new Date(params.sessionDate) : undefined,
    });
    return { items, total, page: params.page, pageSize: params.pageSize };
  },

  /**
   * `actor` describes who is calling this — used to enforce the business
   * rule that a professor may only mark attendance for a course they
   * themselves teach. Admin bypasses this check entirely.
   */
  async mark(
    input: MarkAttendanceInput,
    actor: { role: 'ADMIN' | 'PROFESSOR' | 'STUDENT'; profId: string | null },
  ) {
    const course = await courseRepository.findByCode(input.courseCode);
    if (!course) {
      throw AppError.notFound(`Course '${input.courseCode}' does not exist`);
    }

    if (actor.role === 'PROFESSOR' && course.profId !== actor.profId) {
      throw AppError.forbidden('You can only mark attendance for courses you teach');
    }

    const sessionDate = new Date(input.sessionDate);

    const existing = await attendanceRepository.findExisting(
      input.courseCode,
      input.studentId,
      sessionDate,
    );
    if (existing) {
      throw AppError.conflict(
        `Attendance for student '${input.studentId}' in '${input.courseCode}' on ${input.sessionDate} is already recorded`,
      );
    }

    return attendanceRepository.create({
      course: { connect: { courseCode: input.courseCode } },
      student: { connect: { studentId: input.studentId } },
      authorizer: { connect: { profId: input.authorizedBy } },
      sessionDate,
    });
  },

  async remove(attendanceId: number) {
    await attendanceRepository.remove(attendanceId);
  },

  async summaryForStudent(studentId: string) {
    const grouped = await attendanceRepository.countByStudentGroupedByCourse(studentId);
    return grouped.map((g: { courseCode: string; _count: { attendanceId: number } }) => ({
      courseCode: g.courseCode,
      sessionsAttended: g._count.attendanceId,
    }));
  },
};
