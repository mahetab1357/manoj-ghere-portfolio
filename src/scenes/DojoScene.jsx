import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';

function TatamiFloor() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256; // 512 → 256
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#c8aa6e';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#8a7240';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 256; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
    }
    ctx.strokeStyle = '#6a5430';
    ctx.lineWidth = 4;
    for (let x = 0; x < 256; x += 64) {
      for (let y = 0; y < 256; y += 32) {
        ctx.strokeRect(x + 2, y + 2, 60, 28);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    return tex;
  }, []);

  return (
    <group>
      {Array.from({ length: 12 }, (_, i) => {
        const col = i % 4, row = Math.floor(i / 4);
        return (
          <mesh key={i} position={[(col - 1.5) * 2, 0, (row - 1) * 1]}>
            <boxGeometry args={[2, 0.07, 1]} />
            <meshStandardMaterial map={texture} roughness={0.9} />
          </mesh>
        );
      })}
      {[[-4.5, 0, 0], [4.5, 0, 0], [0, 0, -1.8], [0, 0, 1.8]].map((pos, i) => (
        <mesh key={`b${i}`} position={pos} rotation={[0, i < 2 ? 0 : Math.PI / 2, 0]}>
          <boxGeometry args={[i < 2 ? 1 : 10, 0.08, i < 2 ? 3.6 : 1]} />
          <meshStandardMaterial color="#5a3a1a" roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function ShojiWall({ position, rotation }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f5f0e0';
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = '#8a6a3a';
    ctx.lineWidth = 3;
    for (let x = 0; x <= 256; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 128); ctx.stroke();
    }
    for (let y = 0; y <= 128; y += 16) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[8, 4, 0.08]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.9}
        emissive={new THREE.Color('#fffae0')}
        emissiveIntensity={0.15}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

function CeilingBeams() {
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0, 4, -2.5 + i * 0.83]}>
          <boxGeometry args={[8.2, 0.18, 0.28]} />
          <meshStandardMaterial color="#1e1208" roughness={0.82} />
        </mesh>
      ))}
    </>
  );
}

const LANTERN_POSITIONS = [
  [-3, 3.2, -1], [0, 3.3, -1], [3, 3.2, -1],
  [-2, 3.1,  1], [2, 3.1,  1],
];

function Lanterns() {
  const refs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const seed = i * 1.37;
      ref.rotation.z = Math.sin(t * 0.8 + seed) * 0.05;
      ref.rotation.x = Math.sin(t * 0.55 + seed * 2) * 0.022;
    });
  });

  const profilePoints = useMemo(() => [
    new THREE.Vector2(0,    -0.38),
    new THREE.Vector2(0.18, -0.3),
    new THREE.Vector2(0.22,  0),
    new THREE.Vector2(0.18,  0.3),
    new THREE.Vector2(0,     0.38),
  ], []);

  return (
    <>
      {LANTERN_POSITIONS.map((pos, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} position={pos}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.6, 4]} />
            <meshBasicMaterial color="#2a1a08" />
          </mesh>
          <mesh>
            <latheGeometry args={[profilePoints, 8]} />
            <meshStandardMaterial
              color="#cc4411"
              emissive={new THREE.Color('#ff6622')}
              emissiveIntensity={0.9}
              transparent
              opacity={0.85}
              roughness={0.7}
            />
          </mesh>
          <pointLight color="#ff9944" intensity={1.2} distance={5} decay={2} />
        </group>
      ))}
    </>
  );
}

// Dust motes reduced: 400 → 120, GPU-animated
const DUST_COUNT = 120;
const dustVertShader = /* glsl */`
  attribute float aRandom;
  attribute float aSeed;
  uniform float uTime;
  void main() {
    vec3 pos = position;
    pos.x += sin(uTime * 0.12 + aSeed * 5.0) * 0.3;
    pos.y += sin(uTime * 0.08 + aSeed * 3.0) * 0.2;
    pos.z += cos(uTime * 0.1  + aSeed * 4.0) * 0.2;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.5 * (8.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;
const dustFragShader = /* glsl */`
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(1.0, 0.88, 0.65, 0.45 * (1.0 - d * 2.0));
  }
`;

function DustMotes() {
  const matRef = useRef();
  const { positions, randoms, seeds } = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const randoms   = new Float32Array(DUST_COUNT);
    const seeds     = new Float32Array(DUST_COUNT);
    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = 0.5 + Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
      randoms[i]           = Math.random();
      seeds[i]             = Math.random();
    }
    return { positions, randoms, seeds };
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom"  args={[randoms, 1]}   />
        <bufferAttribute attach="attributes-aSeed"    args={[seeds, 1]}     />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={dustVertShader}
        fragmentShader={dustFragShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function DojoScene() {
  return (
    <>
      <color attach="background" args={['#1a1008']} />
      <ambientLight intensity={0.28} color="#fff5e0" />
      <spotLight position={[3, 3.8, 0]} angle={0.5} penumbra={0.5} intensity={2.0} color="#ffe0b0" />

      <TatamiFloor />
      <ShojiWall position={[0, 2, -2.5]}  rotation={[0, 0, 0]}            />
      <ShojiWall position={[0, 2, 2.5]}   rotation={[0, 0, 0]}            />
      <ShojiWall position={[-4.2, 2, 0]}  rotation={[0, Math.PI / 2, 0]}  />
      <ShojiWall position={[4.2, 2, 0]}   rotation={[0, Math.PI / 2, 0]}  />
      <CeilingBeams />
      <Lanterns />
      <DustMotes />

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.85} intensity={1.0} mipmapBlur />
        <Vignette eskil={false} offset={0.3} darkness={0.6} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
