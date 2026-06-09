import { useState, useCallback } from 'react';
import { gsap } from 'gsap';

export default function useTheme(initial = 'dark') {
  const [theme, setTheme] = useState(initial);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    // Ripple wipe from nav-right corner
    const ripple = document.getElementById('theme-ripple');
    if (ripple) {
      ripple.style.display = 'block';
      gsap.fromTo(ripple,
        { clipPath: 'circle(0% at 95% 32px)' },
        {
          clipPath: 'circle(160% at 95% 32px)',
          duration: 0.65,
          ease: 'power3.inOut',
          onComplete: () => { ripple.style.display = 'none'; },
        }
      );
    }
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }, [theme]);

  return { theme, toggleTheme };
}
