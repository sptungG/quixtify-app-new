import { getAuthContext } from '@/utils/utils-api';
import useSWR from 'swr';

export function useGetAuth() {
  const Req = useSWR(null, getAuthContext, {
    refreshInterval: 1000 * 60 * 59,
    revalidateOnFocus: true,
  });
  return Req;
}
