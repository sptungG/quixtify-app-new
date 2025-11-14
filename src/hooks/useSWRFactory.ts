import { AxiosRequestConfig } from 'axios';
import useSWR, { Fetcher, SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

export function buildPath<T extends Record<string, any>>(
  basePath: string,
  params?: T,
  requiredKeys?: (keyof T)[],
): string | null {
  // Check if all required keys exist and are truthy
  if (params && requiredKeys) {
    const allKeysExist = requiredKeys.every(key => params[key]);

    if (allKeysExist) {
      const pathParts = [basePath, ...requiredKeys.map(key => params[key])];
      return pathParts.join('/');
    }
  }

  return null;
}

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
