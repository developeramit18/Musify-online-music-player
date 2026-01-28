import { useEffect } from "react";

export const useScrollRestore = (key) => {
  useEffect(() => {
    const saved = sessionStorage.getItem(key);
    if (saved) {
      requestAnimationFrame(() => {
        window.scrollTo(0, Number(saved));
      });
    }

    return () => {
      sessionStorage.setItem(key, window.scrollY);
    };
  }, [key]);
};
