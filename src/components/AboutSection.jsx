import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useScrollScene from '../hooks/useScrollScene';
import DojoScene from '../scenes/DojoScene';
import styles from './AboutSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const CREDENTIALS = [
  '2nd Dan Black Belt — Taekwondo',
  '2nd Dan — Karate',
  'Certified National Coach',
  'University Coach',
  'Government Camp Instructor',
  'Wushu Certified Coach',
];

export default function AboutSection() {
  const wrapRef    = useRef(null);
  const sectionRef = useRef(null);
  const { isVisible } = useScrollScene(wrapRef, { rootMargin: '10%' });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll(`.${styles.revealLine}`),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.14,
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      );
      gsap.fromTo(
        section.querySelectorAll(`.${styles.badge}`),
        { opacity: 0, y: 20, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: { trigger: section, start: 'top 65%' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="journey">
      <div aria-hidden="true">
        {['武', '力', '心', '気', '技', '道'].map((k, i) => (
          <span key={i} className={styles.bgKanji}>{k}</span>
        ))}
      </div>

      <div className={styles.leftPanel} ref={wrapRef}>
        <div className={styles.canvas}>
          {isVisible && (
            <Canvas
              camera={{ fov: 60, position: [0, 2, 6], near: 0.1, far: 60 }}
              dpr={[1, 1]}
              gl={{ antialias: false, powerPreference: 'high-performance' }}
            >
              <DojoScene />
            </Canvas>
          )}
        </div>
        <div className={styles.canvasOverlay} aria-hidden="true" />
        <div className={styles.riverLabel}>
          <span className="label-mono">道場 · Dojo Interior</span>
        </div>
      </div>

      <div className={styles.rightPanel} ref={sectionRef}>
        <div className={styles.headingBlock}>
          <p className={`label-mono ${styles.revealLine}`}>The Journey</p>
          <h2 className={`${styles.heading} ${styles.revealLine}`}>
            The Way of<br />the Warrior
          </h2>
          <p className={`${styles.headingJp} ${styles.revealLine}`}>武道の道</p>
          <div className={`${styles.inkUnderline} ${styles.revealLine}`} />
        </div>

        <p className={`${styles.bio} ${styles.revealLine}`}>
          Born from the discipline of ancient martial traditions, Master Manoj Ghere
          has dedicated his life to the mastery and teaching of combat arts. Trained
          across five disciplines — Taekwondo, Karate, Kudo, Judo, and Wushu — he
          carries the spirit of the Shaolin mountains into the heartland of Maharashtra.
        </p>
        <p className={`${styles.bio} ${styles.bio2} ${styles.revealLine}`}>
          Through decades of relentless training and over 5,000 lives shaped through
          martial discipline, his legacy stands as both shield and light — a guardian
          of the warrior tradition in modern India.
        </p>

        <div className={styles.badgeGrid}>
          {CREDENTIALS.map((c, i) => (
            <span key={i} className={styles.badge}>
              <span className={styles.badgeDot} />{c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
