import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './GalleryLightbox.module.css';

const PLACEHOLDER_GRADIENTS = {
  Training:      'linear-gradient(135deg, #0a180a 0%, #1a3010 100%)',
  Competition:   'linear-gradient(135deg, #180a0a 0%, #2a1010 100%)',
  Certificates:  'linear-gradient(135deg, #18140a 0%, #2a2010 100%)',
  Students:      'linear-gradient(135deg, #0a1018 0%, #101830 100%)',
  Camps:         'linear-gradient(135deg, #12100a 0%, #201e10 100%)',
};

export default function GalleryLightbox({ card, index, total, onClose, onPrev, onNext }) {
  const backdropRef = useRef(null);
  const innerRef    = useRef(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const inner    = innerRef.current;
    if (!backdrop || !inner) return;

    gsap.set(backdrop, { opacity: 0 });
    gsap.set(inner,    { opacity: 0, scale: 0.95 });
    gsap.to(backdrop,  { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.to(inner,     { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', delay: 0.05 });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowRight')  onNext();
      if (e.key === 'ArrowLeft')   onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  // Touch swipe
  useEffect(() => {
    let startX = 0;
    const onTouchStart = (e) => { startX = e.touches[0].clientX; };
    const onTouchEnd   = (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx < -60) onNext();
      if (dx > 60)  onPrev();
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [onPrev, onNext]);

  const gradient = PLACEHOLDER_GRADIENTS[card.tag] || PLACEHOLDER_GRADIENTS.Training;
  const kanjiMap = { Training: '訓練', Competition: '競技', Certificates: '証明書', Students: '学生', Camps: 'キャンプ' };

  return (
    <div
      ref={backdropRef}
      className={styles.backdrop}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={card.title}
    >
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

      <div ref={innerRef} className={styles.inner}>
        {/* Image area */}
        <div className={styles.imageWrap}>
          {card.image ? (
            <img src={card.image} alt={card.title} className={styles.image} />
          ) : (
            <div className={styles.placeholder} style={{ background: gradient }}>
              <span className={styles.imageKanji}>{kanjiMap[card.tag] || '武'}</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className={styles.details}>
          <span className={styles.catBadge}>{card.tag}</span>
          <h2 className={styles.title}>{card.title}</h2>
          <p className={styles.meta}>{card.meta}</p>
          <p className={styles.desc}>
            A defining moment in Master Manoj Ghere's journey — captured in the spirit of
            discipline, dedication, and the relentless pursuit of martial excellence.
          </p>
          <div className={styles.tags}>
            {['Martial Arts', 'Maharashtra', 'Latur', card.tag].map((t, i) => (
              <span key={i} className={styles.tag}>{t}</span>
            ))}
          </div>

          <div className={styles.navRow}>
            <button className={styles.navBtn} onClick={onPrev}>← Prev</button>
            <span className={styles.counter}>{index + 1} / {total}</span>
            <button className={styles.navBtn} onClick={onNext}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
