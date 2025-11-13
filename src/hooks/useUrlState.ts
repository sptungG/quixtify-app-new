import { useLocation, useNavigate } from '@modern-js/runtime/router';
import type { ParseOptions, StringifyOptions } from 'query-string';
import qs from 'query-string';
import { useCallback, useMemo, useRef, useState } from 'react';

export interface Options {
  navigateMode?: 'push' | 'replace';
  parseOptions?: ParseOptions;
  stringifyOptions?: StringifyOptions;
}

const baseParseConfig: ParseOptions = {
  parseNumbers: false,
  parseBooleans: false,
  arrayFormat: 'comma',
};

const baseStringifyConfig: StringifyOptions = {
  skipNull: false,
  skipEmptyString: true,
  sort: false,
  arrayFormat: 'comma',
};

type UrlState = Record<string, any>;

export const useUrlState = <S extends UrlState = UrlState>(
  initialState?: S | (() => S),
  options?: Options,
) => {
  type State = Partial<{ [key in keyof S]: any }>;
  const {
    navigateMode = 'push',
    parseOptions,
    stringifyOptions,
  } = options || {};

  const mergedParseOptions = { ...baseParseConfig, ...parseOptions };
  const mergedStringifyOptions = {
    ...baseStringifyConfig,
    ...stringifyOptions,
  };

  const location = useLocation();

  // react-router v6
  const navigate = useNavigate();

  const [, update] = useState({});

  const initialStateRef = useRef(
    typeof initialState === 'function'
      ? (initialState as () => S)()
      : initialState || {},
  );

  const queryFromUrl = useMemo(() => {
    return qs.parse(location.search, mergedParseOptions);
  }, [location.search]);

  const targetQuery: State = useMemo(
    () => ({
      ...initialStateRef.current,
      ...queryFromUrl,
    }),
    [queryFromUrl],
  );

  const clearState = useCallback(
    (p?: any) => {
      update({});
      if (navigate) {
        navigate(
          {
            hash: location.hash,
            search: p ? qs.stringify(p, mergedStringifyOptions) || '?' : '',
          },
          {
            replace: navigateMode === 'replace',
            state: location.state,
          },
        );
      }
    },
    [location.hash, location.state, navigate, navigateMode],
  );

  const setState = useCallback(
    (s: React.SetStateAction<State>) => {
      const newQuery = typeof s === 'function' ? s(targetQuery) : s;
      update({});
      if (navigate) {
        navigate(
          {
            hash: location.hash,
            search:
              qs.stringify(
                { ...queryFromUrl, ...newQuery },
                mergedStringifyOptions,
              ) || '?',
          },
          {
            replace: navigateMode === 'replace',
            state: location.state,
          },
        );
      }
    },
    [
      location.hash,
      location.state,
      navigate,
      navigateMode,
      queryFromUrl,
      targetQuery,
    ],
  );

  return [targetQuery, setState, clearState] as const;
};
