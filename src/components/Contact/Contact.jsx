import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import YinYang from '../YinYang';
import { useLang } from '../../hooks/useLanguage';
import styles from './Contact.module.css';

gsap.registerPlugin(ScrollTrigger);

const WA_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const CALL_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinejoin="round"/>
  </svg>
);

export default function Contact() {
  const sectionRef = useRef(null);
  const { tr } = useLang();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('[data-reveal]'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll('[data-left]'),
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll('[data-right]'),
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="contact" ref={sectionRef}>

      {/* ── Banner ── */}
      <div className={styles.banner}>
        <span className={styles.bannerBgText} aria-hidden="true">CONNECT</span>
        <YinYang size={500} className={styles.bannerYY} />

        <div className={styles.bannerContent}>
          <span data-reveal className={styles.bannerEyebrow}>{tr.contact.eyebrow}</span>
          <h2 data-reveal className={styles.bannerTitle}>
            {tr.contact.heading[0]}<br /><span>{tr.contact.heading[1]}</span>
          </h2>
          <p data-reveal className={styles.bannerSub}>{tr.contact.bannerSub}</p>
        </div>
      </div>

      <div className={styles.rule} />

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* Left — identity */}
        <div className={styles.left}>
          <YinYang size={280} className={styles.leftDecor} />

          <div data-left className={styles.infoBlock}>
            <span className={styles.infoLabel}>{tr.contact.labels.name}</span>
            <span className={styles.infoValue}>Master Manoj Ghere</span>
          </div>

          <div className={styles.dividerLine} />

          <div data-left className={styles.infoBlock}>
            <span className={styles.infoLabel}>{tr.contact.labels.title}</span>
            <span className={styles.infoValue}>National Martial Arts Coach</span>
          </div>

          <div data-left className={styles.infoBlock}>
            <span className={styles.infoLabel}>{tr.contact.labels.location}</span>
            <span className={styles.infoValue}>Latur, Maharashtra — India</span>
          </div>

          <div data-left className={styles.infoBlock}>
            <span className={styles.infoLabel}>{tr.contact.labels.phone}</span>
            <span className={styles.infoValue}>+91 82618 31413</span>
          </div>

          <div className={styles.dividerLine} />

          <div data-left>
            <span className={styles.infoLabel} style={{ marginBottom: '0.6rem', display: 'block' }}>
              {tr.contact.labels.assoc}
            </span>
            <ul className={styles.tagList}>
              <li className={styles.tag}>Taekwondo — Latur</li>
              <li className={styles.tag}>Kudo Secretary</li>
              <li className={styles.tag}>Wushu Coach</li>
              <li className={styles.tag}>University Coach</li>
              <li className={styles.tag}>Govt. Camp Director</li>
            </ul>
          </div>
        </div>

        {/* Right — CTA */}
        <div className={styles.right}>
          <YinYang size={320} className={styles.rightDecor} />

          <h3 data-right className={styles.ctaHeading}>
            {tr.contact.ctaHeading[0]}<br />
            <em>{tr.contact.ctaHeading[1]}</em>
          </h3>

          <p data-right className={styles.ctaSub}>{tr.contact.ctaSub}</p>

          <div className={styles.btns}>
            <a
              data-right
              href="https://wa.me/918261831413"
              className={`${styles.btn} ${styles.btnWA}`}
              target="_blank" rel="noopener noreferrer"
            >
              {WA_ICON}
              <span className={styles.btnLabel}>{tr.contact.btns.wa}</span>
              <span className={styles.btnArrow}>→</span>
            </a>

            <a
              data-right
              href="tel:+918261831413"
              className={`${styles.btn} ${styles.btnCall}`}
            >
              {CALL_ICON}
              <span className={styles.btnLabel}>{tr.contact.btns.call}</span>
              <span className={styles.btnArrow}>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <YinYang size={22} className={styles.footerYY} />
          <span className={styles.footerName}>Master Manoj Ghere</span>
        </div>
        <span className={styles.footerMid}>武道</span>
        <span className={styles.footerRight}>{tr.contact.footer}</span>
      </footer>

      {/* ── Dev credit ── */}
      <div className={styles.devBar}>
        <span className={styles.devText}>{tr.contact.devBy}</span>
        <a
          href="https://core3innovations.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.devLink}
        >
          Core3 Innovations
        </a>
      </div>

    </section>
  );
}
