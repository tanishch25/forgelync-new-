import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

export const SilkMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollProgress: 0,
    uColor1: new THREE.Color('#1A1A1A'), // Deep Charcoal / Obsidian
    uColor2: new THREE.Color('#3A3024'), // Dark Bronze
    uAccent: new THREE.Color('#D4AF37'), // Pure Gold
    uLightPos: new THREE.Vector3(1, 2, 1),
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uScrollProgress;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      
      // Calculate scroll influence
      float scrollOffset = uScrollProgress * 5.0;
      
      // Displace vertices based on noise to simulate flowing fabric
      vec3 pos = position;
      float noiseFreq = 0.8; // Lower frequency = larger, more luxurious folds
      float noiseAmp = 1.2; // Higher amplitude = deeper, more dramatic folds
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime * 0.15, pos.y * noiseFreq - scrollOffset, pos.z);
      pos.z += snoise(noisePos) * noiseAmp;
      
      // Add secondary high-frequency ripple
      pos.z += snoise(noisePos * 2.5 + uTime * 0.4) * 0.15;
      
      // Recalculate normals roughly based on displacement
      float delta = 0.01;
      vec3 posDx = vec3(position.x + delta, position.y, position.z);
      vec3 posDy = vec3(position.x, position.y + delta, position.z);
      
      vec3 noisePosDx = vec3(posDx.x * noiseFreq + uTime * 0.15, posDx.y * noiseFreq - scrollOffset, posDx.z);
      vec3 noisePosDy = vec3(posDy.x * noiseFreq + uTime * 0.15, posDy.y * noiseFreq - scrollOffset, posDy.z);
      
      posDx.z += snoise(noisePosDx) * noiseAmp + snoise(noisePosDx * 2.5 + uTime * 0.4) * 0.15;
      posDy.z += snoise(noisePosDy) * noiseAmp + snoise(noisePosDy * 2.5 + uTime * 0.4) * 0.15;
      
      vec3 normalVec = normalize(cross(posDx - pos, posDy - pos));
      vNormal = normalMatrix * normalVec;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uAccent;
    uniform vec3 uLightPos;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      vec3 lightDir = normalize(uLightPos);
      
      // Ambient
      float ambient = 0.3;
      
      // Diffuse
      float diff = max(dot(normal, lightDir), 0.0);
      
      // Specular (Iridescent silk sheen)
      vec3 halfVector = normalize(lightDir + viewDir);
      float NdotH = max(0.0, dot(normal, halfVector));
      float specular = pow(NdotH, 64.0) * 0.8; // Soft silk specular
      
      // Fresnel effect for rim lighting and iridescent color shifting
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Mix base colors based on UV and lighting
      vec3 baseColor = mix(uColor1, uColor2, vUv.y);
      
      // Add gold accent to edges via Fresnel
      vec3 finalColor = baseColor * (ambient + diff * 0.7) + vec3(specular) + (uAccent * fresnel * 0.6);
      
      gl_FragColor = vec4(finalColor, 1.0);
      
      // Tonemapping
      gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / 2.2));
    }
  `
);
