import { useState } from "react";

/**
 * Debounce allows to prevent to call multiple times a function in a delay.
 *
 * @param {*} delay in ms
 * @param {*} fn the callback
 */
export const useDebounce = (func, delay) => {
  const [debounceTimeoutId, setDebounceTimeoutId] = useState()

  return (...args) => {
    clearTimeout(debounceTimeoutId);
    const id = setTimeout(() => func(...args), delay);
    setDebounceTimeoutId(id)
  };
};

