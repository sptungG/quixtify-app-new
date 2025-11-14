import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { get } from 'lodash';
import queryString from 'query-string';
import { getErrorMessage } from './utils-error';
import { supabase } from './utils-supabase';

// ==================== GET AUTH CONTEXT ====================

export async function getAuthContext() {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data?.session) {
    console.error('Auth error:', error?.message || 'No session');
    return {
      status: 'error',
      message: 'Authentication required. Please sign in.',
      data: null,
      error,
    };
  }

  return {
    status: 'success',
    data,
    error,
  };
}

// ==================== AXIOS INSTANCE ====================

const createAxiosInstance = async (): Promise<AxiosInstance | null> => {
  const { data, error } = await getAuthContext();

  if (error || !data?.session) return null;

  const instance = axios.create({
    baseURL: process.env.MODERN_API_URL || '',
    maxRedirects: 0,
    adapter: ['fetch', 'xhr', 'http'],
  });

  const accessToken = data?.session?.access_token;

  instance.interceptors.request.use(
    async config => {
      try {
        if (accessToken) {
          // biome-ignore lint/complexity/useLiteralKeys: <explanation>
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        if (config.data && !(config.data instanceof FormData)) {
          config.headers['Content-Type'] = 'application/json';
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
