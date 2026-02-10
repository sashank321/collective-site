import { useMemo } from 'react'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

// 1. Terrain Shader (Simplex Noise based)
const TerrainMaterial = shaderMaterial(
    { uColor: new THREE.Color('#ffffff'), uTime: 0, uNoiseScale: 2.0 },
    // Vertex
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vDisplacement;
    
    // Simplex noise function (simplified/placeholder for conciseness)
    // In production we'd include a full glsl noise function
    // utilizing ashima's noise or similar.
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
      vNormal = normalize(normalMatrix * normal);
      
      // Displacement
      float noise = snoise(position * uNoiseScale);
      vDisplacement = noise;
      
      vec3 pos = position + normal * noise * 0.2;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    // Fragment
    `
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying float vDisplacement;
    
    void main() {
      // Simple biome mapping based on displacement
      vec3 color = uColor;
      if (vDisplacement > 0.1) color *= 1.2; // Peaks
      if (vDisplacement < -0.1) color *= 0.8; // Valleys
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

// 2. Atmosphere Shader (Fresnel + Rayleigh)
const AtmosphereMaterial = shaderMaterial(
    { uColor: new THREE.Color('#00aaff'), uViewVector: new THREE.Vector3() },
    // Vertex
    `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment
    `
    uniform vec3 uColor;
    varying vec3 vNormal;
    
    void main() {
      // Fresnel
      // calculate view direction in view space (it's roughly 0,0,1 looking down Z)
      // Actually vNormal is in View Space. View Dir is (0,0,1).
      float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
      
      gl_FragColor = vec4(uColor, 1.0) * intensity * 1.5;
    }
  `
)

extend({ TerrainMaterial, AtmosphereMaterial })

type PlanetProps = {
    position: [number, number, number]
    radius: number
    color: string
}

export function Planet({ position, radius, color }: PlanetProps) {
    const terrainRef = useMemo(() => new THREE.Color(color), [color])

    return (
        <group position={position}>
            {/* Terrain Mesh */}
            <mesh>
                <sphereGeometry args={[radius, 64, 64]} />
                {/* @ts-ignore */}
                <terrainMaterial uColor={terrainRef} uNoiseScale={2.0} />
            </mesh>

            {/* Atmosphere Mesh */}
            <mesh scale={1.2}>
                <sphereGeometry args={[radius, 32, 32]} />
                {/* @ts-ignore */}
                <atmosphereMaterial uColor={new THREE.Color('#88ccff')} transparent blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </mesh>
        </group>
    )
}
