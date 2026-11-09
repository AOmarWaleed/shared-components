import useSWR, { type SWRConfiguration } from "swr";
import { useState, useCallback, useMemo, useRef } from "react";

interface UseGlListParams {
  url?: string;
  initParams?: Record<string, any>;
  options?: SWRConfiguration & {
    rowsPath?: string;
    totalPath?: string;
    handleError?: (
      err: any,
      key: string | [string, any],
      config: SWRConfiguration,
    ) => void;
  };
  fetcher: (args: string | [string, any]) => Promise<any>;
}

interface UseGlListReturn<T> {
  glList: T;
  isLoading: boolean;
  isError: any;
  mutateGlList: () => void;
  isValidatingGlList: boolean;
  handleParamsChange: (newParams: Record<string, any>) => void;
}

export function useGlList<T = any>({
  url,
  initParams = {},
  options = {},
  fetcher,
}: UseGlListParams): UseGlListReturn<T> {
  const [params, setParams] = useState(initParams);

  // Retry tracking per key
  const retryMapRef = useRef<Record<string, number>>({});

  const MAX_RETRIES = 3;

  // Destructure custom + callback options so they are not forwarded to SWR config.
  // Callers should memoize handleError (e.g. via useCallback) to keep this stable.
  const { handleError, rowsPath, totalPath, ...restOptions } = options;

  const getByPath = useCallback((source: any, path?: string) => {
    if (!source || !path) return undefined;
    const parts = path.split(".").filter(Boolean);
    if (parts.length === 0) return undefined;

    return parts.reduce<any>((acc, part) => {
      if (acc == null) return undefined;
      return acc[part];
    }, source);
  }, []);

  // Memoize the SWR configuration to prevent unnecessary re-renders
  const swrConfig = useMemo<SWRConfiguration>(() => {
    return {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      keepPreviousData: false,
      errorRetryCount: MAX_RETRIES,
      errorRetryInterval: 1000,
      // Only invoke handleError after all retries have been exhausted
      onError: (err, key, config) => {
        const keyStr = typeof key === "string" ? key : JSON.stringify(key);
        retryMapRef.current[keyStr] = (retryMapRef.current[keyStr] || 0) + 1;
        if (retryMapRef.current[keyStr] >= MAX_RETRIES) {
          retryMapRef.current[keyStr] = 0;
          handleError?.(err, key, config);
        }
      },
      ...restOptions,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleError]);

  // Memoize the SWR key
  const swrKey = useMemo(() => {
    return url ? [url, { params }] : null;
  }, [url, params]);

  const { data, error, mutate, isValidating, isLoading } = useSWR(
    swrKey,
    fetcher,
    swrConfig,
  );

  const handleParamsChange = useCallback((newParams: Record<string, any>) => {
    setParams((prevParams) => ({ ...prevParams, ...newParams }));
  }, []);

  // Normalize the returned data so callers can always rely on
  // `glList.data` (array) and `glList.total` (number).
  let glList: any = null;
  if (!data) {
    glList = null;
  } else {
    const rowsFromPath = getByPath(data, rowsPath);
    const totalFromPath = getByPath(data, totalPath);

    // Extract items from common keys
    const items: any[] = Array.isArray(rowsFromPath)
      ? rowsFromPath
      : Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.rows)
            ? data.rows
            : Array.isArray(data.items)
              ? data.items
              : [];

    // Determine total from common metadata fields
    const totalFromFields =
      totalFromPath ??
      data.total ??
      data.totalRows ??
      data.total_count ??
      data.count ??
      null;

    // Fallback: if totalPages and limit are provided, estimate total
    const estimatedTotal =
      totalFromFields == null && data.totalPages && data.limit
        ? Number(data.totalPages) * Number(data.limit)
        : null;

    const total = Number(
      totalFromFields ?? estimatedTotal ?? (items.length || 0),
    );

    glList = {
      data: items,
      total,
      // also include common paging metadata if present
      currentPage: data.currentPage ?? data.page ?? null,
      limit: data.limit ?? data.pageSize ?? null,
      raw: data,
    };
  }

  return {
    glList: glList,
    isLoading,
    isError: error,
    mutateGlList: mutate,
    isValidatingGlList: isValidating,
    handleParamsChange,
  };
}
