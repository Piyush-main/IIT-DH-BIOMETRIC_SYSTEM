import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEnrollmentSchema, type CreateEnrollmentInput } from '@attendance/validation';
import { useCreateEnrollment, useDeleteEnrollment, useEnrollments } from '../../api/enrollments';
import { useStudents } from '../../api/students';
import { useCourses } from '../../api/courses';
import { FormError } from '../../components/FormError';
import { inputClass, labelClass, buttonClass, dangerButtonClass, cardClass, thClass, tdClass } from '../../components/inputStyles';

export default function EnrollmentsPage() {
  const { data: enrollments, isLoading } = useEnrollments();
  const { data: students } = useStudents();
  const { data: courses } = useCourses();
  const createEnrollment = useCreateEnrollment();
  const deleteEnrollment = useDeleteEnrollment();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEnrollmentInput>({
    resolver: zodResolver(createEnrollmentSchema),
    defaultValues: { status: 'active' },
  });

  async function onSubmit(values: CreateEnrollmentInput) {
    await createEnrollment.mutateAsync(values);
    reset({ status: 'active', studentId: '', courseCode: '' });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Enrollments</h1>

      <div className={cardClass}>
        <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Enroll student</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-start gap-4">
          <div className="min-w-[220px]">
            <label className={labelClass}>Student</label>
            <select {...register('studentId')} className={inputClass}>
              <option value="">Select...</option>
              {students?.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.name} ({s.studentId})
                </option>
              ))}
            </select>
            <FormError message={errors.studentId?.message} />
          </div>
          <div className="min-w-[220px]">
            <label className={labelClass}>Course</label>
            <select {...register('courseCode')} className={inputClass}>
              <option value="">Select...</option>
              {courses?.map((c) => (
                <option key={c.courseCode} value={c.courseCode}>
                  {c.courseName} ({c.courseCode})
                </option>
              ))}
            </select>
            <FormError message={errors.courseCode?.message} />
          </div>
          <button type="submit" disabled={isSubmitting} className={`${buttonClass} mt-5`}>
            Enroll
          </button>
        </form>
      </div>

      <div className={cardClass}>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thClass}>Student</th>
                <th className={thClass}>Course</th>
                <th className={thClass}>Status</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody>
              {enrollments?.map((e) => (
                <tr key={e.enrollmentId}>
                  <td className={tdClass}>{e.studentId}</td>
                  <td className={tdClass}>{e.courseCode}</td>
                  <td className={tdClass}>{e.status}</td>
                  <td className={tdClass}>
                    <button
                      onClick={() => deleteEnrollment.mutate(String(e.enrollmentId))}
                      className={dangerButtonClass}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
