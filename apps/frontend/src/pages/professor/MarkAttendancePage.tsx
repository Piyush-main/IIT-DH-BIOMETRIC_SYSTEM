import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { markAttendanceSchema, type MarkAttendanceInput } from '@attendance/validation';
import { useMyCourses } from '../../api/courses';
import { useMarkAttendance } from '../../api/attendance';
import { useAuth } from '../../context/AuthContext';
import { FormError } from '../../components/FormError';
import { inputClass, labelClass, buttonClass, cardClass } from '../../components/inputStyles';

/**
 * Manual attendance entry for a professor. This is a fallback/admin path —
 * the primary attendance flow is the ESP32 fingerprint scanner writing
 * directly to Supabase. This form is here for corrections and for courses
 * not yet wired to a physical device.
 */
export default function MarkAttendancePage() {
  const { user } = useAuth();
  const { data: courses } = useMyCourses();
  const markAttendance = useMarkAttendance();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MarkAttendanceInput>({
    resolver: zodResolver(markAttendanceSchema),
    defaultValues: { authorizedBy: user?.refId ?? '' },
  });

  async function onSubmit(values: MarkAttendanceInput) {
    await markAttendance.mutateAsync({ ...values, authorizedBy: user!.refId! });
    reset({ authorizedBy: user?.refId ?? '', courseCode: '', studentId: '', sessionDate: '' });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Mark Attendance</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manual entry, for corrections. You can only mark attendance for courses you teach — the
          server enforces this even if the dropdown below is bypassed.
        </p>
      </div>

      <div className={`${cardClass} max-w-md`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
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
          <div>
            <label className={labelClass}>Student ID</label>
            <input {...register('studentId')} className={inputClass} />
            <FormError message={errors.studentId?.message} />
          </div>
          <div>
            <label className={labelClass}>Session date</label>
            <input {...register('sessionDate')} type="date" className={inputClass} />
            <FormError message={errors.sessionDate?.message} />
          </div>
          <button type="submit" disabled={isSubmitting} className={buttonClass}>
            Mark present
          </button>
        </form>
      </div>
    </div>
  );
}
