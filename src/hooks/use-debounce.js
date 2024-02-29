import { useCallback, useRef } from 'react';

export const useDebounce = (func, delay = 0) => {
  const timeoutIdRef = useRef();
  return useCallback(
    (...args) => {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay],
  );
};
