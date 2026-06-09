import { create } from 'zustand';

const useStore = create((set) => ({
  activeScene: 'hero',
  audioEnabled: false,
  scrollProgress: 0,
  reducedMotion: typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,

  setActiveScene: (scene) => set({ activeScene: scene }),
  setAudio: (enabled) => set({ audioEnabled: enabled }),
  setScroll: (progress) => set({ scrollProgress: progress }),
}));

export default useStore;
