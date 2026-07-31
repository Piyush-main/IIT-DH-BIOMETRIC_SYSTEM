import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';

import LoginPage from './pages/LoginPage';
import HomeRedirect from './pages/HomeRedirect';

import DepartmentsPage from './pages/admin/DepartmentsPage';
import StudentsPage from './pages/admin/StudentsPage';
import ProfessorsPage from './pages/admin/ProfessorsPage';
import CoursesPage from './pages/admin/CoursesPage';
import EnrollmentsPage from './pages/admin/EnrollmentsPage';

import MyCoursesPage from './pages/professor/MyCoursesPage';
import MarkAttendancePage from './pages/professor/MarkAttendancePage';

import ProfilePage from './pages/student/ProfilePage';
import MyAttendancePage from './pages/student/MyAttendancePage';

function withLayout(children: ReactNode) {
  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              {withLayout(<HomeRedirect />)}
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/departments"
          element={<ProtectedRoute allowedRoles={['ADMIN']}>{withLayout(<DepartmentsPage />)}</ProtectedRoute>}
        />
        <Route
          path="/admin/students"
          element={<ProtectedRoute allowedRoles={['ADMIN']}>{withLayout(<StudentsPage />)}</ProtectedRoute>}
        />
        <Route
          path="/admin/professors"
          element={<ProtectedRoute allowedRoles={['ADMIN']}>{withLayout(<ProfessorsPage />)}</ProtectedRoute>}
        />
        <Route
          path="/admin/courses"
          element={<ProtectedRoute allowedRoles={['ADMIN']}>{withLayout(<CoursesPage />)}</ProtectedRoute>}
        />
        <Route
          path="/admin/enrollments"
          element={<ProtectedRoute allowedRoles={['ADMIN']}>{withLayout(<EnrollmentsPage />)}</ProtectedRoute>}
        />

        {/* Professor */}
        <Route
          path="/professor/courses"
          element={<ProtectedRoute allowedRoles={['PROFESSOR']}>{withLayout(<MyCoursesPage />)}</ProtectedRoute>}
        />
        <Route
          path="/professor/attendance"
          element={<ProtectedRoute allowedRoles={['PROFESSOR']}>{withLayout(<MarkAttendancePage />)}</ProtectedRoute>}
        />

        {/* Student */}
        <Route
          path="/student/profile"
          element={<ProtectedRoute allowedRoles={['STUDENT']}>{withLayout(<ProfilePage />)}</ProtectedRoute>}
        />
        <Route
          path="/student/attendance"
          element={<ProtectedRoute allowedRoles={['STUDENT']}>{withLayout(<MyAttendancePage />)}</ProtectedRoute>}
        />
      </Routes>
    </AuthProvider>
  );
}
