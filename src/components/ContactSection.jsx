import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ContactSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const INFO = [
  { icon: '📍', label: 'Location',    value: 'Latur, Maharashtra, India' },
  { icon: '🥋', label: 'Disciplines', value: 'Taekwondo • Karate • Kudo • Judo • Wushu' },
  { icon: '🏆', label: 'Status',      value: 'National Martial Arts Coach' },
];

export default function ContactSection() {
  const sectionRef  = useRef(null);
  const inkPathRef  = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll(`.${styles.reveal}`),
        { opacity: 0, y: 25 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: section, start: 'top 72%' },
        }
      );

      // Ink circle draw
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: () => {
          if (inkPathRef.current) inkPathRef.current.classList.add(styles.drawn);
        },
        once: true,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="contact" ref={sectionRef}>
      <div className={styles.bgLines} aria-hidden="true" />

      <div className={styles.content}>
        <div className={`${styles.inkCircleWrap} ${styles.reveal}`}>
          <svg className={styles.inkCircle} viewBox="0 0 200 200" aria-hidden="true">
            <circle
              ref={inkPathRef}
              cx="100" cy="100" r="88"
              fill="none"
              stroke="rgba(196,146,42,0.5)"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength="100"
              className={styles.inkPath}
            />
            <circle
              cx="100" cy="100" r="78"
              fill="none"
              stroke="rgba(240,237,230,0.12)"
              strokeWidth="0.5"
              strokeDasharray="1 4"
              pathLength="100"
            />
          </svg>
          <span className={styles.innerKanji}>武</span>
        </div>

        <p className={`label-mono ${styles.reveal}`}>Connect</p>
        <h2 className={`${styles.heading} ${styles.reveal}`}>Begin Your Journey</h2>
        <p className={`${styles.subheading} ${styles.reveal}`}>連絡先</p>

        <p className={`${styles.bio} ${styles.reveal}`}>
          Ready to walk the path of the warrior? Master Manoj Ghere welcomes dedicated
          students of all ages. Join the lineage of strength, discipline, and spirit
          that has shaped over 5,000 lives across Maharashtra.
        </p>

        <div className={`${styles.infoGrid} ${styles.reveal}`}>
          {INFO.map((info, i) => (
            <div key={i} className={styles.infoCard}>
              <span className={styles.infoIcon}>{info.icon}</span>
              <span className={styles.infoLabel}>{info.label}</span>
              <span className={styles.infoValue}>{info.value}</span>
            </div>
          ))}
        </div>

        <button className={`${styles.cta} ${styles.reveal}`}>
          <span className={styles.ctaText}>Contact Master Ghere</span>
        </button>

        <div className={`${styles.socials} ${styles.reveal}`}>
          <span className={styles.socialDot} />
          <a href="#contact" className={styles.socialLink} onClick={(e) => e.preventDefault()}>Facebook</a>
          <span className={styles.socialDot} />
          <a href="#contact" className={styles.socialLink} onClick={(e) => e.preventDefault()}>Instagram</a>
          <span className={styles.socialDot} />
          <a href="#contact" className={styles.socialLink} onClick={(e) => e.preventDefault()}>YouTube</a>
          <span className={styles.socialDot} />
        </div>
      </div>

      <p className={styles.footer}>
        © {new Date().getFullYear()} Master Manoj Ghere • Latur, Maharashtra • National Martial Arts Coach
      </p>
    </section>
  );
}
