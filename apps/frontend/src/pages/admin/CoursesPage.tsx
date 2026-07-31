import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCourseSchema, type CreateCourseInput } from '@attendance/validation';
import { useCourses, useCreateCourse, useDeleteCourse } from '../../api/courses';
import { useProfessors } from '../../api/professors';
import { useDepartments } from '../../api/departments';
import { FormError } from '../../components/FormError';
import { inputClass, labelClass, buttonClass, dangerButtonClass, cardClass, thClass, tdClass } from '../../components/inputStyles';

export default function CoursesPage() {
  const { data: courses, isLoading } = useCourses();
  const { data: professors } = useProfessors();
  const { data: departments } = useDepartments();
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseInput>({ resolver: zodResolver(createCourseSchema) });

  async function onSubmit(values: CreateCourseInput) {
    await createCourse.mutateAsync(values);
    reset();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Courses</h1>

      <div className={cardClass}>
        <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Add course</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className={labelClass}>Course code</label>
            <input {...register('courseCode')} placeholder="CS201" className={inputClass} />
            <FormError message={errors.courseCode?.message} />
          </div>
          <div>
            <label className={labelClass}>Course name</label>
            <input {...register('courseName')} className={inputClass} />
            <FormError message={errors.courseName?.message} />
          </div>
          <div>
            <label className={labelClass}>Professor</label>
            <select {...register('profId')} className={inputClass}>
              <option value="">Select...</option>
              {professors?.map((p) => (
                <option key={p.profId} value={p.profId}>
                  {p.name} ({p.profId})
                </option>
              ))}
            </select>
            <FormError message={errors.profId?.message} />
          </div>
          <div>
            <label className={labelClass}>Department</label>
            <select {...register('dept')} className={inputClass}>
              <option value="">Select...</option>
              {departments?.map((d) => (
                <option key={d.deptCode} value={d.deptCode}>
                  {d.deptCode}
                </option>
              ))}
            </select>
            <FormError message={errors.dept?.message} />
          </div>
          <div className="sm:col-span-4">
            <button type="submit" disabled={isSubmitting} className={buttonClass}>
              Add course
            </button>
          </div>
        </form>
      </div>

      <div className={cardClass}>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thClass}>Code</th>
                <th className={thClass}>Name</th>
                <th className={thClass}>Professor</th>
                <th className={thClass}>Dept</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((c) => (
                <tr key={c.courseCode}>
                  <td className={tdClass}>{c.courseCode}</td>
                  <td className={tdClass}>{c.courseName}</td>
                  <td className={tdClass}>{c.profId}</td>
                  <td className={tdClass}>{c.dept}</td>
                  <td className={tdClass}>
                    <button
                      onClick={() => deleteCourse.mutate(c.courseCode)}
                      className={dangerButtonClass}
                    >
                      Delete
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
