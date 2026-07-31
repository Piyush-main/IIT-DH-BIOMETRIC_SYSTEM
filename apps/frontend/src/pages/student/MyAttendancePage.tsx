import { useMyAttendance } from '../../api/attendance';
import { cardClass, thClass, tdClass } from '../../components/inputStyles';

export default function MyAttendancePage() {
  const { data, isLoading } = useMyAttendance();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">My Attendance</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          "Sessions attended" below is a raw count, not a percentage — computing a true attendance
          % requires knowing how many classes were held in total, which isn't tracked yet.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        <>
          <div className={cardClass}>
            <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Sessions attended by course
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={thClass}>Course</th>
                  <th className={thClass}>Sessions attended</th>
                </tr>
              </thead>
              <tbody>
                {data?.summary.map((row) => (
                  <tr key={row.courseCode}>
                    <td className={tdClass}>{row.courseCode}</td>
                    <td className={tdClass}>{row.sessionsAttended}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Recent records
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Course</th>
                  <th className={thClass}>Recorded at</th>
                </tr>
              </thead>
              <tbody>
                {data?.records.map((r) => (
                  <tr key={r.attendanceId}>
                    <td className={tdClass}>{r.sessionDate}</td>
                    <td className={tdClass}>{r.courseCode}</td>
                    <td className={tdClass}>{new Date(r.recordedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
