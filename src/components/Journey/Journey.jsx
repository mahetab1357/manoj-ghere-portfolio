import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import YinYang from '../YinYang';
import { useLang } from '../../hooks/useLanguage';
import styles from './Journey.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const sectionRef = useRef(null);
  const { tr } = useLang();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const fromLeft  = sectionRef.current.querySelectorAll('[data-reveal="left"]');
      const fromRight = sectionRef.current.querySelectorAll('[data-reveal="right"]');

      gsap.fromTo(fromLeft,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );
      gsap.fromTo(fromRight,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll(`.${styles.badge}`),
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="journey" ref={sectionRef}>
      {/* Left — dark */}
      <div className={styles.left}>
        <span className={styles.bgKanji} aria-hidden="true">武</span>

        <p data-reveal="left" className={styles.eyebrow}>{tr.journey.eyebrow}</p>
        <p data-reveal="left" className={styles.jpHeading}>{tr.journey.jpLine}</p>
        <h2 data-reveal="left" className={styles.heading}>
          {tr.journey.heading[0]}<br />{tr.journey.heading[1]}
        </h2>

        <div className={styles.badges}>
          {tr.journey.credentials.map((c, i) => (
            <span key={i} data-reveal="left" className={styles.badge}>{c}</span>
          ))}
        </div>
      </div>

      {/* Center line */}
      <div className={styles.centerLine}>
        <div className={styles.lineInner} />
        <div className={styles.lineYY}>
          <YinYang size={32} />
        </div>
      </div>

      {/* Right — light */}
      <div className={styles.right}>
        <p data-reveal="right" className={styles.bio}>{tr.journey.bio1}</p>
        <p data-reveal="right" className={styles.bio}>{tr.journey.bio2}</p>

        <blockquote data-reveal="right" className={styles.pullQuote}>
          <span className={styles.quoteMark}>"</span>
          <p className={styles.quoteText}>{tr.journey.quote}</p>
          <cite className={styles.quoteBy}>{tr.journey.quoteBy}</cite>
        </blockquote>
      </div>
    </section>
  );
}
