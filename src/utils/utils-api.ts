import queryString from 'query-string';
import { supabase } from './utils-supabase';

// ==================== TYPES ====================

type AuthContext = {
  accessToken: string;
  apiUrl: string;
};

// ==================== GET AUTH CONTEXT ====================
async function getAuthContext(): Promise<
  { auth: AuthContext; error: null } | { auth: null; error: any }
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

// ==================== API REQUEST HELPER ====================
type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<any> {
  const { auth, error: authError } = await getAuthContext();

  if (authError) {
    return authError as any;
  }

  const { method = 'GET', body, params, headers = {} } = options;

  // Build URL with query params
  let url = `${auth?.apiUrl}${endpoint}`;
  if (params) {
    const queryStr = queryString.stringify(params, {
      skipNull: true,
      skipEmptyString: true,
    });
    if (queryStr) url += `?${queryStr}`;
  }

  try {
    // Create default headers and merge any custom ones
    const headers = new Headers(options.headers);
    if (auth?.accessToken)
      headers.set('Authorization', `Bearer ${auth?.accessToken}`);

    // Automatically set Content-Type for non-FormData bodies
    if (options.body && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'manual',
    });

    // Handle 401 - refresh session and retry
    if (response.status === 401) {
      const {
        data: { session },
        error: refreshError,
      } = await supabase.auth.refreshSession();

      if (refreshError || !session) {
        await supabase.auth.signOut();
        window.location.href = '/login';
        return {
          status: 'error',
          message: 'Session expired. Please sign in again.',
          data: null,
        };
      }

      // Retry with new token
      const retryResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const retryData = await retryResponse.json();

      if (!retryResponse.ok) {
        return {
          status: 'error',
          message: retryData.message || 'Request failed',
          data: null,
        };
      }

      return {
        status: 'success',
        data: retryData.data || retryData,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message:
          data.message || `Request failed with status ${response.status}`,
        data: null,
      };
    }

    return {
      status: 'success',
      data: data.data || data,
    };
  } catch (error) {
    console.error('API request error:', error);
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
  get: <T extends any>(endpoint: string, params?: Record<string, any>) =>
    apiRequest<T>(endpoint, { method: 'GET', params }),

  post: <T extends any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: 'POST', body }),

  put: <T extends any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: 'PUT', body }),

  patch: <T extends any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body }),

  delete: <T extends any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export { getAuthContext };
