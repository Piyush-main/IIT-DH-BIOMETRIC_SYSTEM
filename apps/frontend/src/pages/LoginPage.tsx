import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { session, loading, signInWithGoogle } = useAuth();

  if (!loading && session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          IIT Dharwad Attendance Portal
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in with your IIT Dharwad Google account.
        </p>
        <button
          onClick={signInWithGoogle}
          className="mt-6 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
