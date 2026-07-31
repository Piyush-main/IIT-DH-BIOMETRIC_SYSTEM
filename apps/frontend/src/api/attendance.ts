import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, unwrap } from './types';
import type { AttendanceRecord } from '@attendance/shared-types';
import type { MarkAttendanceInput } from '@attendance/validation';

interface MyAttendanceResponse {
  records: AttendanceRecord[];
  summary: { courseCode: string; sessionsAttended: number }[];
}

export function useMyAttendance() {
  return useQuery({
    queryKey: ['attendance', 'me'],
    queryFn: () => unwrap<MyAttendanceResponse>(apiClient.get('/attendance/me')),
  });
}

export function useCourseAttendance(params: { courseCode?: string; sessionDate?: string }) {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: () => unwrap<AttendanceRecord[]>(apiClient.get('/attendance', { params })),
    enabled: Boolean(params.courseCode),
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MarkAttendanceInput) =>
      unwrap<AttendanceRecord>(apiClient.post('/attendance', input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }),
  });
}
