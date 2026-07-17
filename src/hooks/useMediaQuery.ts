import { useEffect, useState } from 'react';

export function useMediaQuery(width: number) {
  const [targetReached, setTargetReached] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > width;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${width + 1}px)`);
    setTargetReached(media.matches);

    const updateTarget = (e: MediaQueryListEvent) => {
      setTargetReached(e.matches);
    };

    media.addEventListener('change', updateTarget);

    return () => media.removeEventListener('change', updateTarget);
  }, [width]);

  return targetReached;
}