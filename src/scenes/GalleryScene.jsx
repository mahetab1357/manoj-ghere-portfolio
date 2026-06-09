import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, DepthOfField, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import noiseFn from '../shaders/noise.glsl';
import inkVert from '../shaders/ink/vertex.glsl';
import inkFrag from '../shaders/ink/fragment.glsl';

// Reduced to 8 frames (was 12) — fewer draw calls, same visual feel
const FRAME_DATA = Array.from({ length: 8 }, (_, i) => ({
  x: (Math.random() - 0.5) * 14,
  y: (Math.random() - 0.5) * 7,
  z: -8 + Math.random() * 7,
  rx: (Math.random() - 0.5) * 0.18,
  ry: (Math.random() - 0.5) * 0.28,
  rz: (Math.random() - 0.5) * 0.09,
  seed: Math.random() * Math.PI * 2,
  w: 3.0 + (i % 3) * 0.4,
  h: 2.2 + (i % 2) * 0.35,
}));

// Single useFrame for all frames
function PhotoFrames() {
  const refs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const d = FRAME_DATA[i];
      ref.position.y = d.y + Math.sin(t * 0.3 + d.seed) * 0.16;
      ref.rotation.y = d.ry + Math.sin(t * 0.2 + d.seed) * 0.035;
    });
  });

  return (
    <>
      {FRAME_DATA.map((d, i) => {
        const texture = useMemo(() => {
          const canvas = document.createElement('canvas');
          canvas.width = 256; canvas.height = 192;
          const ctx = canvas.getContext('2d');
          const hue = [220, 30, 0, 200, 45, 280, 160, 10][i % 8];
          const g = ctx.createLinearGradient(0, 0, 256, 192);
          g.addColorStop(0, `hsl(${hue}, 40%, 6%)`);
          g.addColorStop(1, `hsl(${hue + 20}, 35%, 14%)`);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, 256, 192);
          ctx.font = 'bold 80px serif';
          ctx.fillStyle = 'rgba(255,255,255,0.06)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(['武','道','力','技','心','気','剣','礼'][i % 8], 128, 96);
          return new THREE.CanvasTexture(canvas);
        }, [i]);

        return (
          <group
            key={i}
            ref={(el) => (refs.current[i] = el)}
            position={[d.x, d.y, d.z]}
            rotation={[d.rx, d.ry, d.rz]}
          >
            <mesh>
              <planeGeometry args={[d.w, d.h]} />
              <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* frame border — 4 edges */}
            {[
              [0,  d.h * 0.5 + 0.04, 0, d.w + 0.08, 0.08, 0.06],
              [0, -d.h * 0.5 - 0.04, 0, d.w + 0.08, 0.08, 0.06],
              [-d.w * 0.5 - 0.04, 0, 0, 0.08, d.h, 0.06],
              [ d.w * 0.5 + 0.04, 0, 0, 0.08, d.h, 0.06],
            ].map(([x, y, z, w, h, depth], j) => (
              <mesh key={j} position={[x, y, z - 0.01]}>
                <boxGeometry args={[w, h, depth]} />
                <meshStandardMaterial color="#3a2a18" roughness={0.6} metalness={0.2} />
              </mesh>
            ))}
          </group>
        );
      })}
    </>
  );
}

// Gold particles: 1200 → 600
const PARTICLE_COUNT = 600;
function GoldParticles() {
  const groupRef = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = -18 + Math.random() * 18;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.012;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#c4922a"
          size={1.4}
          sizeAttenuation
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Ink overlay — scroll driven
export function InkOverlay({ revealRef }) {
  const matRef = useRef();
  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uReveal:{ value: 0.0 },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    if (revealRef?.current !== undefined) {
      matRef.current.uniforms.uReveal.value = revealRef.current;
    }
  });

  return (
    <mesh position={[0, 0, 5]} scale={[22, 16, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={inkVert}
        fragmentShader={noiseFn + inkFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function GalleryScene({ revealRef }) {
  return (
    <>
      <color attach="background" args={['#040403']} />
      <ambientLight intensity={0.18} color="#1a1208" />
      <spotLight position={[0, 10, 6]} angle={0.6} penumbra={0.8} intensity={3.0} color="#e8d090" />
      {[[-6, 5, -4], [6, 5, -4]].map((pos, i) => (
        <pointLight key={i} position={pos} intensity={0.7} color="#fff0d0" distance={9} decay={2} />
      ))}

      <PhotoFrames />
      <GoldParticles />
      <InkOverlay revealRef={revealRef} />

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.85} intensity={0.65} mipmapBlur />
        <DepthOfField focusDistance={0.022} focalLength={0.055} bokehScale={2.5} />
        <Vignette eskil={false} offset={0.3} darkness={0.82} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
