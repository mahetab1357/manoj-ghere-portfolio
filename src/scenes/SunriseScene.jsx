import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import skyVert from '../shaders/sky/vertex.glsl';
import skyFrag from '../shaders/sky/fragment.glsl';

function SunriseSky() {
  const matRef = useRef();
  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uPhase: { value: 1.4 },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.elapsedTime;
    matRef.current.uniforms.uTime.value  = t;
    matRef.current.uniforms.uPhase.value = 1.2 + Math.sin(t * 0.08) * 0.6;
  });

  return (
    <mesh scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 24, 12]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        vertexShader={skyVert}
        fragmentShader={skyFrag}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

function CherryTree({ position, height, scale }) {
  const blossomColor = new THREE.Color('#ffaabb');
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, height * 0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.22, height, 6]} />
        <meshStandardMaterial color="#3a1e10" roughness={0.9} />
      </mesh>
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const r = 0.7 + Math.sin(i * 0.7) * 0.8;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(a) * r,
              height + Math.sin(a * 0.5) * 0.5 + 0.2,
              Math.sin(a) * r,
            ]}
            scale={0.28 + (i % 3) * 0.06}
          >
            <sphereGeometry args={[1, 5, 4]} />
            <meshStandardMaterial
              color={blossomColor}
              roughness={0.8}
              emissive={blossomColor}
              emissiveIntensity={0.06}
            />
          </mesh>
        );
      })}
    </group>
  );
}

const TREE_DATA = Array.from({ length: 7 }, (_, i) => ({
  position: [
    Math.cos((i / 7) * Math.PI * 2) * (6 + (i % 2) * 3),
    -0.5,
    Math.sin((i / 7) * Math.PI * 2) * (4 + (i % 2) * 2),
  ],
  height: 3.5 + (i % 3) * 0.8,
  scale:  0.85 + (i % 4) * 0.1,
}));

// Petals: 500 → 280, GPU-only animation
const PETAL_COUNT = 280;
const petalVertShader = /* glsl */`
  attribute float aRandom;
  attribute float aDelay;
  uniform float uTime;
  varying float vOpacity;
  void main() {
    float t   = mod(uTime * 0.35 + aDelay, 1.0);
    float y   = mix(4.5, -2.5, t);
    float x   = position.x + sin(uTime * 0.5 + aRandom * 6.28) * 0.55;
    float z   = position.z + cos(uTime * 0.3 + aRandom * 4.0) * 0.35;
    vOpacity  = smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.88, t) * 0.82;
    vec4 mvPos = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_PointSize = 7.0 * (8.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;
const petalFragShader = /* glsl */`
  varying float vOpacity;
  void main() {
    vec2 coord = gl_PointCoord - 0.5;
    float d = length(coord * vec2(1.8, 1.0));
    if (d > 0.5) discard;
    gl_FragColor = vec4(1.0, 0.65, 0.72, vOpacity);
  }
`;

function FallingPetals() {
  const matRef = useRef();
  const { positions, randoms, delays } = useMemo(() => {
    const positions = new Float32Array(PETAL_COUNT * 3);
    const randoms   = new Float32Array(PETAL_COUNT);
    const delays    = new Float32Array(PETAL_COUNT);
    for (let i = 0; i < PETAL_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      randoms[i]           = Math.random();
      delays[i]            = Math.random();
    }
    return { positions, randoms, delays };
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
        <bufferAttribute attach="attributes-aDelay"   args={[delays, 1]}    />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={petalVertShader}
        fragmentShader={petalFragShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function SunriseScene() {
  return (
    <>
      <color attach="background" args={['#080402']} />
      <fog attach="fog" args={['#401a08', 12, 40]} />
      <ambientLight intensity={0.25} color="#f09040" />
      <directionalLight position={[8, 5, -5]} intensity={2.5} color="#ffc060" />
      <hemisphereLight args={['#ff9030', '#200a08', 0.5]} />

      <SunriseSky />
      {TREE_DATA.map((d, i) => (
        <CherryTree key={i} position={d.position} height={d.height} scale={d.scale} />
      ))}
      <FallingPetals />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[50, 40]} />
        <meshStandardMaterial color="#1a0f08" roughness={0.95} />
      </mesh>

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.45} luminanceSmoothing={0.9} intensity={1.6} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.5} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
