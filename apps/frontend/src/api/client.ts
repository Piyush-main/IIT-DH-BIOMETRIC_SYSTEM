import axios from 'axios';
import type { ApiResponse } from '@attendance/shared-types';
import { supabase } from './supabaseClient';

/**
 * Single Axios instance for the whole app. Every request/response passes
 * through here, which is why individual feature modules (features/students,
 * features/attendance, etc.) never need their own error-handling logic —
 * they just call `apiClient.get(...)` and get back unwrapped `data`.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1',
});

apiClient.interceptors.request.use(async (config) => {
  // supabase-js caches the session in memory/localStorage and refreshes it
  // in the background, so this does NOT make a network call on every request.
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data as ApiResponse<unknown> | undefined;
    const message = apiError?.error?.message ?? error.message ?? 'Unexpected network error';
    return Promise.reject(new Error(message));
  },
);
