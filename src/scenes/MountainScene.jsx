import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import skyVert from '../shaders/sky/vertex.glsl';
import skyFrag from '../shaders/sky/fragment.glsl';

// ─── Animated Sky ────────────────────────────────────────
function AnimatedSky() {
  const matRef = useRef();
  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uPhase: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.elapsedTime;
    matRef.current.uniforms.uTime.value  = t;
    matRef.current.uniforms.uPhase.value = (Math.sin(t * 0.12) * 0.5 + 0.5) * 1.5;
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

// ─── Mountain Layer — CPU fbm, run once at mount ──────────
function MountainLayer({ z, color, height, noiseScale, yOffset }) {
  const geometry = useMemo(() => {
    // Reduced to 60×24 from 150×80
    const geo = new THREE.PlaneGeometry(90, 30, 60, 24);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let v = 0, a = 0.5, freq = noiseScale;
      for (let o = 0; o < 4; o++) {
        const nx = x * freq, nz = z * freq;
        v += a * (Math.sin(nx * 1.3 + nz * 0.7) * Math.cos(nx * 0.4 - nz * 1.1));
        a *= 0.5; freq *= 2;
      }
      pos.setY(i, pos.getY(i) + Math.max(0, v) * height + yOffset);
    }
    geo.computeVertexNormals();
    return geo;
  }, [height, noiseScale, yOffset]);

  return (
    <mesh geometry={geometry} position={[0, 0, z]}>
      <meshStandardMaterial color={color} roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Clouds ───────────────────────────────────────────────
const CLOUD_DATA = Array.from({ length: 10 }, (_, i) => ({
  x: (Math.random() - 0.5) * 80,
  y: 10 + Math.random() * 6,
  z: -20 - Math.random() * 40,
  seed: Math.random() * Math.PI * 2,
}));

function Cloud({ data }) {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += 0.005;
    if (ref.current.position.x > 50) ref.current.position.x = -50;
  });
  return (
    <group ref={ref} position={[data.x, data.y, data.z]}>
      {[0, 1, 2, 3].map((j) => (
        <mesh key={j} position={[(j - 1.5) * 1.4, Math.sin(j * 0.8) * 0.4, 0]}>
          <sphereGeometry args={[1.1, 5, 4]} />
          <meshStandardMaterial color="#ffc070" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Temple Silhouette ───────────────────────────────────
function Temple() {
  return (
    <group position={[0, -1, -18]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[8, 2, 6]} />
        <meshStandardMaterial color="#080806" />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[5, 2, 4]} />
        <meshStandardMaterial color="#050504" />
      </mesh>
      <mesh position={[0, 4.8, 0]}>
        <boxGeometry args={[4, 1.2, 3]} />
        <meshStandardMaterial color="#060604" />
      </mesh>
      <mesh position={[0, 6, 0]}>
        <coneGeometry args={[2.8, 1.4, 4]} />
        <meshStandardMaterial color="#040403" />
      </mesh>
    </group>
  );
}

// ─── MountainScene ───────────────────────────────────────
export default function MountainScene() {
  return (
    <>
      <color attach="background" args={['#040816']} />
      <ambientLight intensity={0.2} color="#e8701a" />
      <directionalLight position={[15, 3, -10]} intensity={2.8} color="#ffa030" />
      <hemisphereLight args={['#e8701a', '#1a3060', 0.6]} />

      <AnimatedSky />
      <MountainLayer z={-70} color="#080c18" height={22} noiseScale={0.12} yOffset={-2} />
      <MountainLayer z={-45} color="#14183a" height={16} noiseScale={0.14} yOffset={-1} />
      <MountainLayer z={-28} color="#2a2a48" height={13} noiseScale={0.16} yOffset={0}  />
      <MountainLayer z={-10} color="#3a3040" height={10} noiseScale={0.18} yOffset={1}  />

      {CLOUD_DATA.map((d, i) => <Cloud key={i} data={d} />)}
      <Temple />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#2a2018" roughness={0.9} />
      </mesh>

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.8} mipmapBlur />
        <Vignette eskil={false} offset={0.3} darkness={0.55} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
