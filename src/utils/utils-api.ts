import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { get } from 'lodash';
import queryString from 'query-string';
import { getErrorMessage } from './utils-error';
import { supabase } from './utils-supabase';

// ==================== GET AUTH CONTEXT ====================

export type TApiResponse<T = any> =
  | { status: 'success'; data: T; message?: string }
  | { status: 'error'; message: string; data: null };

type AuthContext = {
  accessToken: string;
  apiUrl: string;
};

async function getAuthContext(): Promise<
  | { auth: AuthContext; error: null }
  | { auth: null; error: TApiResponse<never> }
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
    maxRedirects: 0,
    adapter: ['fetch', 'xhr', 'http'],
  });

  instance.interceptors.request.use(
    async config => {
      try {
        const headers = new Headers(config.headers);
        if (auth?.accessToken)
          headers.set('Authorization', `Bearer ${auth?.accessToken}`);
        // Automatically set Content-Type for non-FormData bodies
        if (config.data && !(config.data instanceof FormData)) {
          headers.set('Content-Type', 'application/json');
        }
        return config;
      } catch (error) {
        console.log('interceptorReq error:', error);
      }
      return config;
    },
    error => Promise.reject(error),
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  return instance;
};

// ==================== CONVENIENCE METHODS ====================

async function apiRequest<T>(
  endpoint: string,
  config: AxiosRequestConfig = {},
) {
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
      paramsSerializer: {
        serialize: params =>
          queryString.stringify(params, {
            skipNull: false,
            skipEmptyString: true,
          }),
      },
      ...config,
    });

    return (get(response.data, 'data') || response.data) as any;
  } catch (error) {
    return {
      status: 'error',
      message: getErrorMessage(error).message,
      data: null,
    };
  }
}

// ==================== CONVENIENCE METHODS ====================

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig<any>) =>
    apiRequest<T>(url, { method: 'GET', ...config }),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig<any>) =>
    apiRequest<T>(url, { method: 'POST', data, ...config }),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig<any>) =>
    apiRequest<T>(url, { method: 'PUT', data, ...config }),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig<any>) =>
    apiRequest<T>(url, { method: 'PATCH', data, ...config }),

  delete: <T = any>(url: string, config?: AxiosRequestConfig<any>) =>
    apiRequest<T>(url, { method: 'DELETE', ...config }),
};

export { getAuthContext };
