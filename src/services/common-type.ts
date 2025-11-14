export interface TBaseFilter {
  page?: number | null;
  page_size?: number | null;
  search?: string;
  ordering?: string | null;
}

// biome-ignore lint/complexity/noUselessTypeConstraint: <explanation>
export interface TResponse<TResult extends any> {
  results: TResult;
  previous?: string | null;
  next?: string | null;
  count: number;
}
