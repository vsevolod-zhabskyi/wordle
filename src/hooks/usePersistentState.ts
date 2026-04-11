import { useEffect, useState } from 'react';

export function usePersistentState<T>(
  key: string,
  initialValue: T | (() => T),
  { delay, encrypt }: { delay?: number; encrypt?: boolean } = {
    delay: 300,
    encrypt: false,
  },
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return typeof initialValue === 'function'
          ? (initialValue as () => T)()
          : initialValue;
      }

      const decoded = encrypt ? atob(item) : item;
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return initialValue;
    }
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      try {
        const json = JSON.stringify(value);
        const toStore = encrypt ? btoa(json) : json;

        localStorage.setItem(key, toStore);
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }, delay);

    return () => clearTimeout(timerId);
  }, [key, value]);

  return [value, setValue] as const;
}
