import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

// Simple Geometric Proxy for the Astronaut
function GeometricAstronaut({ floatOffset = 0 }) {
    const group = useRef<THREE.Group>(null!)
    const headRef = useRef<THREE.Group>(null!)

    // Floating Logic
    useFrame((state) => {
        const t = state.clock.elapsedTime + floatOffset

        // Procedural Float (Lissajous - Thesis 4.2)
        if (group.current) {
            // Complex non-repeating pattern
            // x = A sin(at + delta)
            // y = B sin(bt)
            group.current.position.x = Math.sin(t * 0.3) * 0.2 + Math.cos(t * 0.17) * 0.1
            group.current.position.y = Math.sin(t * 0.23) * 0.15 + Math.cos(t * 0.11) * 0.05
            group.current.position.z = Math.sin(t * 0.19) * 0.1

            // Rotational Tumble
            group.current.rotation.z = Math.sin(t * 0.11) * 0.05
            group.current.rotation.x += 0.0005 // Constant slow tumble
            group.current.rotation.y += 0.001
        }

        // Head IK (Blueprint 5.2)
        if (headRef.current) {
            // Look at camera
            const target = state.camera.position.clone()
            headRef.current.lookAt(target)
        }
    })

    return (
        <group ref={group}>
            {/* Head */}
            <group ref={headRef} position={[0, 1.6, 0]}>
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[0.25, 32, 32]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} />
                </mesh>
                {/* Visor */}
                <mesh position={[0, 0, 0.18]} scale={[0.8, 0.8, 0.5]}>
                    <sphereGeometry args={[0.2, 32, 32]} />
                    <meshStandardMaterial color="#111" roughness={0.0} metalness={1.0} />
                </mesh>
            </group>

            {/* Torso */}
            <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.5, 0.6, 0.3]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Backpack (PLSS) */}
            <mesh position={[0, 1.2, -0.25]} castShadow receiveShadow>
                <boxGeometry args={[0.6, 0.7, 0.3]} />
                <meshStandardMaterial color="#dddddd" />
            </mesh>

            {/* Limbs (Static for now, just visual) */}
            <mesh position={[-0.35, 1.0, 0]} rotation={[0, 0, 0.2]}>
                <capsuleGeometry args={[0.08, 0.6]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.35, 1.0, 0]} rotation={[0, 0, -0.2]}>
                <capsuleGeometry args={[0.08, 0.6]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.2, 0.4, 0]} rotation={[0, 0, 0.1]}>
                <capsuleGeometry args={[0.1, 0.7]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.2, 0.4, 0]} rotation={[0, 0, -0.1]}>
                <capsuleGeometry args={[0.1, 0.7]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Html position={[0.6, 1.5, 0]} distanceFactor={10} occlude>
                <div style={{
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    textAlign: 'left',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    borderLeft: '2px solid rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(4px)',
                    width: '150px'
                }}>
                    <div style={{ opacity: 0.6, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target</div>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>Unknown Entity</div>
                    <div style={{ opacity: 0.8 }}>Status: Drifting</div>
                </div>
            </Html>
        </group>
    )
}

export function AstronautContainer({ anchor }: { anchor: [number, number, number] }) {
    return (
        <group position={anchor}>
            <GeometricAstronaut />
        </group>
    )
}
