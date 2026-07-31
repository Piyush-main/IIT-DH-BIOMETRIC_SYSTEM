import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, unwrap } from './types';
import type { CourseEnrollment } from '@attendance/shared-types';
import type { CreateEnrollmentInput } from '@attendance/validation';

export function useEnrollments(params: { studentId?: string; courseCode?: string } = {}) {
  return useQuery({
    queryKey: ['enrollments', params],
    queryFn: () => unwrap<CourseEnrollment[]>(apiClient.get('/enrollments', { params })),
  });
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ['enrollments', 'me'],
    queryFn: () => unwrap<CourseEnrollment[]>(apiClient.get('/enrollments/me')),
  });
}

export function useCreateEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEnrollmentInput) =>
      unwrap<CourseEnrollment>(apiClient.post('/enrollments', input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enrollments'] }),
  });
}

export function useDeleteEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentId: string) => unwrap(apiClient.delete(`/enrollments/${enrollmentId}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enrollments'] }),
  });
}
