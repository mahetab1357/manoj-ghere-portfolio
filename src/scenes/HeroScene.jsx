import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import noiseFn from '../shaders/noise.glsl';
import waterVert from '../shaders/water/vertex.glsl';
import waterFrag from '../shaders/water/fragment.glsl';
import groundVert from '../shaders/ground/vertex.glsl';
import groundFrag from '../shaders/ground/fragment.glsl';

// ─── Water ───────────────────────────────────────────────
function Water() {
  const matRef = useRef();
  const uniforms = useMemo(() => ({
    uTime:               { value: 0 },
    uBigWavesElevation:  { value: 0.08 },
    uBigWavesFrequency:  { value: new THREE.Vector2(4.0, 1.5) },
    uBigWavesSpeed:      { value: 0.75 },
    uSmallWavesElevation:{ value: 0.06 },
    uSmallWavesFrequency:{ value: 3.0 },
    uSmallWavesSpeed:    { value: 0.2 },
    uSmallIterations:    { value: 3.0 },
    uDepthColor:         { value: new THREE.Color('#0d3a5c') },
    uSurfaceColor:       { value: new THREE.Color('#4d8fa8') },
    uColorOffset:        { value: 0.18 },
    uColorMultiplier:    { value: 3.5 },
    uFogColor:           { value: new THREE.Color('#050c15') },
    uFogNear:            { value: 8 },
    uFogFar:             { value: 45 },
    uLightDir:           { value: new THREE.Vector3(0.5, 0.8, -0.3) },
  }), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, -2]}>
      {/* 48×48 instead of 128×128 — 97% fewer vertices, still looks great */}
      <planeGeometry args={[40, 16, 48, 48]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={noiseFn + waterVert}
        fragmentShader={waterFrag}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Terrain Bank ────────────────────────────────────────
function TerrainBank({ xOffset, flip }) {
  const uniforms = useMemo(() => ({
    uTime:        { value: 0 },
    uDisplacement:{ value: 3.5 },
    uFogColor:    { value: new THREE.Color('#050c15') },
    uFogNear:     { value: 8 },
    uFogFar:      { value: 45 },
  }), []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[xOffset, -1.2, -2]}
      scale={[1, flip ? -1 : 1, 1]}
    >
      {/* 24×24 — low-poly terrain, fine for side banks */}
      <planeGeometry args={[22, 30, 24, 24]} />
      <shaderMaterial
        vertexShader={noiseFn + groundVert}
        fragmentShader={noiseFn + groundFrag}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// ─── Bamboo Grove — single useFrame for all stalks ───────
const BAMBOO_DATA = Array.from({ length: 20 }, (_, i) => ({
  x: (Math.random() - 0.5) * 38,
  z: -8 + (Math.random() - 0.5) * 16,
  height: 5 + Math.random() * 5,
  radius: 0.04 + Math.random() * 0.025,
  seed: Math.random() * Math.PI * 2,
  hue: 0.28 + Math.random() * 0.06,
}));

function BambooGrove() {
  const refs = useRef([]);

  // Single useFrame instead of 20 separate ones
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const seed = BAMBOO_DATA[i].seed;
      ref.rotation.z = Math.sin(t * 1.2 + seed) * 0.035;
      ref.rotation.x = Math.sin(t * 0.8 + seed * 1.5) * 0.015;
    });
  });

  return (
    <group>
      {BAMBOO_DATA.map((d, i) => {
        const color = new THREE.Color().setHSL(d.hue, 0.45, 0.28);
        const segCount = Math.floor(d.height * 1.2);
        return (
          <group
            key={i}
            ref={(el) => (refs.current[i] = el)}
            position={[d.x, d.height * 0.5 - 0.5, d.z]}
          >
            <mesh>
              <cylinderGeometry args={[d.radius * 0.55, d.radius, d.height, 6, segCount]} />
              <meshStandardMaterial color={color} roughness={0.85} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── Rocks ───────────────────────────────────────────────
const ROCK_DATA = Array.from({ length: 16 }, () => ({
  x: (Math.random() - 0.5) * 36,
  z: -5 + (Math.random() - 0.5) * 14,
  scale: 0.2 + Math.random() * 1.1,
  rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
}));

function Rocks() {
  return (
    <>
      {ROCK_DATA.map((r, i) => (
        <mesh key={i} position={[r.x, r.scale * 0.35 - 0.85, r.z]} rotation={r.rot} scale={r.scale}>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#2e2a25" roughness={0.97} metalness={0.04} />
        </mesh>
      ))}
    </>
  );
}

// ─── Mist Particles — GPU shader, no CPU array update ────
const MIST_COUNT = 500;

const mistVertShader = /* glsl */`
  attribute float aRandom;
  attribute float aSeed;
  uniform float uTime;
  varying float vOpacity;

  void main() {
    float t = mod(uTime * 0.08 + aSeed, 1.0);
    vec3 pos = position;
    pos.y = mix(0.0, 3.0, t);
    pos.x += sin(uTime * 0.2 + aSeed * 6.28) * 1.5;
    vOpacity = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.7, t) * 0.55;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 28.0 * (12.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;
const mistFragShader = /* glsl */`
  varying float vOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = vOpacity * (1.0 - d * 2.0);
    gl_FragColor = vec4(0.7, 0.82, 0.9, alpha);
  }
`;

function MistParticles() {
  const matRef = useRef();
  const { positions, randoms, seeds } = useMemo(() => {
    const positions = new Float32Array(MIST_COUNT * 3);
    const randoms   = new Float32Array(MIST_COUNT);
    const seeds     = new Float32Array(MIST_COUNT);
    for (let i = 0; i < MIST_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 2.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 28;
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
        vertexShader={mistVertShader}
        fragmentShader={mistFragShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Fireflies — GPU shader ───────────────────────────────
const FIREFLY_COUNT = 40;
const fireflyVertShader = /* glsl */`
  attribute float aRandom;
  attribute vec3  aBasePos;
  uniform float uTime;
  varying float vOpacity;
  void main() {
    vOpacity = 0.5 + 0.5 * sin(uTime * 2.2 + aRandom * 6.2832);
    vec3 pos = aBasePos;
    pos.x += sin(uTime * 0.5  + aRandom * 4.0) * 0.7;
    pos.y += sin(uTime * 0.7  + aRandom * 5.0) * 0.45;
    pos.z += cos(uTime * 0.4  + aRandom * 3.0) * 0.7;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 4.0 * (10.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;
const fireflyFragShader = /* glsl */`
  varying float vOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(0.65, 1.0, 0.28, vOpacity * (1.0 - d * 2.0));
  }
`;

function Fireflies() {
  const matRef = useRef();
  const { positions, randoms, basePos } = useMemo(() => {
    const positions = new Float32Array(FIREFLY_COUNT * 3);
    const randoms   = new Float32Array(FIREFLY_COUNT);
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = 0.3 + Math.random() * 3.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      randoms[i]           = Math.random();
    }
    return { positions, randoms, basePos: positions.slice() };
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
        <bufferAttribute attach="attributes-aBasePos" args={[new Float32Array(basePos), 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={fireflyVertShader}
        fragmentShader={fireflyFragShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Light Shafts ─────────────────────────────────────────
function LightShafts() {
  return (
    <>
      {[
        { pos: [-4, 2, -4], rot: [0.3, 0.2, -0.1] },
        { pos: [5, 3, -6],  rot: [0.2, -0.1, 0.15] },
      ].map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={[0.4, 6, 0.4]}>
          <cylinderGeometry args={[0.6, 0.1, 1, 6, 1, true]} />
          <meshBasicMaterial
            color="#ffe8aa"
            transparent
            opacity={0.035}
            depthWrite={false}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── Post-processing — lean setup ────────────────────────
function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={1.2} mipmapBlur />
      <Vignette eskil={false} offset={0.4} darkness={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}

// ─── HeroScene ───────────────────────────────────────────
export default function HeroScene() {
  return (
    <>
      <fog attach="fog" args={['#050c15', 10, 50]} />
      <color attach="background" args={['#030810']} />

      <Sky
        turbidity={14}
        rayleigh={0.3}
        mieCoefficient={0.005}
        mieDirectionalG={0.9}
        sunPosition={[0.08, 0.01, -1]}
      />
      <Stars radius={100} depth={50} count={1800} factor={4} fade speed={0.4} />

      <ambientLight intensity={0.12} color="#0a1520" />
      <directionalLight position={[5, 8, -3]} intensity={0.55} color="#e8c888" />
      <pointLight position={[-5, 4, 2]}  intensity={1.0} color="#ff9933" distance={16} decay={2} />
      <pointLight position={[6,  3, -4]} intensity={0.7} color="#ff8844" distance={12} decay={2} />

      <Water />
      <TerrainBank xOffset={-14} flip={false} />
      <TerrainBank xOffset={14}  flip={true}  />
      <BambooGrove />
      <Rocks />
      <MistParticles />
      <Fireflies />
      <LightShafts />
      <PostFX />
    </>
  );
}
