import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function EclipseScene() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Create a massive web3 particle field (5,000 nodes) natively
  const sphere = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 18 * Math.cbrt(Math.random());
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    // Aggressive scroll hijacking
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const scrollProgress = window.scrollY / maxScroll;
    
    // Warps the camera FOV into a hyperspace tunnel effect as you scroll
    const camera = state.camera as THREE.PerspectiveCamera;
    camera.fov = THREE.MathUtils.lerp(35, 120, scrollProgress);
    camera.updateProjectionMatrix();

    // Chaotic mouse parallax
    const mouseX = (state.pointer.x * Math.PI) / 4;
    const mouseY = (state.pointer.y * Math.PI) / 4;
    
    if (coreRef.current) {
      // Core pulses and spins violently
      coreRef.current.rotation.y += delta * (0.2 + scrollProgress * 5.0);
      coreRef.current.rotation.x += delta * (0.1 + scrollProgress * 3.0);
      coreRef.current.position.x = THREE.MathUtils.lerp(coreRef.current.position.x, mouseX * 2, 0.1);
      coreRef.current.position.y = THREE.MathUtils.lerp(coreRef.current.position.y, mouseY * 2, 0.1);
      
      const coreMat = coreRef.current.material as any;
      coreMat.distort = THREE.MathUtils.lerp(0.3, 1.5, scrollProgress);
      coreMat.speed = THREE.MathUtils.lerp(2.0, 15.0, scrollProgress);
    }

    if (ring1Ref.current && ring2Ref.current) {
      ring1Ref.current.rotation.x += delta * (1.0 + scrollProgress * 10.0);
      ring1Ref.current.rotation.y -= delta * 0.5;
      ring2Ref.current.rotation.z -= delta * (1.5 + scrollProgress * 15.0);
      ring2Ref.current.rotation.y += delta * 0.8;
    }

    if (pointsRef.current) {
      // Particles swirl like a vortex
      pointsRef.current.rotation.y -= delta * (0.1 + scrollProgress * 2.0);
      pointsRef.current.rotation.z -= delta * (0.05 + scrollProgress * 1.0);
      pointsRef.current.position.z = scrollProgress * 5; // Flies into the camera
    }
  });

  return (
    <>
      <Environment preset="night" environmentIntensity={1.0} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={5.0} color="#00FF41" />
      <directionalLight position={[-10, -10, -5]} intensity={5.0} color="#FF003C" />

      {/* The Impossible Geometry */}
      <Float speed={2.5} rotationIntensity={1.0} floatIntensity={2.0}>
        <group>
          {/* Liquid Chrome Core */}
          <mesh ref={coreRef} scale={1.5}>
            <icosahedronGeometry args={[1, 32]} />
            <MeshDistortMaterial 
              color="#050505" 
              envMapIntensity={3.0} 
              clearcoat={1} 
              clearcoatRoughness={0.1} 
              metalness={1} 
              roughness={0.0}
              distort={0.4} 
              speed={2} 
            />
          </mesh>

          {/* Aggressive Wireframe Ring 1 */}
          <mesh ref={ring1Ref}>
            <torusGeometry args={[2.5, 0.05, 16, 100]} />
            <meshStandardMaterial color="#00FF41" wireframe emissive="#00FF41" emissiveIntensity={2} />
          </mesh>

          {/* Aggressive Wireframe Ring 2 */}
          <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[3.2, 0.02, 16, 100]} />
            <meshStandardMaterial color="#FF003C" wireframe emissive="#FF003C" emissiveIntensity={2} />
          </mesh>
        </group>
      </Float>

      {/* Web3 Node Network */}
      <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#ffffff" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
      </Points>

      {/* Extreme Ambient Sparks */}
      <Sparkles count={1000} scale={25} size={3} speed={0.8} opacity={0.8} color="#00FF41" />
    </>
  );
}
