import { useRef, useMemo } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Wave distortion that intensifies based on scroll speed/position
    float wave = sin(pos.x * 3.0 + uTime) * cos(pos.y * 3.0 + uTime);
    pos.z += wave * 0.1 * (1.0 - abs(uScroll - 0.5) * 2.0); // Most distorted in the middle of the transition

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTex1;
  uniform sampler2D uTex2;
  uniform sampler2D uTex3;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uScroll;
  uniform float uOverride;
  
  // Classic Perlin 2D Noise 
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    
    // Liquid mouse distortion
    float dist = distance(uv, uMouse);
    float ripple = smoothstep(0.6, 0.0, dist);
    
    vec2 distortedUv = uv;
    distortedUv.x -= sin(uv.y * 15.0 + uTime) * 0.03 * ripple;
    distortedUv.y += cos(uv.x * 15.0 + uTime) * 0.03 * ripple;

    // Transition effect using noise
    float noiseVal = snoise(uv * 4.0 + uTime * 0.2);
    
    // The original scroll value drives a threshold through the noise (scale scroll to cover the range 0 to 2)
    float scrollWipe = uScroll * 2.5 - 0.25;
    float threshold = smoothstep(scrollWipe - 0.3, scrollWipe + 0.3, noiseVal + uv.y);
    
    // Mix the two primary textures based on the threshold
    vec4 tex1 = texture2D(uTex1, distortedUv);
    vec4 tex2 = texture2D(uTex2, distortedUv + vec2(noiseVal * 0.1 * (1.0 - threshold)));
    
    // We mix based on the noise threshold!
    vec4 baseColor = mix(tex1, tex2, 1.0 - threshold);
    
    // Add RGB split during primary transition
    float splitAmt = (1.0 - abs(uScroll - 0.5) * 2.0) * 0.1;
    if (splitAmt > 0.01) {
      baseColor.r = mix(texture2D(uTex1, distortedUv + vec2(splitAmt)).r, texture2D(uTex2, distortedUv + vec2(splitAmt)).r, 1.0 - threshold);
      baseColor.b = mix(texture2D(uTex1, distortedUv - vec2(splitAmt)).b, texture2D(uTex2, distortedUv - vec2(splitAmt)).b, 1.0 - threshold);
    }
    
    // NOW OVERRIDE WITH TEXTURE 3 WHEN uOverride IS ACTIVE
    float overrideWipe = uOverride * 2.5 - 0.25;
    float overrideThreshold = smoothstep(overrideWipe - 0.3, overrideWipe + 0.3, noiseVal + uv.y);
    vec4 tex3 = texture2D(uTex3, distortedUv + vec2(noiseVal * 0.1 * (1.0 - overrideThreshold)));
    
    // Combine base and override
    vec4 finalColor = mix(baseColor, tex3, 1.0 - overrideThreshold);

    // Global darkening for intense contrast and readability
    finalColor.rgb *= 0.65;

    // Vignette
    float vignette = smoothstep(1.5, 0.3, length(uv - 0.5));
    finalColor.rgb *= vignette;
    
    gl_FragColor = finalColor;
  }
`;

export function WebGLScene({ mouseX, mouseY, scrollProgress = 0, showMesh = 0 }: { mouseX: number, mouseY: number, scrollProgress?: number, showMesh?: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Load the 3 textures
  const [tex1, tex2, tex3] = useLoader(THREE.TextureLoader, ['/sculpture.jpg', '/silk.jpg', '/mesh.jpg']);
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTex1: { value: tex1 },
    uTex2: { value: tex2 },
    uTex3: { value: tex3 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uOverride: { value: 0 }
  }), [tex1, tex2, tex3]);

  // Smoothly animate the uniforms
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Target scroll (smoothing out the raw scroll progress)
      materialRef.current.uniforms.uScroll.value += (scrollProgress - materialRef.current.uniforms.uScroll.value) * 0.05;
      
      // Target override (smoothing out the mesh override)
      materialRef.current.uniforms.uOverride.value += (showMesh - materialRef.current.uniforms.uOverride.value) * 0.05;
      
      const targetX = mouseX / window.innerWidth;
      const targetY = 1.0 - (mouseY / window.innerHeight);
      
      materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.05;
      materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.05;
    }
  });

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
    <mesh scale={[scaleX, scaleY, 1]} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
