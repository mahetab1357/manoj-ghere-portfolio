import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
export function getLenis() { return lenisInstance; }

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisInstance = lenis;
    const tickerCb = (time) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
