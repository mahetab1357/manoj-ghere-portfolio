import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import YinYang from '../YinYang';
import { useLang } from '../../hooks/useLanguage';
import styles from './Hero.module.css';

const LEFT_CHARS  = ['M','A','N','O','J'];
const RIGHT_CHARS = ['G','H','E','R','E'];

const TICKER_ITEMS = [
  'TAEKWONDO','태권도','KARATE','空手道','KUDO','くど','JUDO','柔道','WUSHU','武术',
];

const isMobile = () => window.innerWidth <= 768;

export default function Hero() {
  const preTitleRef = useRef(null);
  const subtitleRef = useRef(null);
  const subEnRef    = useRef(null);
  const ruleRef     = useRef(null);
  const tickerRef   = useRef(null);
  const scrollRef   = useRef(null);
  const yyRef       = useRef(null);
  const { tr } = useLang();

  useEffect(() => {
    const leftChars  = document.querySelectorAll(`.${styles.nameCharLeft}`);
    const rightChars = document.querySelectorAll(`.${styles.nameCharRight}`);
    const tl = gsap.timeline({ delay: 0.2 });

    const spinTween = gsap.to(yyRef.current, {
      rotation: 360, duration: 8, repeat: -1, ease: 'none', paused: true,
    });

    tl
      .to(yyRef.current, {
        opacity: 1, duration: 0.8, ease: 'power2.out',
        onComplete: () => spinTween.play(),
      })
      .to(preTitleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo(leftChars,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', stagger: 0.05 },
        '-=0.3'
      )
      .fromTo(rightChars,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', stagger: 0.05 },
        '-=0.65'
      )
      .to(ruleRef.current, { width: isMobile() ? '180px' : '260px', duration: 0.8, ease: 'power2.out' }, '-=0.2')
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to(subEnRef.current,    { opacity: 0.55, y: 0, duration: 0.5 }, '-=0.3')
      .to(tickerRef.current,   { opacity: 1, duration: 0.5 }, '-=0.3')
      .to(scrollRef.current,   { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

    const onScroll = () => {
      if (window.scrollY > 60) gsap.to(scrollRef.current, { opacity: 0, duration: 0.3 });
    };
    window.addEventListener('scroll', onScroll, { passive: true, once: true });
    return () => { tl.kill(); spinTween.kill(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const yySize = isMobile()
    ? Math.min(window.innerWidth * 0.85, 340)
    : Math.min(window.innerWidth * 0.52, 600);

  return (
    <section className={styles.hero} id="hero" aria-label="Hero">
      {/* Backgrounds */}
      <div className={styles.bgDark} />
      <div className={styles.bgLight} />

      {/* S-curve divider — desktop only */}
      <svg className={styles.divider} viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden="true">
        <path
          className={styles.dividerPath}
          d="M30 0 C 30 250, 30 500, 30 750 C 30 850, 30 950, 30 1000"
          fill="rgba(201,168,76,0.3)"
          stroke="rgba(201,168,76,0.5)"
          strokeWidth="1"
        />
      </svg>

      {/* Yin-Yang */}
      <div ref={yyRef} className={styles.yyWrap}>
        <YinYang size={yySize} />
      </div>

      {/* Text content */}
      <div className={styles.content}>
        <p ref={preTitleRef} className={styles.preTitle}>{tr.hero.pre}</p>

        <h1 className={styles.name} aria-label="Manoj Ghere">
          {/* MANOJ */}
          <span className={styles.nameWord}>
            {LEFT_CHARS.map((ch, i) => (
              <span key={`l${i}`} className={styles.nameCharLeft}>{ch}</span>
            ))}
          </span>
          {/* GHERE */}
          <span className={styles.nameWord}>
            {RIGHT_CHARS.map((ch, i) => (
              <span key={`r${i}`} className={styles.nameCharRight}>{ch}</span>
            ))}
          </span>
        </h1>

        <div ref={ruleRef} className={styles.nameRule} />

        <p ref={subtitleRef} className={styles.subtitle}>{tr.hero.subtitle}</p>
        <p ref={subEnRef}    className={styles.subtitleEn}>{tr.hero.subEn}</p>
      </div>

      {/* Ticker */}
      <div ref={tickerRef} className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className={styles.tickerItem}>{item}</span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div ref={scrollRef} className={styles.scrollCue}>
        <div className={styles.mouse} />
        <span className={styles.scrollLabel}>Scroll</span>
      </div>
    </section>
  );
}
