import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GalleryLightbox from './GalleryLightbox';
import { useLang } from '../../hooks/useLanguage';
import styles from './Gallery.module.css';

gsap.registerPlugin(ScrollTrigger);

const KANJI_MAP = { Training:'訓練', Competition:'競技', Certificates:'証明書', Students:'学生', Camps:'キャンプ' };
const BG_GRADIENTS = {
  Training:    'linear-gradient(145deg, #0a180a, #192e0f)',
  Competition: 'linear-gradient(145deg, #180a0a, #2e1212)',
  Certificates:'linear-gradient(145deg, #18140a, #2e240e)',
  Students:    'linear-gradient(145deg, #0a1018, #0f1c2e)',
  Camps:       'linear-gradient(145deg, #12100a, #241e0e)',
};

const GALLERY_DATA = [
  { title:'National Championship',         meta:'Karate • 2019',           tag:'Competition',  size:'tall'   },
  { title:'Gold Medal Moment',             meta:'National Games • 2020',    tag:'Competition',  size:'wide'   },
  { title:'Morning River Training',        meta:'Latur • 2022',             tag:'Training',     size:'square' },
  { title:'2nd Dan Certification',         meta:'Taekwondo • 2018',         tag:'Certificates', size:'tall'   },
  { title:'Girls Empowerment Camp',        meta:'Maharashtra • 2023',       tag:'Students',     size:'wide'   },
  { title:'Wushu Form Practice',           meta:'University • 2021',        tag:'Training',     size:'square' },
  { title:'Government Camp Inauguration',  meta:'Latur • 2022',             tag:'Camps',        size:'wide'   },
  { title:'Karate Book of Records',        meta:'India • 2020',             tag:'Certificates', size:'tall'   },
  { title:'Student Tournament',            meta:'District Level • 2023',    tag:'Students',     size:'square' },
  { title:'Kudo District Championship',    meta:'Latur • 2021',             tag:'Competition',  size:'tall'   },
  { title:'Dawn Mountain Training',        meta:'Sahyadri • 2022',          tag:'Training',     size:'wide'   },
  { title:'Taekwondo Association Meet',    meta:'Latur • 2023',             tag:'Camps',        size:'square' },
  { title:'5000 Students Milestone',       meta:'Maharashtra • 2023',       tag:'Students',     size:'wide'   },
  { title:'Judo Foundation Course',        meta:'University • 2020',        tag:'Training',     size:'tall'   },
  { title:'Black Belt Ceremony',           meta:'Taekwondo • 2018',         tag:'Certificates', size:'square' },
  { title:'Karate 2nd Dan Award',          meta:'National Board • 2019',    tag:'Certificates', size:'wide'   },
  { title:'Inter-University Championship', meta:'Maharashtra • 2022',       tag:'Competition',  size:'tall'   },
  { title:'Camp Closing Ceremony',         meta:'Government • 2023',        tag:'Camps',        size:'square' },
  { title:'Outdoor Wushu Session',         meta:'Nature Camp • 2021',       tag:'Training',     size:'wide'   },
  { title:'Young Warriors Batch',          meta:'Latur Academy • 2023',     tag:'Students',     size:'tall'   },
];

const INITIAL_COUNT = 6;

export default function Gallery() {
  const [showAll, setShowAll]     = useState(false);
  const [lightbox, setLightbox]   = useState({ open: false, index: 0 });
  const sectionRef  = useRef(null);
  const gridRef     = useRef(null);
  const { tr } = useLang();

  const visible = showAll ? GALLERY_DATA : GALLERY_DATA.slice(0, INITIAL_COUNT);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(`.${styles.card}`, gridRef.current).forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            delay: (i % 3) * 0.1,
            scrollTrigger: { trigger: card, start: 'top 90%' },
          }
        );
      });
    }, gridRef);
    return () => ctx.revert();
  }, [showAll]);

  const handleShowMore = () => {
    setShowAll(true);
    setTimeout(() => {
      const allCards = gridRef.current?.querySelectorAll(`.${styles.card}`);
      if (!allCards) return;
      const newCards = Array.from(allCards).slice(INITIAL_COUNT);
      gsap.fromTo(newCards,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }
      );
    }, 20);
  };

  const open  = useCallback((i) => setLightbox({ open: true, index: i }), []);
  const close = useCallback(() => setLightbox((s) => ({ ...s, open: false })), []);
  const prev  = useCallback(() => setLightbox((s) => ({ ...s, index: (s.index - 1 + visible.length) % visible.length })), [visible.length]);
  const next  = useCallback(() => setLightbox((s) => ({ ...s, index: (s.index + 1) % visible.length })), [visible.length]);

  return (
    <section className={styles.section} id="gallery" ref={sectionRef}>
      <div className={styles.heading}>
        <span className={styles.headingText}>
          <span className={styles.headDark}>{tr.gallery.heading.slice(0, 3)}</span>
          <span className={styles.headLight}>{tr.gallery.heading.slice(3)}</span>
        </span>
        <span className={styles.headingJp}>{tr.gallery.jp}</span>
      </div>

      <div className={styles.grid} ref={gridRef}>
        {visible.map((card, i) => (
          <article
            key={card.title}
            className={`${styles.card} ${styles[card.size]}`}
            onClick={() => open(i)}
            role="button" tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && open(i)}
            aria-label={`Open ${card.title}`}
          >
            <div className={styles.cardImageWrap}>
              <div className={styles.placeholder} style={{ background: BG_GRADIENTS[card.tag] }}>
                <span className={styles.placeholderKanji}>{KANJI_MAP[card.tag]}</span>
              </div>
            </div>
            <div className={styles.cardCaption}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                <span className={styles.cardMeta}>{card.meta}</span>
                <span className={styles.cardTag}>{card.tag}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!showAll && (
        <div className={styles.showMoreWrap}>
          <button className={styles.showMoreBtn} onClick={handleShowMore}>
            {tr.gallery.showMore}
            <span className={styles.showMoreCount}>+{GALLERY_DATA.length - INITIAL_COUNT}</span>
          </button>
        </div>
      )}

      {lightbox.open && (
        <GalleryLightbox
          card={visible[lightbox.index]}
          index={lightbox.index}
          total={visible.length}
          onClose={close} onPrev={prev} onNext={next}
        />
      )}
    </section>
  );
}
