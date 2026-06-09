import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import YinYang from '../YinYang';
import styles from './Loader.module.css';

export default function Loader({ onDone }) {
  const loaderRef  = useRef(null);
  const yyRef      = useRef(null);
  const kanjiRef   = useRef(null);
  const barFillRef = useRef(null);
  const nameRef    = useRef(null);
  const topRef     = useRef(null);
  const botRef     = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (loaderRef.current) loaderRef.current.style.display = 'none';
        onDone?.();
      },
    });

    const yy = yyRef.current;
    const spin = gsap.to(yy, { rotation: 360, duration: 6, repeat: -1, ease: 'none', paused: true });

    tl
      .set(yy, { opacity: 0, scale: 0.7 })
      // Draw ring via strokeDashoffset on the SVG circle
      .to(yy, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
      .add(() => spin.play(), '<0.2')
      .to(kanjiRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '+=0.2')
      .to(barFillRef.current, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, '+=0.1')
      .to(nameRef.current, { opacity: 0.5, duration: 0.4 }, '-=0.3')
      // Curtain exit
      .to([topRef.current, botRef.current], { scaleY: 0, duration: 0.6, ease: 'power3.inOut', stagger: 0.05 }, '+=0.4')
      .to(loaderRef.current, { opacity: 0, duration: 0.3 }, '-=0.2');

    return () => { tl.kill(); spin.kill(); };
  }, []);

  return (
    <div ref={loaderRef} className={styles.loader}>
      <div ref={yyRef} className={styles.yy}>
        <YinYang size={120} />
      </div>
      <p ref={kanjiRef} className={styles.kanji}>武道</p>
      <div className={styles.bar}>
        <div ref={barFillRef} className={styles.barFill} />
      </div>
      <p ref={nameRef} className={styles.name}>Master Manoj Ghere</p>

      <div ref={topRef} className={styles.curtainTop} />
      <div ref={botRef} className={styles.curtainBot} />
    </div>
  );
}
