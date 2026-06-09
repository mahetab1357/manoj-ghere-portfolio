import { useCallback } from 'react';
import useStore from '../store/useStore';
import styles from './NavBar.module.css';

const LINKS = [
  { label: 'Journey',      href: '#journey' },
  { label: 'Honours',      href: '#achievements' },
  { label: 'Five Paths',   href: '#disciplines' },
  { label: 'Legacy',       href: '#legacy' },
  { label: 'Gallery',      href: '#gallery' },
  { label: 'Contact',      href: '#contact' },
];

export default function NavBar() {
  const audioEnabled = useStore((s) => s.audioEnabled);
  const setAudio     = useStore((s) => s.setAudio);

  const scrollTo = useCallback((href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <nav className={styles.nav}>
      <span className={styles.logo} onClick={() => scrollTo('#hero')}>武</span>
      <ul className={styles.links}>
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <button
        className={`${styles.audioBtn} ${audioEnabled ? styles.active : ''}`}
        onClick={() => setAudio(!audioEnabled)}
        aria-label="Toggle ambient audio"
      >
        {audioEnabled ? '♪ On' : '♪ Off'}
      </button>
    </nav>
  );
}
