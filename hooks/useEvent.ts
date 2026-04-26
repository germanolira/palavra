import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * Stable callback identity that always reads the latest closure.
 * Useful for handlers passed to deeply memoized children or used inside
 * other callbacks where you don't want stale state.
 */
export function useEvent<T extends (...args: any[]) => any>(handler: T): T {
  const ref = useRef(handler);

  useLayoutEffect(() => {
    ref.current = handler;
  });

  return useCallback(((...args: any[]) => ref.current(...args)) as T, []);
}
