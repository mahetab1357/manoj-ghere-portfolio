import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../hooks/useLanguage';
import styles from './Associations.module.css';

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { title:'Taekwondo Sports Association',    sub:'Secretary — Latur District. Organising regional tournaments and training events.',      year:'2018–present' },
  { title:'Kudo Association',                sub:'Secretary — Latur District. Promoting full-contact martial arts across Maharashtra.',    year:'2019–present' },
  { title:'National Coach Appointment',      sub:'Officially certified National Martial Arts Coach by the Government of India.',          year:'2020' },
  { title:'University Martial Arts Program', sub:'Head coach of the university martial arts programme, training students for nationals.', year:'2021–present' },
  { title:'Government Camp Director',        sub:"Appointed by Maharashtra State to lead women's empowerment training camps.",            year:'2022–present' },
  { title:'Book of All Records',             sub:'Officially entered for exceptional achievement in national-level Karate competition.',  year:'2020' },
];

export default function Associations() {
  const sectionRef  = useRef(null);
  const cardRefs    = useRef([]);
  const nodeRefs    = useRef([]);
  const { tr } = useLang();

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      ScrollTrigger.create({
        trigger: card,
        start: 'top 78%',
        onEnter: () => {
          card.classList.add(styles.visible);
          nodeRefs.current[i]?.classList.add(styles.active);
        },
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section className={styles.section} id="associations" ref={sectionRef}>
      <div className={styles.heading}>
        <span className={styles.headTop}>{tr.associations.heading}</span>
        <span className={styles.headJp}>{tr.associations.jp}</span>
      </div>

      <div className={styles.timeline}>
        <svg className={styles.svgLine} preserveAspectRatio="none">
          <line className={styles.linePath} x1="1" y1="0" x2="1" y2="9999" />
        </svg>

        {ITEMS.map((item, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.nodeWrap}>
              <div className={styles.node} ref={(el) => (nodeRefs.current[i] = el)} />
            </div>
            <div className={styles.card} ref={(el) => (cardRefs.current[i] = el)}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardSub}>{item.sub}</p>
              <span className={styles.cardYear}>{item.year}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
