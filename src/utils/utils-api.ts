import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import queryString from 'query-string';
import { supabase } from './utils-supabase';

// ==================== TYPES ====================

export type ApiResponse<T = any> =
  | { status: 'success'; data: T; message?: string }
  | { status: 'error'; message: string; data: null };

type AuthContext = {
  accessToken: string;
  apiUrl: string;
};

// ==================== GET AUTH CONTEXT ====================

async function getAuthContext(): Promise<
  { auth: AuthContext; error: null } | { auth: null; error: ApiResponse<never> }
> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    console.error('Auth error:', error?.message || 'No session');
    return {
      auth: null,
      error: {
        status: 'error',
        message: 'Authentication required. Please sign in.',
        data: null,
      },
    };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  if (!apiUrl) {
    return {
      auth: null,
      error: {
        status: 'error',
        message: 'API URL not configured',
        data: null,
      },
    };
  }

  return {
    auth: { accessToken: session.access_token, apiUrl },
    error: null,
  };
}

// ==================== AXIOS INSTANCE ====================

const createAxiosInstance = async (): Promise<AxiosInstance | null> => {
  const { auth, error } = await getAuthContext();

  if (error || !auth) {
    return null;
  }

  const instance = axios.create({
    baseURL: auth.apiUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.accessToken}`,
    },
    paramsSerializer: {
      serialize: params =>
        queryString.stringify(params, {
          skipNull: false,
          skipEmptyString: true,
        }),
    },
    maxRedirects: 0,
    adapter: ['fetch', 'xhr', 'http'],
  });

  // Response interceptor for error handling
  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 - refresh session and retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const {
            data: { session },
            error: refreshError,
          } = await supabase.auth.refreshSession();

          if (refreshError || !session) {
            await supabase.auth.signOut();
            window.location.href = '/login';
            return Promise.reject(error);
          }

          // Update authorization header with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          }

          return instance(originalRequest);
        } catch (refreshError) {
          await supabase.auth.signOut();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

// ==================== API REQUEST HELPER ====================

async function apiRequest<T>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<ApiResponse<T>> {
  try {
    const axiosInstance = await createAxiosInstance();

    if (!axiosInstance) {
      return {
        status: 'error',
        message: 'Authentication required. Please sign in.',
        data: null,
      };
    }

    const response = await axiosInstance.request<any>({
      url: endpoint,
      ...config,
    });

    return {
      status: 'success',
      data: response.data.data || response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred';

      return {
        status: 'error',
        message,
        data: null,
      };
    }

    return {
      status: 'error',
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null,
    };
  }
}

// ==================== CONVENIENCE METHODS ====================

export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, any>) =>
    apiRequest<T>(endpoint, { method: 'GET', params }),

  post: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, { method: 'POST', data }),

  put: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, { method: 'PUT', data }),

  patch: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, { method: 'PATCH', data }),

  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export { getAuthContext };
