import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import YinYang from '../YinYang';
import { useLang } from '../../hooks/useLanguage';
import styles from './Nav.module.css';

gsap.registerPlugin(ScrollTrigger);

const LANG_OPTIONS = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'mr', label: 'मर' },
];

const SECTION_IDS = ['hero','journey','honours','disciplines','legacy','gallery','associations','contact'];

export default function Nav({ theme, onToggleTheme }) {
  const navRef   = useRef(null);
  const { tr, lang, setLang } = useLang();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeIdx,  setActiveIdx]  = useState(0);

  const LINKS = [
    { label: tr.nav.journey,   href: '#journey'     },
    { label: tr.nav.honours,   href: '#honours'     },
    { label: tr.nav.fivePaths, href: '#disciplines' },
    { label: tr.nav.legacy,    href: '#legacy'      },
    { label: tr.nav.gallery,   href: '#gallery'     },
    { label: tr.nav.contact,   href: '#contact'     },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const triggers = [];
    SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      triggers.push(ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => { if (self.isActive) setActiveIdx(i); },
      }));
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div id="theme-ripple" />

      <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        {/* Logo */}
        <button className={styles.logo} onClick={() => scrollTo('#hero')} aria-label="Home">
          <YinYang size={36} className={styles.logoSpin} />
          <span className={styles.logoText}>MG</span>
        </button>

        {/* Desktop links */}
        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <button className={styles.link} onClick={() => scrollTo(l.href)}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className={styles.right}>
          {/* Language picker */}
          <div className={styles.langPicker}>
            {LANG_OPTIONS.map(({ code, label }) => (
              <button
                key={code}
                className={`${styles.langBtn} ${lang === code ? styles.langBtnActive : ''}`}
                onClick={() => setLang(code)}
                aria-label={`Switch to ${code}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button className={styles.iconBtn} onClick={onToggleTheme} aria-label="Toggle theme" title="Toggle theme">
            {theme === 'dark'
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="1" x2="8" y2="2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="8" y1="13.5" x2="8" y2="15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="1" y1="8" x2="2.5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="13.5" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 9A6 6 0 1 1 7 2a4.5 4.5 0 0 0 7 7Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            }
          </button>

          {/* Hamburger */}
          <button
            className={`${styles.burger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className={styles.bun} />
            <span className={styles.bun} />
            <span className={styles.bun} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`${styles.overlay} ${menuOpen ? styles.open : ''}`}>
        <div className={styles.overlayDark} />
        <div className={styles.overlayLight} />
        <ul className={styles.overlayLinks}>
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: menuOpen ? `${i * 0.07}s` : '0s' }}>
              <button className={styles.overlayLink} onClick={() => scrollTo(l.href)}>
                {l.label}
              </button>
            </li>
          ))}
          {/* Language picker in mobile overlay */}
          <li className={styles.overlayLangRow}>
            {LANG_OPTIONS.map(({ code, label }) => (
              <button
                key={code}
                className={`${styles.overlayLangBtn} ${lang === code ? styles.overlayLangActive : ''}`}
                onClick={() => setLang(code)}
              >
                {label}
              </button>
            ))}
          </li>
        </ul>
      </div>

      {/* Scroll dot indicator */}
      <div className={styles.dots} aria-hidden="true">
        {SECTION_IDS.map((_, i) => (
          <div key={i} className={`${styles.dot} ${activeIdx === i ? styles.active : ''}`} />
        ))}
      </div>
    </>
  );
}
