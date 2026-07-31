import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStudentSchema, type CreateStudentInput } from '@attendance/validation';
import { useCreateStudent, useDeleteStudent, useStudents } from '../../api/students';
import { useDepartments } from '../../api/departments';
import { FormError } from '../../components/FormError';
import { inputClass, labelClass, buttonClass, dangerButtonClass, cardClass, thClass, tdClass } from '../../components/inputStyles';

export default function StudentsPage() {
  const { data: students, isLoading } = useStudents();
  const { data: departments } = useDepartments();
  const createStudent = useCreateStudent();
  const deleteStudent = useDeleteStudent();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentInput>({ resolver: zodResolver(createStudentSchema) });

  async function onSubmit(values: CreateStudentInput) {
    await createStudent.mutateAsync(values);
    reset();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Students</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Note: program (B.Tech / B.Sc. / M.Tech / M.S. Research) must already exist as a seeded
          program code.
        </p>
      </div>

      <div className={cardClass}>
        <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Add student</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Student ID</label>
            <input {...register('studentId')} placeholder="220101001" className={inputClass} />
            <FormError message={errors.studentId?.message} />
          </div>
          <div>
            <label className={labelClass}>Name</label>
            <input {...register('name')} className={inputClass} />
            <FormError message={errors.name?.message} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input {...register('email')} type="email" className={inputClass} />
            <FormError message={errors.email?.message} />
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
          <div>
            <label className={labelClass}>Program code</label>
            <input {...register('program')} placeholder="BT" className={inputClass} />
            <FormError message={errors.program?.message} />
          </div>
          <div>
            <label className={labelClass}>Admission year</label>
            <input
              {...register('admissionYear', { valueAsNumber: true })}
              type="number"
              className={inputClass}
            />
            <FormError message={errors.admissionYear?.message} />
          </div>
          <div className="sm:col-span-3">
            <button type="submit" disabled={isSubmitting} className={buttonClass}>
              Add student
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
                <th className={thClass}>ID</th>
                <th className={thClass}>Name</th>
                <th className={thClass}>Dept</th>
                <th className={thClass}>Program</th>
                <th className={thClass}>Year</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody>
              {students?.map((s) => (
                <tr key={s.studentId}>
                  <td className={tdClass}>{s.studentId}</td>
                  <td className={tdClass}>{s.name}</td>
                  <td className={tdClass}>{s.dept}</td>
                  <td className={tdClass}>{s.program}</td>
                  <td className={tdClass}>{s.admissionYear}</td>
                  <td className={tdClass}>
                    <button
                      onClick={() => deleteStudent.mutate(s.studentId)}
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
