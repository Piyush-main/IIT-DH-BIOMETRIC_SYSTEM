import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateDepartment, useDeleteDepartment, useDepartments } from '../../api/departments';
import { FormError } from '../../components/FormError';
import { inputClass, labelClass, buttonClass, dangerButtonClass, cardClass, thClass, tdClass } from '../../components/inputStyles';

const schema = z.object({
  deptCode: z.string().trim().min(2).max(4).toUpperCase(),
  deptName: z.string().trim().min(1, 'Department name is required'),
});
type FormValues = z.infer<typeof schema>;

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const createDept = useCreateDepartment();
  const deleteDept = useDeleteDepartment();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    await createDept.mutateAsync(values);
    reset();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Departments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage the department reference list used across students, professors, and courses.
        </p>
      </div>

      <div className={cardClass}>
        <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Add department</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-start gap-4">
          <div className="w-32">
            <label className={labelClass}>Code</label>
            <input {...register('deptCode')} placeholder="CS" className={inputClass} />
            <FormError message={errors.deptCode?.message} />
          </div>
          <div className="flex-1 min-w-[240px]">
            <label className={labelClass}>Name</label>
            <input {...register('deptName')} placeholder="Computer Science and Engineering" className={inputClass} />
            <FormError message={errors.deptName?.message} />
          </div>
          <button type="submit" disabled={isSubmitting} className={`${buttonClass} mt-5`}>
            Add
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
                <th className={thClass}>Code</th>
                <th className={thClass}>Name</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody>
              {departments?.map((d) => (
                <tr key={d.deptCode}>
                  <td className={tdClass}>{d.deptCode}</td>
                  <td className={tdClass}>{d.deptName}</td>
                  <td className={tdClass}>
                    <button
                      onClick={() => deleteDept.mutate(d.deptCode)}
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
