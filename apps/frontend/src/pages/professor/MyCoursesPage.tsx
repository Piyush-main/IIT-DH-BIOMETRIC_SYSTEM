import { useMyCourses } from '../../api/courses';
import { cardClass, thClass, tdClass } from '../../components/inputStyles';

export default function MyCoursesPage() {
  const { data: courses, isLoading } = useMyCourses();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">My Courses</h1>
      <div className={cardClass}>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : !courses?.length ? (
          <p className="text-sm text-slate-500">You aren't assigned to any courses yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thClass}>Code</th>
                <th className={thClass}>Name</th>
                <th className={thClass}>Dept</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.courseCode}>
                  <td className={tdClass}>{c.courseCode}</td>
                  <td className={tdClass}>{c.courseName}</td>
                  <td className={tdClass}>{c.dept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
