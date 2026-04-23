import { useCallback, useEffect, useState } from "react";
import { fetchJson } from "@/lib/api-client";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch helper that:
 *  - automatically attaches a Bearer token if provided
 *  - re-runs on `api:mutation` events (so admin writes refresh public pages instantly)
 *  - exposes a manual `refetch`
 */
export function useApi<T>(path: string, deps: unknown[] = [], token?: string | null) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });

  const fetcher = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchJson<T>("GET", path, undefined, token ?? undefined)
      .then((r) => {
        if (!cancelled) {
          setState({ data: r, loading: false, error: null });
          window.dispatchEvent(new CustomEvent("robot:action", { detail: "Yes" }));
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: e.message });
          window.dispatchEvent(new CustomEvent("robot:action", { detail: "Death" }));
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, token]);

  useEffect(() => {
    const cleanup = fetcher();
    if (typeof window !== "undefined") {
      const handler = () => fetcher();
      window.addEventListener("api:mutation", handler);
      window.addEventListener("mockapi:mutation", handler);
      return () => {
        cleanup();
        window.removeEventListener("api:mutation", handler);
        window.removeEventListener("mockapi:mutation", handler);
      };
    }
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, ...deps]);

  return { ...state, refetch: fetcher };
}
