import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../hooks/useLanguage';
import styles from './Honours.module.css';

gsap.registerPlugin(ScrollTrigger);

const ACHIEVEMENTS = [
  {
    icon: '🥇', tag: 'Gold Medal',
    title: 'National Gold Medal — Karate',
    detail: 'First-place finish at the National Karate Championship. Documented in the Book of All Records.',
    year: '2020', featured: true,
  },
  {
    icon: '🥋', tag: 'Black Belt',
    title: '2nd Dan — Taekwondo',
    detail: 'Earned the 2nd Dan Black Belt after years of dedicated practice and competition.',
    year: '2018',
  },
  {
    icon: '🎖️', tag: 'Certification',
    title: '2nd Dan — Karate',
    detail: 'Certified 2nd Dan rank by the national Karate governing body.',
    year: '2019',
  },
  {
    icon: '🏛️', tag: 'Record',
    title: 'Book of All Records',
    detail: 'Officially documented for outstanding achievement in national-level Karate.',
    year: '2020',
  },
  {
    icon: '🏫', tag: 'Coaching',
    title: 'University Martial Arts Coach',
    detail: 'Appointed as the official martial arts coach at the university level.',
    year: '2021',
  },
  {
    icon: '🏕️', tag: 'Government',
    title: 'Government Camp Instructor',
    detail: 'Selected by the Maharashtra government to lead state-level training camps.',
    year: '2022',
  },
  {
    icon: '🎗️', tag: 'Association',
    title: 'Association Secretary — Latur',
    detail: 'Elected Secretary of the Taekwondo Sports Association, Latur District.',
    year: '2023',
  },
  {
    icon: '🌟', tag: 'Wushu',
    title: 'Certified Wushu Coach',
    detail: 'Officially certified to coach Wushu — a rare multi-discipline achievement.',
    year: '2022',
  },
];

export default function Honours() {
  const sectionRef = useRef(null);
  const { tr } = useLang();

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll(`.${styles.card}`);
    gsap.fromTo(cards,
      { rotateY: 90, opacity: 0 },
      {
        rotateY: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      }
    );
  }, []);

  return (
    <section className={styles.section} id="honours" ref={sectionRef}>
      <div className={styles.heading}>
        <span className={styles.headingLine1}>{tr.honours.eyebrow}</span>
        <span className={styles.headingLine2}>{tr.honours.heading}</span>
        <span className={styles.headingJp}>{tr.honours.jp}</span>
        <span className={styles.headingLine} />
      </div>

      <div className={styles.grid} style={{ perspective: '1200px' }}>
        {ACHIEVEMENTS.map((a, i) => (
          <article key={i} className={`${styles.card} ${a.featured ? styles.cardFeatured : ''}`}>
            <span className={styles.cardTag}>{a.tag}</span>
            <span className={styles.cardIcon}>{a.icon}</span>
            <h3 className={styles.cardTitle}>{a.title}</h3>
            <p className={styles.cardDetail}>{a.detail}</p>
            <div className={styles.cardFooter}>
              <span className={styles.cardYear}>{a.year}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
