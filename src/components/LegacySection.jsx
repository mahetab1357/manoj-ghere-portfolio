import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useScrollScene from '../hooks/useScrollScene';
import SunriseScene from '../scenes/SunriseScene';
import styles from './LegacySection.module.css';

gsap.registerPlugin(ScrollTrigger);

const PETALS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  size: 12 + Math.random() * 14,
  duration: 8 + Math.random() * 12,
  delay: Math.random() * 14,
  drift: (Math.random() - 0.5) * 180,
  rotate: Math.random() * 720 - 360,
}));

export default function LegacySection() {
  const wrapRef    = useRef(null);
  const sectionRef = useRef(null);
  const counterRef = useRef(null);
  const burstRef   = useRef(null);
  const { isVisible } = useScrollScene(wrapRef, { rootMargin: '10%' });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // CountUp
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 5000,
        duration: 3.2,
        ease: 'power2.out',
        roundProps: 'val',
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
        onUpdate() {
          if (counterRef.current) counterRef.current.textContent = obj.val.toLocaleString() + '+';
        },
      });

      // Radial burst
      gsap.to(burstRef.current, {
        scale: 1, opacity: 1, duration: 2, ease: 'elastic.out(1, 0.55)',
        scrollTrigger: { trigger: section, start: 'top 70%' },
      });

      // Text reveals
      gsap.fromTo(
        section.querySelectorAll(`.${styles.revealUp}`),
        { opacity: 0, y: 45 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.18,
          scrollTrigger: { trigger: section, start: 'top 72%' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="legacy" ref={sectionRef}>
      <div className={styles.canvas} ref={wrapRef}>
        {isVisible && (
          <Canvas
            camera={{ fov: 60, position: [0, 4, 14], near: 0.1, far: 200 }}
            dpr={[1, 1]}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
          >
            <SunriseScene />
          </Canvas>
        )}
      </div>

      <div className={styles.overlay} aria-hidden="true" />

      {/* CSS falling petals */}
      <div className={styles.petals} aria-hidden="true">
        {PETALS.map((p) => (
          <span
            key={p.id}
            className={styles.petal}
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--drift':  `${p.drift}px`,
              '--rotate': `${p.rotate}deg`,
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        <svg ref={burstRef} className={styles.burst} viewBox="0 0 300 300" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const inner = 60, outer = 110 + (i % 3) * 15;
            return (
              <line
                key={i}
                x1={150 + Math.cos(angle) * inner} y1={150 + Math.sin(angle) * inner}
                x2={150 + Math.cos(angle) * outer} y2={150 + Math.sin(angle) * outer}
                stroke="rgba(196,146,42,0.25)"
                strokeWidth={i % 6 === 0 ? 1.5 : 0.6}
              />
            );
          })}
          <circle cx="150" cy="150" r="56" fill="none" stroke="rgba(196,146,42,0.18)" strokeWidth="1" />
        </svg>

        <p className={`label-mono ${styles.revealUp}`}>Legacy</p>

        <div className={styles.counterWrap}>
          <span ref={counterRef} className={styles.counter}>0+</span>
        </div>

        <h2 className={`${styles.heading} ${styles.revealUp}`}>Daughters of Strength</h2>
        <p className={`${styles.subtext} ${styles.revealUp}`}>
          Girls coached, trained, and empowered across Maharashtra
        </p>

        <blockquote className={`${styles.quote} ${styles.revealUp}`}>
          <p>
            "When a woman learns to fight,<br />
            she learns she cannot be defeated."
          </p>
          <cite>— Master Manoj Ghere</cite>
        </blockquote>

        <p className={`${styles.tagline} ${styles.revealUp}`}>
          Empowering Maharashtra, one warrior at a time.
        </p>
      </div>
    </section>
  );
}
