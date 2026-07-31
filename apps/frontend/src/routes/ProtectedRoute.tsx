import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '@attendance/shared-types';

interface ProtectedRouteProps {
  children: ReactNode;
  /** If omitted, any authenticated + provisioned user is allowed through. */
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session, user, loading, authError } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (authError || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-medium text-slate-800">Access not provisioned</p>
        <p className="max-w-sm text-sm text-slate-500">
          Your Google account signed in successfully, but isn't registered as a Student,
          Professor, or Admin on this portal. Contact your department admin.
        </p>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
