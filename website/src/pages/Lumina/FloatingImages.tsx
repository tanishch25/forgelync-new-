import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';

const IMAGES = [
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/2916814/pexels-photo-2916814.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/2836486/pexels-photo-2836486.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/2703202/pexels-photo-2703202.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3317434/pexels-photo-3317434.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/247204/pexels-photo-247204.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/932401/pexels-photo-932401.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200'
];

export function FloatingImages() {
  const group = useRef<THREE.Group>(null);
  
  // Track which image is clicked/active
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  
  const imageProps = useMemo(() => {
    return IMAGES.map((url, i) => {
      // Even distribution
      const baseAngle = (i / IMAGES.length) * Math.PI * 2;
      
      // Beautiful wave distribution for Y instead of random clustering
      const y = Math.sin(baseAngle * 3) * 6; 
      
      const scale = 1.0 + (i % 3 === 0 ? 0.8 : 0.4); // Intentional pattern of sizes
      
      return { url, y, scale, speed: 0.2, baseAngle }; // Constant speed prevents clumping
    });
  }, []);

  useFrame((_, delta) => {
    if (group.current) {
      // Gentle scroll parallax instead of flying off screen
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const rawProgress = window.scrollY / maxScroll;
      
      const targetY = rawProgress * 8; 
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 3, delta);
    }
  });

  return (
    <group ref={group}>
      {imageProps.map((props, i) => (
        <InteractiveImage 
          key={i} 
          {...props}
          isActive={activeIdx === i}
          onClick={(e: any) => {
            e.stopPropagation();
            setActiveIdx(activeIdx === i ? null : i);
          }}
        />
      ))}
    </group>
  );
}

function InteractiveImage({ url, y, scale, speed, baseAngle, isActive, onClick }: any) {
  const meshRef = useRef<any>(null);
  
  // Radius from center
  const radius = useMemo(() => 6 + Math.random() * 2, []);

  useFrame((state, _) => {
    if (!meshRef.current) return;

    if (isActive) {
      // Move to center of screen, scale up, and face camera
      meshRef.current.position.lerp(new THREE.Vector3(0, -state.camera.position.y + 1, 3), 0.1);
      meshRef.current.quaternion.slerp(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)), 0.1);
      meshRef.current.scale.lerp(new THREE.Vector3(scale * 1.5, scale * 2.2, 1), 0.1);
      meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, 1, 0.1);
    } else {
      // Carousel Orbit Math
      const currentAngle = baseAngle + (state.clock.elapsedTime * speed * 0.3);
      const curX = Math.cos(currentAngle) * radius;
      const curZ = Math.sin(currentAngle) * radius - 4; // Orbit around z=-4 (behind bottle)
      
      meshRef.current.position.lerp(new THREE.Vector3(curX, y, curZ), 0.1);
      meshRef.current.scale.lerp(new THREE.Vector3(scale * 0.8, scale, 1), 0.1);
      meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, 0.6, 0.05);
      
      // Perfect Billboarding: Always elegantly face the camera
      meshRef.current.lookAt(0, 0, 8);
    }
  });

  return (
    <Image 
      ref={meshRef}
      url={url}
      transparent
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
      onClick={onClick}
    />
  );
}
