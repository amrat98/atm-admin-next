import axios, { AxiosRequestHeaders } from "axios";

export type FetchTableParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortKey?: string;
  sortBy?: "asc" | "desc";
  [key: string]: unknown;
};

export type FetchTableResult<T> = {
  data: T[];
  meta?: {
    total?: number;
    current_page?: number;
    total_page?: number;
    limit?: number;
  };
  raw?: unknown;
};

export async function fetchTableData<T>(
  url: string,
  params: FetchTableParams = {},
  headers?: AxiosRequestHeaders
): Promise<FetchTableResult<T>> {
  const response = await axios.get(url, {
    headers,
    params,
  });

  const result = response.data?.result ?? {};
  const metadata = Array.isArray(result.metadata) ? result.metadata[0] : undefined;

  return {
    data: (result.data as T[]) ?? [],
    meta: metadata,
    raw: response.data,
  };
}


