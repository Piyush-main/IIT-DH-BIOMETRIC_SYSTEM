import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, unwrap } from './types';
import type { Course } from '@attendance/shared-types';
import type { CreateCourseInput } from '@attendance/validation';

export function useCourses(params: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () =>
      unwrap<Course[]>(
        apiClient.get('/courses', { params: { page: params.page ?? 1, search: params.search } }),
      ),
  });
}

export function useMyCourses() {
  return useQuery({
    queryKey: ['courses', 'mine'],
    queryFn: () => unwrap<Course[]>(apiClient.get('/courses/mine')),
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCourseInput) => unwrap<Course>(apiClient.post('/courses', input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseCode: string) => unwrap(apiClient.delete(`/courses/${courseCode}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
}
