import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

// Shader Material
const WarpStarMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uVelocity: { value: 0 },
        uColor: { value: new THREE.Color('#ffffff') }
    },
    vertexShader: `
        uniform float uTime;
        uniform float uVelocity;
        attribute vec3 aRandom; // x: size, y: speed offset, z: stretch factor
        
        varying float vAlpha;
        
        void main() {
            vec3 pos = position;
            
            // Infinite Tunnel Logic (Modulo)
            // Range: -1000 to 1000 depth
            float depth = 2000.0;
            float z = mod(pos.z + (uTime * 50.0) + (uVelocity * 100.0), depth) - (depth * 0.5);
            pos.z = z;
            
            // Velocity Stretch
            // We stretch along Z based on velocity and random factor
            float stretch = 1.0 + (uVelocity * aRandom.z * 50.0);
            pos.z *= stretch; 
            // Note: This naive stretch might distort the tunnel "box", 
            // better to stretch the geometry or use a trail. 
            // For a point/plane, scaling Z works if it's not a billboard.
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Size Attenuation
            gl_PointSize = (100.0 * aRandom.x) / -mvPosition.z;
            
            // Fade Logic (Fog)
            // Fade out at far boundaries to prevent popping
            float dist = abs(pos.z);
            float fade = 1.0 - smoothstep(800.0, 1000.0, dist);
            vAlpha = fade;

            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        varying float vAlpha;
        uniform vec3 uColor;
        
        void main() {
            // Circle Shape
            vec2 uv = gl_PointCoord.xy - 0.5;
            float r = length(uv);
            if (r > 0.5) discard;
            
            // Soft edge
            float glow = 1.0 - (r * 2.0);
            glow = pow(glow, 1.5);
            
            gl_FragColor = vec4(uColor, vAlpha * glow);
        }
    `
}

export function WarpStars({ count = 10000 }) {
    const meshRef = useRef<THREE.Points>(null!)
    const materialRef = useRef<THREE.ShaderMaterial>(null!)

    // Generate Attributes
    const [positions, randoms] = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const rnd = new Float32Array(count * 3)

        for (let i = 0; i < count; i++) {
            // Cylinder / Tunnel Distribution
            const r = 20 + Math.random() * 300 // Inner radius 20, outer 300
            const theta = Math.random() * Math.PI * 2

            pos[i * 3] = r * Math.cos(theta)     // x
            pos[i * 3 + 1] = r * Math.sin(theta) // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 2000 // z: -1000 to 1000

            rnd[i * 3] = Math.random() // size
            rnd[i * 3 + 1] = Math.random() // speed offset
            rnd[i * 3 + 2] = Math.random() // stretch factor
        }
        return [pos, rnd]
    }, [count])

    useFrame((state) => {
        const vel = useStore.getState().scrollSpeed || 0
        // Apply dampening to velocity uniform for smoothness
        if (materialRef.current) {
            // Lerp velocity
            materialRef.current.uniforms.uVelocity.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uVelocity.value,
                vel * 0.05, // Scaling factor
                0.1
            )
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
        }
    })

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-aRandom"
                    count={count}
                    array={randoms}
                    itemSize={3}
                    args={[randoms, 3]}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                args={[WarpStarMaterial]}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}
