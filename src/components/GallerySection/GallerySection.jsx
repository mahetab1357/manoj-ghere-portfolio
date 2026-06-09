/*
  HOW TO ADD REAL PHOTOS:
  1. Place photos in: public/gallery/
     Name them: gallery-01.jpg through gallery-20.jpg
  2. In GALLERY_DATA array below, add an `image` field:
     image: "/gallery/gallery-01.jpg"
  3. Replace the placeholder <div> in the card with:
     <img src={card.image} alt={card.title} />
  4. Recommended sizes:
     - Tall  (3:4): 600×800 px
     - Wide  (4:3): 800×600 px
     - Square (1:1): 600×600 px
  5. Compress to under 200 KB each (use squoosh.app)
*/

import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useScrollScene from '../../hooks/useScrollScene';
import GalleryScene from '../../scenes/GalleryScene';
import GalleryLightbox from './GalleryLightbox';
import styles from './GallerySection.module.css';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_DATA = [
  { title: 'National Championship',          meta: 'Karate • 2019',            tag: 'Competition',  size: 'tall'   },
  { title: 'Gold Medal Moment',              meta: 'National Games • 2020',     tag: 'Competition',  size: 'wide'   },
  { title: 'Morning River Training',         meta: 'Latur • 2022',              tag: 'Training',     size: 'square' },
  { title: '2nd Dan Certification',          meta: 'Taekwondo • 2018',          tag: 'Certificates', size: 'tall'   },
  { title: 'Girls Empowerment Camp',         meta: 'Maharashtra • 2023',        tag: 'Students',     size: 'wide'   },
  { title: 'Wushu Form Practice',            meta: 'University • 2021',         tag: 'Training',     size: 'square' },
  { title: 'Government Camp Inauguration',   meta: 'Latur • 2022',              tag: 'Camps',        size: 'wide'   },
  { title: 'Karate Book of Records',         meta: 'India • 2020',              tag: 'Certificates', size: 'tall'   },
  { title: 'Student Tournament',             meta: 'District Level • 2023',     tag: 'Students',     size: 'square' },
  { title: 'Kudo District Championship',     meta: 'Latur • 2021',              tag: 'Competition',  size: 'tall'   },
  { title: 'Dawn Mountain Training',         meta: 'Sahyadri • 2022',           tag: 'Training',     size: 'wide'   },
  { title: 'Taekwondo Association Meet',     meta: 'Latur • 2023',              tag: 'Camps',        size: 'square' },
  { title: '5000 Students Milestone',        meta: 'Maharashtra • 2023',        tag: 'Students',     size: 'wide'   },
  { title: 'Judo Foundation Course',         meta: 'University • 2020',         tag: 'Training',     size: 'tall'   },
  { title: 'Black Belt Ceremony',            meta: 'Taekwondo • 2018',          tag: 'Certificates', size: 'square' },
  { title: 'Karate 2nd Dan Award',           meta: 'National Board • 2019',     tag: 'Certificates', size: 'wide'   },
  { title: 'Inter-University Championship',  meta: 'Maharashtra • 2022',        tag: 'Competition',  size: 'tall'   },
  { title: 'Camp Closing Ceremony',          meta: 'Government • 2023',         tag: 'Camps',        size: 'square' },
  { title: 'Outdoor Wushu Session',          meta: 'Nature Camp • 2021',        tag: 'Training',     size: 'wide'   },
  { title: 'Young Warriors Batch',           meta: 'Latur Academy • 2023',      tag: 'Students',     size: 'tall'   },
];

const CATEGORIES = ['All', 'Training', 'Competition', 'Certificates', 'Students', 'Camps'];

const BG_GRADIENTS = {
  Training:      'linear-gradient(145deg, #0a180a 0%, #192e0f 100%)',
  Competition:   'linear-gradient(145deg, #180a0a 0%, #2e1212 100%)',
  Certificates:  'linear-gradient(145deg, #18140a 0%, #2e240e 100%)',
  Students:      'linear-gradient(145deg, #0a1018 0%, #0f1c2e 100%)',
  Camps:         'linear-gradient(145deg, #12100a 0%, #241e0e 100%)',
};
const KANJI_MAP = {
  Training: '訓練', Competition: '競技', Certificates: '証明書', Students: '学生', Camps: 'キャンプ',
};

// Martial arts SVG silhouettes (simplified)
const SILHOUETTES = {
  Training:    <path d="M50,10 L55,30 L65,25 L60,50 L50,70 L40,50 L35,25 L45,30 Z" fill="white" />,
  Competition: <path d="M50,5 L70,25 L60,45 L75,65 L50,75 L25,65 L40,45 L30,25 Z" fill="white" />,
  Students:    <path d="M50,10 L62,35 L50,55 L38,35 Z M30,60 L70,60 L65,90 L35,90 Z" fill="white" />,
  Certificates:<path d="M25,20 L75,20 L75,80 L25,80 Z M35,40 L65,40 M35,55 L55,55" stroke="white" fill="none" strokeWidth="3"/>,
  Camps:       <path d="M50,10 L90,80 L10,80 Z" fill="white" />,
};

export default function GallerySection() {
  const [activeFilter, setActiveFilter]   = useState('All');
  const [lightbox, setLightbox]           = useState({ open: false, index: 0 });
  const canvasWrapRef  = useRef(null);
  const sectionRef     = useRef(null);
  const inkRevealRef   = useRef(0);
  const underlineRef   = useRef(null);

  const { isVisible } = useScrollScene(canvasWrapRef, { rootMargin: '15%' });

  const filtered = GALLERY_DATA.filter(
    (c) => activeFilter === 'All' || c.tag === activeFilter
  );

  // Scroll-driven ink reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      // Ink reveal driven by scroll
      ScrollTrigger.create({
        trigger: section,
        start: 'top 65%',
        end: 'top 15%',
        onUpdate: (self) => { inkRevealRef.current = self.progress; },
      });

      // Cards entrance
      gsap.utils.toArray(`.${styles.card}`, section).forEach((card) => {
        gsap.to(card, {
          opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%' },
        });
      });

      // Underline
      gsap.fromTo(
        section.querySelector(`.${styles.heading} h2`),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%' } }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  const openLightbox  = useCallback((index) => setLightbox({ open: true, index }), []);
  const closeLightbox = useCallback(() => setLightbox((s) => ({ ...s, open: false })), []);
  const prevItem      = useCallback(() => setLightbox((s) => ({ ...s, index: (s.index - 1 + filtered.length) % filtered.length })), [filtered.length]);
  const nextItem      = useCallback(() => setLightbox((s) => ({ ...s, index: (s.index + 1) % filtered.length })), [filtered.length]);

  const handleFilter = (cat) => {
    setActiveFilter(cat);
    setLightbox({ open: false, index: 0 });
  };

  return (
    <section className={styles.section} id="gallery" ref={sectionRef}>
      {/* R3F 3D background */}
      <div className={styles.canvas} ref={canvasWrapRef}>
        {isVisible && (
          <Canvas
            camera={{ fov: 60, position: [0, 0, 10], near: 0.1, far: 100 }}
            dpr={[1, 1]}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
          >
            <GalleryScene revealRef={inkRevealRef} />
          </Canvas>
        )}
      </div>

      <div className={styles.content}>
        {/* Heading */}
        <div className={styles.heading}>
          <h2>Gallery</h2>
          <span className={styles.jp}>写真集</span>
          <div ref={underlineRef} className={`${styles.inkUnderline} ${isVisible ? styles.visible : ''}`} />
        </div>

        {/* Category filter */}
        <div className={styles.filterBar}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className={styles.grid}>
          {filtered.map((card, i) => (
            <article
              key={`${card.title}-${i}`}
              className={`${styles.card} ${styles[card.size]}`}
              onClick={() => openLightbox(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(i)}
              aria-label={`Open ${card.title}`}
            >
              <div className={styles.cardImage}>
                <div
                  className={styles.placeholder}
                  style={{ background: BG_GRADIENTS[card.tag] }}
                >
                  <span className={styles.kanjiWM}>{KANJI_MAP[card.tag]}</span>
                  {SILHOUETTES[card.tag] && (
                    <svg viewBox="0 0 100 100" className={styles.silhouette}>
                      {SILHOUETTES[card.tag]}
                    </svg>
                  )}
                </div>
              </div>
              <span className={styles.countBadge}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.cardOverlay}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardMeta}>{card.meta}</p>
                <span className={styles.cardTag}>{card.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox.open && (
        <GalleryLightbox
          card={filtered[lightbox.index]}
          index={lightbox.index}
          total={filtered.length}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
        />
      )}
    </section>
  );
}
