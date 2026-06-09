import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import HeroScene from '../scenes/HeroScene';
import styles from './HeroSection.module.css';

const DISCIPLINES = ['TAEKWONDO', 'KARATE', 'KUDO', 'JUDO', 'WUSHU'];
const NAME        = 'MASTER MANOJ GHERE';
const KANJI_RAIN  = ['武', '道', '力', '心', '技', '気', '剣', '練'];

const KANJI_COLUMNS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i / 18) * 100 + (Math.random() * 4 - 2)}%`,
  duration: 14 + Math.random() * 18,
  delay:    -(Math.random() * 24),
  fontSize: 1.0 + Math.random() * 2.0,
  chars: Array.from({ length: 6 + Math.floor(Math.random() * 6) }, () =>
    KANJI_RAIN[Math.floor(Math.random() * KANJI_RAIN.length)]
  ),
}));

export default function HeroSection() {
  const nameRef    = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!nameRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const chars = nameRef.current.querySelectorAll(`.${styles.nameChar}`);
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(`.${styles.preTitle}`, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
      .fromTo(chars,
        { opacity: 0, y: 70, rotateX: -45 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'power3.out', stagger: 0.045 },
        '-=0.5'
      )
      .to(`.${styles.subTitle}`, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.4')
      .to(`.${styles.ticker}`,   { opacity: 1, duration: 1, ease: 'power1.out' }, '-=0.4')
      .to(`.${styles.scrollCue}`,{ opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5');

    return () => tl.kill();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / section.offsetHeight));
      section.style.setProperty('--parallax', progress.toFixed(4));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} id="hero" aria-label="Hero">
      {/* R3F Canvas — always mounted, always rendering */}
      <div className={styles.canvas}>
        <Canvas
          camera={{ fov: 65, position: [0, 3, 8], near: 0.1, far: 200 }}
          dpr={[1, 1]}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <HeroScene />
        </Canvas>
      </div>

      {/* Kanji rain overlay */}
      <div className={styles.kanjiRain} aria-hidden="true">
        {KANJI_COLUMNS.map((col) => (
          <span
            key={col.id}
            className={styles.kanjiColumn}
            style={{
              left: col.left,
              fontSize: `${col.fontSize}rem`,
              animationDuration: `${col.duration}s`,
              animationDelay:    `${col.delay}s`,
            }}
          >
            {col.chars.map((ch, idx) => <span key={idx}>{ch}</span>)}
          </span>
        ))}
      </div>

      {/* Vignette */}
      <div className={styles.vignette} aria-hidden="true" />

      {/* Mountain silhouette */}
      <div className={styles.mountainSilhouette} aria-hidden="true">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,180 L120,140 L230,170 L340,115 L460,160 L590,100 L720,155 L860,110 L990,165 L1120,125 L1260,170 L1440,135 L1440,220 L0,220 Z"
            fill="rgba(5,8,16,0.75)"
          />
          <path
            d="M0,210 L160,180 L300,205 L470,165 L640,200 L820,172 L1000,208 L1180,178 L1440,205 L1440,220 L0,220 Z"
            fill="rgba(3,5,12,0.9)"
          />
        </svg>
      </div>

      {/* Content overlay */}
      <div className={styles.overlay}>
        <svg className={styles.inkCircle} viewBox="0 0 240 240" aria-hidden="true">
          <circle
            cx="120" cy="120" r="104"
            fill="none"
            stroke="rgba(196,146,42,0.55)"
            strokeWidth="1.4"
            strokeLinecap="round"
            pathLength="100"
            className={styles.inkCirclePath}
          />
          <circle
            cx="120" cy="120" r="92"
            fill="none"
            stroke="rgba(240,237,230,0.16)"
            strokeWidth="0.6"
            strokeDasharray="1 5"
            pathLength="100"
          />
        </svg>

        <span className={styles.kanjiWatermark} aria-hidden="true">武道</span>

        <p className={`${styles.preTitle} label-mono`}>महाराष्ट्र • LATUR • INDIA</p>

        <h1 ref={nameRef} className={styles.name} aria-label={NAME}>
          {NAME.split('').map((ch, i) => (
            <span key={i} className={styles.nameChar}>{ch === ' ' ? ' ' : ch}</span>
          ))}
        </h1>

        <p className={styles.subTitle}>
          राष्ट्रीय प्रशिक्षक <span className={styles.subDivider}>|</span> National Martial Arts Coach
        </p>

        <div className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerTrack}>
            {[...DISCIPLINES, ...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
              <span key={i} className={styles.tickerItem}>
                {d}<span className={styles.tickerDot}>•</span>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.scrollCue}>
          <span className={styles.chevron} />
          <span className={styles.scrollLabel}>Begin the Journey</span>
        </div>
      </div>
    </section>
  );
}
