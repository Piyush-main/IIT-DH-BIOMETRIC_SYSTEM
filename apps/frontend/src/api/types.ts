import type { ApiResponse } from '@attendance/shared-types';
import { apiClient } from './client';

/**
 * Unwraps our backend's { success, data, error } envelope and returns just
 * `data`, throwing if the call failed. Every resource hook file below
 * builds on this so react-query's error state "just works".
 */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const res = await promise;
  if (!res.data.success || res.data.data === null) {
    throw new Error(res.data.error?.message ?? 'Request failed');
  }
  return res.data.data;
}

export { apiClient };
