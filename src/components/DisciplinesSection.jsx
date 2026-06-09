import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useScrollScene from '../hooks/useScrollScene';
import HeroScene from '../scenes/HeroScene';
import DojoScene from '../scenes/DojoScene';
import MountainScene from '../scenes/MountainScene';
import SunriseScene from '../scenes/SunriseScene';
import styles from './DisciplinesSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    id: 'taekwondo',
    englishName: 'Taekwondo',
    nativeName: '태권도',
    nativeLabel: 'Korean Art',
    accentColor: '#a855c4',
    bgKanji: '태',
    Scene: HeroScene,
    cameraPos: [0, 3, 8],
    description:
      "The art of kicking and punching from Korea's ancient warriors. Master Ghere holds the prestigious 2nd Dan Black Belt and serves as Secretary of Taekwondo Sports Association, Latur.",
    certification: ['Black Belt 2nd Dan', 'Association Secretary — Latur'],
  },
  {
    id: 'karate',
    englishName: 'Karate',
    nativeName: '空手道',
    nativeLabel: 'Japanese Art',
    accentColor: '#c4922a',
    bgKanji: '空',
    Scene: DojoScene,
    cameraPos: [0, 2, 6],
    description:
      'The empty-hand way — a path of striking discipline rooted in Okinawan and Japanese tradition. Master Ghere holds the 2nd Dan rank and is officially documented in the Book of All Records.',
    certification: ['2nd Dan', 'Book of All Records Holder', 'National Gold Medalist'],
  },
  {
    id: 'kudo',
    englishName: 'Kudo',
    nativeName: 'くど',
    nativeLabel: 'Japanese Art',
    accentColor: '#c45022',
    bgKanji: '拳',
    Scene: MountainScene,
    cameraPos: [0, 6, 20],
    description:
      'A full-contact martial art combining Karate, Judo, and Muay Thai elements. Master Ghere serves as Secretary of Kudo Association, Latur District.',
    certification: ['Kudo Association Secretary — Latur District'],
  },
  {
    id: 'judo',
    englishName: 'Judo',
    nativeName: '柔道',
    nativeLabel: 'Japanese Art',
    accentColor: '#2d5a7b',
    bgKanji: '柔',
    Scene: HeroScene,
    cameraPos: [0, 2, 6],
    description:
      "The gentle way — Japan's Olympic combat sport teaching balance, leverage, and grace. A foundational discipline in Master Ghere's warrior journey.",
    certification: ['Active Practitioner & Coach'],
  },
  {
    id: 'wushu',
    englishName: 'Wushu',
    nativeName: '武术',
    nativeLabel: 'Chinese Art',
    accentColor: '#c4922a',
    bgKanji: '武',
    Scene: SunriseScene,
    cameraPos: [0, 4, 14],
    description:
      'Chinese martial arts in its purest form — a blend of combat, philosophy, and flowing movement. Master Ghere coaches this ancient art with rare mastery.',
    certification: ['Certified Wushu Coach'],
  },
];

function DisciplinePanel({ panel, index }) {
  const wrapRef = useRef(null);
  const { isVisible } = useScrollScene(wrapRef, { rootMargin: '5%' });
  const isEven = index % 2 === 0;

  return (
    <article
      className={styles.panel}
      id={`discipline-${panel.id}`}
      style={{ '--accent': panel.accentColor }}
    >
      <div className={styles.canvas} ref={wrapRef}>
        {isVisible && (
          <Canvas
            camera={{ fov: 60, position: panel.cameraPos, near: 0.1, far: 200 }}
            dpr={[1, 1]}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
          >
            <panel.Scene />
          </Canvas>
        )}
      </div>
      <div className={styles.sceneOverlay} aria-hidden="true" />
      <span className={styles.bgKanji} aria-hidden="true">{panel.bgKanji}</span>

      <div className={`${styles.content} ${isEven ? '' : styles.contentRight}`}>
        <span className={styles.panelNumber}>
          {String(index + 1).padStart(2, '0')} / 05
        </span>
        <div className={styles.accentBar} />
        <span className={styles.nativeName}>{panel.nativeName}</span>
        <h2 className={styles.panelTitle}>{panel.englishName}</h2>
        <span className={styles.nativeLabel}>{panel.nativeLabel}</span>
        <p className={styles.panelDesc}>{panel.description}</p>
        <div className={styles.certList}>
          {panel.certification.map((c, i) => (
            <span key={i} className={styles.cert}>
              <span className={styles.certBullet} />{c}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function DisciplinesSection() {
  const wrapperRef = useRef(null);
  const trackRef   = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className={styles.wrapper} id="disciplines" ref={wrapperRef}>
      <div className={styles.track} ref={trackRef}>
        {PANELS.map((panel, i) => (
          <DisciplinePanel key={panel.id} panel={panel} index={i} />
        ))}
      </div>
    </div>
  );
}
