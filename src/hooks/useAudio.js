import { useRef, useCallback } from 'react';

let audioCtx = null;
const nodes = {};

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function createPinkNoise(ctx, gain = 0.08) {
  const bufferSize = 4096;
  const processor  = ctx.createScriptProcessor(bufferSize, 1, 1);
  let b = [0, 0, 0, 0, 0, 0, 0];
  processor.onaudioprocess = (e) => {
    const out = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const w = Math.random() * 2 - 1;
      b[0] = 0.99886 * b[0] + w * 0.0555179;
      b[1] = 0.99332 * b[1] + w * 0.0750759;
      b[2] = 0.96900 * b[2] + w * 0.1538520;
      b[3] = 0.86650 * b[3] + w * 0.3104856;
      b[4] = 0.55000 * b[4] + w * 0.5329522;
      b[5] = -0.7616 * b[5] - w * 0.0168980;
      out[i] = (b[0]+b[1]+b[2]+b[3]+b[4]+b[5]+b[6]+w*0.5362) * 0.11;
      b[6] = w * 0.115926;
    }
  };
  const filter = ctx.createBiquadFilter();
  filter.type      = 'lowpass';
  filter.frequency.value = 400;
  const gainNode = ctx.createGain();
  gainNode.gain.value = gain;
  processor.connect(filter);
  filter.connect(gainNode);
  return { processor, filter, gainNode };
}

function createWindNoise(ctx, gain = 0.04) {
  const bufferSize = 2048;
  const processor  = ctx.createScriptProcessor(bufferSize, 1, 1);
  processor.onaudioprocess = (e) => {
    const out = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      out[i] = Math.random() * 2 - 1;
    }
  };
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 0.5;
  const gainNode = ctx.createGain();
  gainNode.gain.value = gain;
  processor.connect(filter);
  filter.connect(gainNode);
  return { processor, filter, gainNode };
}

const SCENE_CONFIGS = {
  hero:  { type: 'pink', gain: 0.05 },
  dojo:  { type: 'wind', gain: 0.03 },
  mountain: { type: 'wind', gain: 0.04 },
  legacy:   { type: 'pink', gain: 0.04 },
};

export default function useAudio() {
  const activeRef = useRef(null);

  const play = useCallback((scene) => {
    if (!scene || activeRef.current === scene) return;
    stop();
    try {
      const ctx  = getCtx();
      const cfg  = SCENE_CONFIGS[scene] || SCENE_CONFIGS.hero;
      const node = cfg.type === 'wind' ? createWindNoise(ctx, cfg.gain) : createPinkNoise(ctx, cfg.gain);
      node.gainNode.connect(ctx.destination);
      nodes[scene] = node;
      activeRef.current = scene;
    } catch (_) {}
  }, []);

  const stop = useCallback(() => {
    Object.values(nodes).forEach((n) => {
      try {
        n.gainNode.disconnect();
        n.processor.disconnect();
      } catch (_) {}
    });
    Object.keys(nodes).forEach((k) => delete nodes[k]);
    activeRef.current = null;
  }, []);

  const toggle = useCallback((enabled, scene) => {
    if (enabled) play(scene);
    else stop();
  }, [play, stop]);

  return { play, stop, toggle };
}
