import { useEffect } from 'react';
import useStore from '../store/useStore';
import useAudio from '../hooks/useAudio';

export default function AudioManager() {
  const audioEnabled = useStore((s) => s.audioEnabled);
  const activeScene  = useStore((s) => s.activeScene);
  const { toggle }   = useAudio();

  useEffect(() => {
    toggle(audioEnabled, activeScene);
  }, [audioEnabled, activeScene, toggle]);

  return null;
}
