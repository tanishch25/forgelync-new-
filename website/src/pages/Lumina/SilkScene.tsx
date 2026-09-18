import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { SilkMaterial } from './shaders/SilkShader';

extend({ SilkMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      silkMaterial: any;
    }
  }
}

export function SilkScene() {
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = window.scrollY / maxScroll;
      materialRef.current.uScrollProgress = progress;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      
      <mesh rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, -2]}>
        {/* Plane with high segment count for smooth vertex displacement */}
        <planeGeometry args={[12, 12, 128, 128]} />
        {/* @ts-ignore */}
        <silkMaterial 
          ref={materialRef} 
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Luxury Dust Particles */}
      <Sparkles count={150} scale={12} size={1.5} speed={0.4} opacity={0.3} color="#D4AF37" />
    </>
  );
}
