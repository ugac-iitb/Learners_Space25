// hooks/useCountUpOnView.js
import { useEffect, useRef, useState } from 'react';

export default function useCountUpOnView(targetNumber, duration = 1000, stepTime = 30) {
  const [value, setValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || targetNumber === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          let start = 0;
          const totalSteps = Math.ceil(duration / stepTime);
          const increment = targetNumber / totalSteps;

          const interval = setInterval(() => {
            start += increment;
            if (start >= targetNumber) {
              setValue(targetNumber);
              clearInterval(interval);
            } else {
              setValue(Math.ceil(start));
            }
          }, stepTime);

          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [targetNumber, hasAnimated, duration, stepTime]);

  return [ref, value];
}
