import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, MeshTransmissionMaterial, Sparkles, Text } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { FloatingImages } from './FloatingImages';

import { useGLTF } from '@react-three/drei';

// Pre-load the GLTF
useGLTF.preload('/perfume.glb');

export function PerfumeScene() {
  const { nodes } = useGLTF('/perfume.glb') as any;
  const group = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Mesh>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.Mesh>(null);

  // Store base Y positions for physics from the GLB
  const baseCapY = nodes.Cylinder.position.y;
  const baseNeckY = nodes.Cylinder2.position.y;

  useFrame((state, delta) => {
    if (group.current && capRef.current && glassRef.current && neckRef.current) {
      const stickyScrollEnd = window.innerHeight * 3.5;
      const progress = Math.min(1, Math.max(0, window.scrollY / stickyScrollEnd));
      
      let capLift = 0;
      let neckLift = 0;
      let glassScale = 1;
      let capSpin = 0;
      
      // Extremely satisfying animation with smoothstep easing
      if (progress > 0.1 && progress < 0.9) {
        const normalized = (progress - 0.1) / 0.8;
        // Custom easing for a heavy, mechanical feel
        const ease = THREE.MathUtils.smoothstep(normalized, 0, 1);
        const bellCurve = Math.sin(ease * Math.PI);
        
        capLift = bellCurve * 1.8; 
        neckLift = bellCurve * 0.6;
        glassScale = 1 + (bellCurve * 0.08); 
        // Cap elegantly unscrews/rotates as it lifts
        capSpin = bellCurve * Math.PI * 1.5;
      }
      
      const mouseTiltX = (state.pointer.y * Math.PI) * 0.1;
      const mouseTiltY = (state.pointer.x * Math.PI) * 0.15;
      
      const targetRotationY = (progress * Math.PI * 4) + mouseTiltY; 
      const targetRotationX = (Math.sin(progress * Math.PI) * 0.15) + mouseTiltX;
      
      const damp = 5;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotationY, damp, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotationX, damp, delta);
      
      capRef.current.position.y = THREE.MathUtils.damp(capRef.current.position.y, baseCapY + capLift, damp, delta);
      capRef.current.rotation.y = THREE.MathUtils.damp(capRef.current.rotation.y, capSpin, damp, delta);
      
      neckRef.current.position.y = THREE.MathUtils.damp(neckRef.current.position.y, baseNeckY + neckLift, damp, delta);
      glassRef.current.scale.setScalar(THREE.MathUtils.damp(glassRef.current.scale.x, glassScale, damp, delta));
    }
  });

  return (
    <>
      {/* Clean, understated studio lighting - perfectly balanced */}
      <Environment preset="studio" environmentIntensity={1.0} />
      <ambientLight intensity={0.5} />
      
      {/* Reduced spotlight count and intensity for a softer, more natural look */}
      <spotLight position={[5, 10, 5]} intensity={2.0} angle={0.2} penumbra={1} color="#ffffff" />
      <spotLight position={[-5, 5, -5]} intensity={1.5} angle={0.2} penumbra={1} color="#FF9C33" />

      <FloatingImages />

      <Float speed={2.0} rotationIntensity={0.05} floatIntensity={0.2}>
        <group ref={group} position={[0, -1, 0]}>
          
          <mesh 
            ref={glassRef} 
            geometry={nodes.Cube.geometry} 
            position={nodes.Cube.position} 
            quaternion={nodes.Cube.quaternion}
            scale={nodes.Cube.scale}
          >
            {/* Highly optimized, elegant glass - less distortion, clean edges */}
            <MeshTransmissionMaterial 
              backside
              samples={3}
              thickness={1.5} 
              roughness={0.02}
              ior={1.45} 
              color="#ffffff"
            />
            
            <mesh 
              geometry={nodes['1'].geometry}
              position={nodes['1'].position}
              quaternion={nodes['1'].quaternion}
              scale={nodes['1'].scale}
            >
              {/* Clean, performant amber liquid */}
              <meshPhysicalMaterial 
                roughness={0.1}
                metalness={0.1}
                color="#E68A00" 
                transmission={0.9}
                ior={1.33}
                transparent={true}
                opacity={0.95}
              />
            </mesh>

            {/* Dip Tube */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 2.5, 8]} />
              <meshPhysicalMaterial transparent opacity={0.3} transmission={0.9} ior={1.4} color="#ffffff" />
            </mesh>
            
            {/* Minimalist Glass Engraving */}
            <group position={[0, 0, 0.54]}>
              <Text position={[0, 0.15, 0]} fontSize={0.28} color="#1A1918" letterSpacing={0.3} fontWeight="bold" anchorX="center" anchorY="middle">
                LUMINA
              </Text>
              <Text position={[0, -0.25, 0]} fontSize={0.09} color="#1A1918" letterSpacing={0.5} anchorX="center" anchorY="middle">
                PARIS
              </Text>
            </group>
          </mesh>

          <mesh 
            ref={neckRef} 
            geometry={nodes.Cylinder2.geometry}
            position={nodes.Cylinder2.position}
            quaternion={nodes.Cylinder2.quaternion}
            scale={nodes.Cylinder2.scale}
          >
            <meshStandardMaterial metalness={1} roughness={0.15} color="#C4A358" />
          </mesh>

          <mesh 
            ref={capRef} 
            geometry={nodes.Cylinder.geometry}
            position={nodes.Cylinder.position}
            quaternion={nodes.Cylinder.quaternion}
            scale={nodes.Cylinder.scale}
          >
            <MeshTransmissionMaterial 
              backside
              samples={3}
              thickness={1.2}
              roughness={0.02}
              ior={1.45}
              color="#ffffff"
            />
            {/* Inner Gold Insert */}
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.5, 32]} />
              <meshStandardMaterial metalness={1} roughness={0.15} color="#C4A358" />
            </mesh>
          </mesh>

        </group>
      </Float>

      {/* Floating Gold Dust Particles */}
      <Sparkles count={40} scale={15} size={1.5} speed={0.1} opacity={0.4} color="#D4AF37" />

      {/* Photorealistic Soft Contact Shadow */}
      <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={15} blur={2.0} far={5} color="#000000" />

      {/* Subtle vignette, Bloom removed for cleaner performance and modern look */}
      <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </>
  );
}
