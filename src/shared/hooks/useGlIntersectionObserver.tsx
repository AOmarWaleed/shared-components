import { useEffect, useRef } from "react";

export function useGlIntersectionObserver(
  onIntersect: () => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    }, options);

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
      observer.disconnect();
    };
  }, [onIntersect, options]);

  return ref;
}
