import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, unwrap } from './types';
import type { Department } from '@attendance/shared-types';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => unwrap<Department[]>(apiClient.get('/departments')),
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { deptCode: string; deptName: string }) =>
      unwrap<Department>(apiClient.post('/departments', input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deptCode: string) => unwrap(apiClient.delete(`/departments/${deptCode}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}
