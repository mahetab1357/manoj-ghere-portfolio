import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const BG_GRADIENTS = {
  Training:    'linear-gradient(145deg, #0a180a, #192e0f)',
  Competition: 'linear-gradient(145deg, #180a0a, #2e1212)',
  Certificates:'linear-gradient(145deg, #18140a, #2e240e)',
  Students:    'linear-gradient(145deg, #0a1018, #0f1c2e)',
  Camps:       'linear-gradient(145deg, #12100a, #241e0e)',
};

export default function GalleryLightbox({ card, index, total, onClose, onPrev, onNext }) {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(boxRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' }
    );
  }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  onPrev();
      if (e.key === 'ArrowRight') onNext();
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
      if (dx >  60) onPrev();
      if (dx < -60) onNext();
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend',   onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [onPrev, onNext]);

  const s = {
    overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center' },
    box:     { display:'flex', maxWidth:'900px', width:'90vw', background:'#fff', boxShadow:'0 0 80px rgba(0,0,0,0.8)' },
    imgSide: { flex:'0 0 55%', minHeight:'400px', background: BG_GRADIENTS[card.tag], display:'flex', alignItems:'center', justifyContent:'center', position:'relative' },
    infoSide:{ flex:1, background:'#fff', padding:'3rem 2.5rem', display:'flex', flexDirection:'column', justifyContent:'center', color:'#1A1814' },
    close:   { position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', color:'#1A1814', fontSize:'1.5rem', cursor:'pointer', lineHeight:1, zIndex:1, padding:'0.5rem' },
    tag:     { fontFamily:'JetBrains Mono, monospace', fontSize:'0.6rem', letterSpacing:'0.2em', color:'#C9A84C', border:'1px solid #C9A84C', padding:'0.2rem 0.5rem', display:'inline-block', marginBottom:'1rem' },
    title:   { fontFamily:'Playfair Display, serif', fontSize:'1.8rem', fontWeight:700, marginBottom:'0.5rem', lineHeight:1.2 },
    meta:    { fontFamily:'JetBrains Mono, monospace', fontSize:'0.65rem', letterSpacing:'0.1em', color:'#C9A84C', marginBottom:'2rem' },
    counter: { fontFamily:'JetBrains Mono, monospace', fontSize:'0.6rem', color:'rgba(26,24,20,0.4)', marginTop:'auto', letterSpacing:'0.15em' },
    nav:     { display:'flex', gap:'0.75rem', marginTop:'1.5rem' },
    navBtn:  { fontFamily:'JetBrains Mono, monospace', fontSize:'0.7rem', letterSpacing:'0.15em', border:'1px solid rgba(26,24,20,0.2)', padding:'0.5rem 1rem', background:'none', color:'#1A1814', transition:'border-color 0.2s, color 0.2s', cursor:'pointer' },
    kanji:   { fontFamily:'Noto Serif JP, serif', fontSize:'8rem', color:'#C9A84C', opacity:0.12, position:'absolute' },
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={boxRef} style={s.box}>
        <div style={s.imgSide}>
          <span style={s.kanji}>{card.tag[0]}</span>
        </div>
        <div style={s.infoSide}>
          <button style={s.close} onClick={onClose} aria-label="Close">✕</button>
          <span style={s.tag}>{card.tag}</span>
          <h2 style={s.title}>{card.title}</h2>
          <p style={s.meta}>{card.meta}</p>
          <div style={s.nav}>
            <button style={s.navBtn} onClick={onPrev}>← Prev</button>
            <button style={s.navBtn} onClick={onNext}>Next →</button>
          </div>
          <span style={s.counter}>{String(index + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
        </div>
      </div>
    </div>
  );
}
