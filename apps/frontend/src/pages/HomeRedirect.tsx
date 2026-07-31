import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HOME_BY_ROLE = {
  ADMIN: '/admin/departments',
  PROFESSOR: '/professor/courses',
  STUDENT: '/student/profile',
} as const;

/** Root "/" route — sends a logged-in user to the right default page for their role. */
export default function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return null; // ProtectedRoute above this handles the loading/redirect states
  return <Navigate to={HOME_BY_ROLE[user.role]} replace />;
}
