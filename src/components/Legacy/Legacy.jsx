import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import YinYang from '../YinYang';
import { useLang } from '../../hooks/useLanguage';
import styles from './Legacy.module.css';

gsap.registerPlugin(ScrollTrigger);

const CIRCLES = [
  { size: 500, top: '10%', left: '-10%' },
  { size: 300, top: '60%', right: '-5%' },
  { size: 180, top: '30%', left: '70%' },
  { size: 120, top: '75%', left: '15%' },
  { size: 80,  top: '20%', left: '40%' },
];

export default function Legacy() {
  const sectionRef  = useRef(null);
  const counterRef  = useRef(null);
  const { tr } = useLang();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 5000, duration: 2.5, ease: 'power2.out', roundProps: 'val',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        onUpdate() {
          if (counterRef.current)
            counterRef.current.textContent = obj.val.toLocaleString();
        },
      });

      gsap.fromTo(
        sectionRef.current.querySelectorAll('[data-reveal]'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.18,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="legacy" ref={sectionRef}>
      <YinYang size={700} className={styles.bgYY} />
      {CIRCLES.map((c, i) => (
        <div key={i} className={styles.circle} style={{
          width: c.size, height: c.size,
          top: c.top, left: c.left, right: c.right,
          animation: `spinSlow ${30 + i * 10}s linear infinite ${i % 2 ? 'reverse' : ''}`,
        }} />
      ))}

      <div className={styles.topRule} />

      <div data-reveal className={styles.counter}>
        <span>
          <span ref={counterRef} className={styles.counterNum}>0</span>
          <span className={styles.counterPlus}>+</span>
        </span>
        <span className={styles.counterLabel}>{tr.legacy.daughters}</span>
        <p className={styles.counterSub}>{tr.legacy.sub}</p>
      </div>

      <blockquote data-reveal className={styles.quote}>
        <span className={styles.quoteMark}>"</span>
        <p className={styles.quoteText}>{tr.legacy.quote}</p>
        <cite className={styles.quoteBy}>{tr.legacy.quoteBy}</cite>
        <div className={styles.quoteYY}>
          <YinYang size={22} />
        </div>
      </blockquote>

      <div data-reveal className={styles.stats}>
        {tr.legacy.stats.map((s, i) => (
          <div key={i} className={styles.stat}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
