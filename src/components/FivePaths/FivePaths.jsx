import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../hooks/useLanguage';
import styles from './FivePaths.module.css';

gsap.registerPlugin(ScrollTrigger);

// Geometric SVG silhouettes (viewBox 0 0 180 180)
const POSES = {
  taekwondo: (
    <svg viewBox="0 0 180 180" className={styles.pose}>
      {/* High kick pose */}
      <circle cx="90" cy="30" r="12" className={styles.posePathFilled} />
      <line x1="90" y1="42" x2="90" y2="90" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="90" y1="65" x2="60" y2="52" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="52" x2="45" y2="44" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Raised leg */}
      <line x1="90" y1="90" x2="70" y2="115" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="70" y1="115" x2="90" y2="145" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Standing leg */}
      <line x1="90" y1="90" x2="100" y2="135" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="135" x2="105" y2="155" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Kick extension */}
      <line x1="90" y1="65" x2="130" y2="50" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="130" y1="50" x2="155" y2="42" stroke="#C9A84C" strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
  karate: (
    <svg viewBox="0 0 180 180" className={styles.pose}>
      {/* Punch stance */}
      <circle cx="90" cy="28" r="12" className={styles.posePathFilled} />
      <line x1="90" y1="40" x2="90" y2="95" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Forward punch arm */}
      <line x1="90" y1="60" x2="145" y2="50" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="145" y1="50" x2="160" y2="48" stroke="#C9A84C" strokeWidth="5" strokeLinecap="round" />
      {/* Guard arm */}
      <line x1="90" y1="60" x2="55" y2="70" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="55" y1="70" x2="42" y2="64" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Back stance legs */}
      <line x1="90" y1="95" x2="72" y2="135" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="72" y1="135" x2="65" y2="160" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="90" y1="95" x2="112" y2="125" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="112" y1="125" x2="118" y2="155" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  kudo: (
    <svg viewBox="0 0 180 180" className={styles.pose}>
      {/* Grappling low crouch */}
      <circle cx="90" cy="35" r="12" className={styles.posePathFilled} />
      <line x1="90" y1="47" x2="90" y2="85" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Arms wide */}
      <line x1="90" y1="62" x2="35" y2="72" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="35" y1="72" x2="22" y2="80" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="90" y1="62" x2="145" y2="72" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="145" y1="72" x2="158" y2="80" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Low crouch legs */}
      <line x1="90" y1="85" x2="60" y2="110" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="110" x2="42" y2="140" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="90" y1="85" x2="120" y2="110" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="120" y1="110" x2="138" y2="140" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  judo: (
    <svg viewBox="0 0 180 180" className={styles.pose}>
      {/* Throw pose — one figure lifting */}
      <circle cx="65" cy="35" r="10" className={styles.posePathFilled} />
      <line x1="65" y1="45" x2="65" y2="85" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="65" y1="62" x2="100" y2="55" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="55" x2="120" y2="50" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="65" y1="62" x2="42" y2="70" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="65" y1="85" x2="52" y2="130" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="65" y1="85" x2="85" y2="125" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Thrown figure (airborne) */}
      <circle cx="130" cy="55" r="9" className={styles.posePathFilled} />
      <line x1="130" y1="64" x2="125" y2="90" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="125" y1="75" x2="108" y2="68" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="125" y1="75" x2="148" y2="72" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="125" y1="90" x2="115" y2="115" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="125" y1="90" x2="140" y2="112" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  wushu: (
    <svg viewBox="0 0 180 180" className={styles.pose}>
      {/* Spinning kick — dynamic rotation */}
      <circle cx="88" cy="28" r="12" className={styles.posePathFilled} />
      <line x1="88" y1="40" x2="78" y2="80" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Spinning kick leg extended */}
      <line x1="78" y1="80" x2="135" y2="60" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="135" y1="60" x2="158" y2="52" stroke="#C9A84C" strokeWidth="5" strokeLinecap="round" />
      {/* Arms in spin */}
      <line x1="78" y1="58" x2="40" y2="45" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="78" y1="58" x2="105" y2="72" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Pivot leg */}
      <line x1="78" y1="80" x2="70" y2="125" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      <line x1="70" y1="125" x2="60" y2="158" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" />
      {/* Motion lines */}
      <path d="M 60 52 Q 80 35 100 48" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
    </svg>
  ),
};

// Static decorative data only — translated text comes from useLang()
const PANELS_META = [
  { id:'taekwondo', jp:'태권도', kanji:'태', num:'01' },
  { id:'karate',    jp:'空手道', kanji:'空', num:'02' },
  { id:'kudo',      jp:'くど',  kanji:'拳', num:'03' },
  { id:'judo',      jp:'柔道',  kanji:'柔', num:'04' },
  { id:'wushu',     jp:'武术',  kanji:'武', num:'05' },
];

export default function FivePaths() {
  const panelRefs = useRef([]);
  const { tr } = useLang();

  useEffect(() => {
    panelRefs.current.forEach((panel) => {
      if (!panel) return;
      const els = panel.querySelectorAll(
        `.${styles.panelNum}, .${styles.goldLine}, .${styles.nativeName},
         .${styles.disciplineName}, .${styles.nativeLabel}, .${styles.desc}, .${styles.certs}`
      );
      gsap.fromTo(els,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: panel, start: 'top 65%' } }
      );
      gsap.to(panel.querySelector(`.${styles.goldLine}`), {
        scaleX: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: panel, start: 'top 65%' },
      });
    });
  }, []);

  return (
    <div className={styles.wrapper} id="disciplines">
      {PANELS_META.map((meta, i) => {
        const txt = tr.fivePaths.panels[i];
        return (
          <section key={meta.id} className={styles.panel} ref={(el) => (panelRefs.current[i] = el)}>
            <div className={styles.left}>
              <span className={styles.bgKanji} aria-hidden="true">{meta.kanji}</span>
              {POSES[meta.id]}
            </div>

            <div className={styles.right}>
              <span className={styles.panelNum}>{meta.num} / 05</span>
              <div className={styles.goldLine} />
              <span className={styles.nativeName}>{meta.jp}</span>
              <h2 className={styles.disciplineName}>{txt.en}</h2>
              <span className={styles.nativeLabel}>{txt.jpLabel}</span>
              <p className={styles.desc}>{txt.desc}</p>
              <div className={styles.certs}>
                {txt.certs.map((c, j) => (
                  <span key={j} className={styles.cert}>{c}</span>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
