import { useMyStudentProfile } from '../../api/students';
import { cardClass } from '../../components/inputStyles';

export default function ProfilePage() {
  const { data: student, isLoading } = useMyStudentProfile();

  if (isLoading) return <p className="text-sm text-slate-500">Loading...</p>;
  if (!student) return <p className="text-sm text-slate-500">Profile not found.</p>;

  const rows: [string, string | number][] = [
    ['Student ID', student.studentId],
    ['Name', student.name],
    ['Department', student.dept],
    ['Program', student.program],
    ['Admission year', student.admissionYear],
    ['Email', student.email ?? '—'],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">My Profile</h1>
      <div className={`${cardClass} max-w-md`}>
        <dl className="space-y-3">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
