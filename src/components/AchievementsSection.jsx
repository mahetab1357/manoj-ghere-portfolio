import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AchievementsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const ACHIEVEMENTS = [
  { icon: '🥇', title: 'National Gold Medal — Karate Championship of India', meta: 'National Level • All India' },
  { icon: '📖', title: 'Book of All Records — Karate', meta: 'Official Documentation • India' },
  { icon: '🥋', title: 'Taekwondo 2nd Dan Black Belt', meta: 'Master Grade • Korean Martial Arts' },
  { icon: '🥋', title: 'Karate 2nd Dan — Advanced Warrior Level', meta: 'National Board Certified' },
  { icon: '👩', title: '5,000+ Girls Coached & Empowered', meta: 'Maharashtra Empowerment Initiative' },
  { icon: '🏛️', title: 'University Martial Arts Coach', meta: 'Academic Athletic Excellence' },
  { icon: '🏕️', title: 'Government Training Camp Instructor', meta: 'State-Certified Professional' },
  { icon: '🌏', title: 'Wushu Coach — Chinese Martial Arts', meta: 'Certified Wushu Coach, National Level' },
];

export default function AchievementsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll(`.${styles.card}`),
        { opacity: 0, y: 50, rotateX: 15 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.9, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: section, start: 'top 72%' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="achievements" ref={sectionRef}>
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.header}>
        <p className="label-mono">Hall of Honour</p>
        <h2 className={styles.heading}>Warrior Achievements</h2>
        <p className={styles.subheading}>名誉の殿堂</p>
      </div>

      <div className={styles.grid}>
        {ACHIEVEMENTS.map((a, i) => (
          <article key={i} className={styles.card}>
            <span className={styles.icon}>{a.icon}</span>
            <h3 className={styles.title}>{a.title}</h3>
            <p className={styles.meta}>{a.meta}</p>
            <span className={styles.accentCorner} aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
