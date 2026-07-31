import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, unwrap } from './types';
import type { Professor } from '@attendance/shared-types';
import type { CreateProfessorInput } from '@attendance/validation';

export function useProfessors(params: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['professors', params],
    queryFn: () =>
      unwrap<Professor[]>(
        apiClient.get('/professors', { params: { page: params.page ?? 1, search: params.search } }),
      ),
  });
}

export function useCreateProfessor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProfessorInput) =>
      unwrap<Professor>(apiClient.post('/professors', input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['professors'] }),
  });
}

export function useDeleteProfessor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profId: string) => unwrap(apiClient.delete(`/professors/${profId}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['professors'] }),
  });
}

export function useMyProfessorProfile() {
  return useQuery({
    queryKey: ['professors', 'me'],
    queryFn: () => unwrap<Professor>(apiClient.get('/professors/me')),
  });
}
