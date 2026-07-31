import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProfessorSchema, type CreateProfessorInput } from '@attendance/validation';
import { useCreateProfessor, useDeleteProfessor, useProfessors } from '../../api/professors';
import { useDepartments } from '../../api/departments';
import { FormError } from '../../components/FormError';
import { inputClass, labelClass, buttonClass, dangerButtonClass, cardClass, thClass, tdClass } from '../../components/inputStyles';

export default function ProfessorsPage() {
  const { data: professors, isLoading } = useProfessors();
  const { data: departments } = useDepartments();
  const createProfessor = useCreateProfessor();
  const deleteProfessor = useDeleteProfessor();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProfessorInput>({ resolver: zodResolver(createProfessorSchema) });

  async function onSubmit(values: CreateProfessorInput) {
    await createProfessor.mutateAsync(values);
    reset();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Professors</h1>
      </div>

      <div className={cardClass}>
        <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Add professor</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className={labelClass}>Professor ID</label>
            <input {...register('profId')} placeholder="P001" className={inputClass} />
            <FormError message={errors.profId?.message} />
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
          <div className="sm:col-span-4">
            <button type="submit" disabled={isSubmitting} className={buttonClass}>
              Add professor
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
                <th className={thClass}>Email</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody>
              {professors?.map((p) => (
                <tr key={p.profId}>
                  <td className={tdClass}>{p.profId}</td>
                  <td className={tdClass}>{p.name}</td>
                  <td className={tdClass}>{p.dept}</td>
                  <td className={tdClass}>{p.email}</td>
                  <td className={tdClass}>
                    <button
                      onClick={() => deleteProfessor.mutate(p.profId)}
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
