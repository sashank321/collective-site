import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Simple Geometric Proxy for the Astronaut
function GeometricAstronaut({ floatOffset = 0 }) {
    const group = useRef<THREE.Group>(null!)
    const headRef = useRef<THREE.Group>(null!)

    // Floating Logic
    useFrame((state) => {
        const t = state.clock.elapsedTime + floatOffset

        // Procedural Float
        if (group.current) {
            group.current.position.y = Math.sin(t * 0.5) * 0.5 + Math.sin(t * 1.35) * 0.2
            group.current.rotation.z = Math.sin(t * 0.2) * 0.1
            group.current.rotation.x = Math.sin(t * 0.3) * 0.1
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
