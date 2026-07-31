import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '@attendance/shared-types';

interface NavItem {
  to: string;
  label: string;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  ADMIN: [
    { to: '/admin/departments', label: 'Departments' },
    { to: '/admin/students', label: 'Students' },
    { to: '/admin/professors', label: 'Professors' },
    { to: '/admin/courses', label: 'Courses' },
    { to: '/admin/enrollments', label: 'Enrollments' },
  ],
  PROFESSOR: [
    { to: '/professor/courses', label: 'My Courses' },
    { to: '/professor/attendance', label: 'Mark Attendance' },
  ],
  STUDENT: [
    { to: '/student/profile', label: 'Profile' },
    { to: '/student/attendance', label: 'My Attendance' },
  ],
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navItems = user ? NAV_BY_ROLE[user.role] : [];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <aside className="flex w-60 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">IIT Dharwad</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Attendance Portal</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3 dark:border-slate-700">
          <p className="truncate px-3 text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          <button
            onClick={signOut}
            className="mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
