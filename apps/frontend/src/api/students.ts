import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, unwrap } from './types';
import type { Student } from '@attendance/shared-types';
import type { CreateStudentInput } from '@attendance/validation';

export function useStudents(params: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () =>
      unwrap<Student[]>(
        apiClient.get('/students', { params: { page: params.page ?? 1, search: params.search } }),
      ),
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStudentInput) => unwrap<Student>(apiClient.post('/students', input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => unwrap(apiClient.delete(`/students/${studentId}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
}

export function useMyStudentProfile() {
  return useQuery({
    queryKey: ['students', 'me'],
    queryFn: () => unwrap<Student>(apiClient.get('/students/me')),
  });
}
