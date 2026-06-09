import { useEffect, useRef } from 'react';
import styles from './Cursor.module.css';

export default function Cursor() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let ox = 0, oy = 0;
    let mx = 0, my = 0;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      inner.style.left = mx + 'px';
      inner.style.top  = my + 'px';
    };

    const raf = () => {
      ox += (mx - ox) * 0.12;
      oy += (my - oy) * 0.12;
      outer.style.left = ox + 'px';
      outer.style.top  = oy + 'px';

      // Color based on bg luminance under cursor
      const el = document.elementFromPoint(mx, my);
      const bg = el ? getComputedStyle(el).backgroundColor : '';
      const isLight = bg.includes('248') || bg.includes('237') || bg.includes('212');
      inner.style.background = isLight ? '#1A1814' : '#C9A84C';
      outer.style.borderColor = isLight ? 'rgba(26,24,20,0.5)' : '#C9A84C';

      requestAnimationFrame(raf);
    };

    const onEnter = () => outer.classList.add(styles.hovered);
    const onLeave = () => outer.classList.remove(styles.hovered);
    const onTextEnter = () => outer.classList.add(styles.onText);
    const onTextLeave = () => outer.classList.remove(styles.onText);

    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, [role="button"]')
      .forEach((el) => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); });
    document.querySelectorAll('p, h1, h2, h3, h4, li')
      .forEach((el) => { el.addEventListener('mouseenter', onTextEnter); el.addEventListener('mouseleave', onTextLeave); });

    const rafId = requestAnimationFrame(raf);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={outerRef} className={styles.outer} />
      <div ref={innerRef} className={styles.inner} />
    </>
  );
}
