import { useRef, useMemo } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHoverState;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Subtle breathing effect
    pos.z += sin(pos.x * 5.0 + uTime) * 0.02 * uHoverState;
    pos.z += cos(pos.y * 3.0 + uTime) * 0.02 * uHoverState;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uHoverState;
  
  void main() {
    vec2 uv = vUv;
    
    // Calculate distance from mouse
    float dist = distance(uv, uMouse);
    
    // Create a smooth ripple/distortion effect based on mouse proximity
    float ripple = smoothstep(0.5, 0.0, dist);
    
    // Distort UVs
    vec2 distortedUv = uv;
    distortedUv.x -= sin(uv.y * 10.0 + uTime) * 0.05 * ripple * uHoverState;
    distortedUv.y += cos(uv.x * 10.0 + uTime) * 0.05 * ripple * uHoverState;
    
    // Chromatic aberration near the mouse
    float r = texture2D(uTexture, distortedUv + vec2(0.01 * ripple)).r;
    float g = texture2D(uTexture, distortedUv).g;
    float b = texture2D(uTexture, distortedUv - vec2(0.01 * ripple)).b;
    
    vec3 color = vec3(r, g, b);
    
    // Slightly darken edges for cinematic feel
    float vignette = smoothstep(1.5, 0.5, length(uv - 0.5));
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function LiquidImage({ mouseX, mouseY }: { mouseX: number, mouseY: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const texture = useLoader(THREE.TextureLoader, '/sculpture.jpg');
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 },
    uHoverState: { value: 1.0 }
  }), [texture]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Map window mouse coordinates (px) to UV coordinates (0-1)
      const targetX = mouseX / window.innerWidth;
      // Invert Y because UV 0,0 is bottom-left, but window 0,0 is top-left
      const targetY = 1.0 - (mouseY / window.innerHeight);
      
      materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.05;
      materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.05;
    }
  });

  // Calculate plane size to cover the viewport while maintaining aspect ratio
  // Assuming the image is 16:9
  const imageAspect = 16 / 9;
  const viewportAspect = viewport.width / viewport.height;
  
  let scaleX = viewport.width;
  let scaleY = viewport.height;
  
  if (viewportAspect > imageAspect) {
    scaleY = viewport.width / imageAspect;
  } else {
    scaleX = viewport.height * imageAspect;
  }

  return (
    <mesh ref={meshRef} scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
