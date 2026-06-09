import { useState, useEffect } from 'react';

export default function useScrollScene(ref, { rootMargin = '15%' } = {}) {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [rootMargin]);

  return { isVisible, hasBeenVisible };
}
