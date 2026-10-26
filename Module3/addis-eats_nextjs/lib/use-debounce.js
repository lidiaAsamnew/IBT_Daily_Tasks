import { useEffect, useState } from "react";

/** The value, but only after it has stopped changing for `delay` ms (Day 41: no request per keystroke). */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
