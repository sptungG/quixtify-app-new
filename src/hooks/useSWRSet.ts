import { AxiosRequestConfig } from 'axios';
import { get, omit } from 'lodash';
import useSWR, { Fetcher, SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

// ====================

export function buildPath<T extends Record<string, any>>(
  basePath: string,
  params?: T,
  requiredKeys?: (keyof T)[],
): string | null {
  if (requiredKeys) {
    const allKeysExist = requiredKeys?.every(key => get(params, key));
    if (!allKeysExist) return null;
  }
  const pathKeys = ['business', 'id'];
  const rest = requiredKeys ? undefined : omit(params, pathKeys);
  const pathParts = [
    basePath,
    ...pathKeys.map(key => get(params, key)),
    !!rest && JSON.stringify(rest),
  ].filter(Boolean);
  return pathParts.join('/');
}

// ==================== REVALIDATION HELPERS ====================

type TParams = {
  id?: string;
  business?: string;
};

export const revalidateKeys = {
  // Business
  business: (id: string) => `/businesses/${id}`,
  plans: () => '/plans',
  gallery: (p: TParams) => buildPath(`/businesses/gallery`, p),
  //
  clients: (p: TParams) => buildPath(`/businesses/clients`, p),
  staffs: (p: TParams) => buildPath(`/businesses/staff`, p),
  // User
  currentUser: () => '/users/me',
};

/**
 * Generic GET hook factory
 */
export const createGetHook = <TData = any>(
  key: (string | null) | ((params?: any) => string | any[] | null),
  fetcher: any,
) => {
  return useSWR<TData>(key, fetcher || Promise.resolve(undefined as any));
};

/**
 * Generic mutation hook factory
 */
export const createMutationHook = <TData = any, TArg = any>(
  key: string,
  mutator: (arg: TArg) => TData,
  config?: SWRMutationConfiguration<TData, any, string, TArg>,
) => {
  return useSWRMutation<TData, any, string, TArg>(
    key,
    (_key, { arg }) => mutator(arg),
    config,
  );
};

/**
 * Generic mutation hook with params/payload pattern
 */
export const createParamsMutationHook = <
  TData = any,
  TParams = any,
  TPayload = any,
>(
  key: string,
  mutator: (
    params: TParams,
    payload: TPayload,
    options?: AxiosRequestConfig,
  ) => TData,
  config?: SWRMutationConfiguration<
    TData,
    any,
    string,
    { params: TParams; payload: TPayload; options?: AxiosRequestConfig }
  >,
) => {
  return useSWRMutation(
    key,
    (_key, { arg }) => mutator(arg.params, arg.payload, arg.options),
    config,
  );
};
