import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export function Monolith() {
    const meshRef = useRef<THREE.Mesh>(null!)
    const groupRef = useRef<THREE.Group>(null!)

    // Anti-Gravity Parameters
    // Prime number frequencies to avoid repetition
    const freq = {
        x: 0.3,
        y: 0.5,
        z: 0.2
    }
    const amp = {
        x: 0.2,
        y: 0.3,
        z: 0.1
    }

    useFrame((state) => {
        if (!meshRef.current) return

        const t = state.clock.getElapsedTime()

        // 1. Anti-Gravity Float (Superposition of Sines)
        // Position drift
        meshRef.current.position.x = Math.sin(t * freq.x) * amp.x
        meshRef.current.position.y = Math.cos(t * freq.y) * amp.y
        meshRef.current.position.z = Math.sin(t * freq.z) * amp.z

        // Rotational drift (Tumbling in void)
        meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.05
        meshRef.current.rotation.z = Math.cos(t * 0.15) * 0.05
        meshRef.current.rotation.y += 0.002 // Slow constant spin

        // 2. Sync to DOM (Hybrid Typography)
        // We project the mesh position to screen coordinates and update the store
        // so the DOM text can follow.
        const vector = meshRef.current.position.clone()
        vector.project(state.camera)

        // Push 2D coordinates to store for Hero.tsx to use
        // We accept [x, y] in NDC (-1 to 1)
        useStore.setState({ monolithPosition: [vector.x, vector.y] })
    })

    return (
        <group ref={groupRef}>
            {/* The Monolith */}
            <RoundedBox
                ref={meshRef}
                args={[4, 6, 1]} // Width, Height, Depth
                radius={0.05} // Bevel radius
                smoothness={4} // Segments
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color="#111111"
                    roughness={0.2}
                    metalness={0.8}
                    envMapIntensity={1}
                />
            </RoundedBox>

            {/* 3D Text (Hidden deeply or fused? The prompt implies transition) */}
            {/* For now we place it, but it handles the "Warp" phase later */}
            <group position={[0, 0, 0.6]}>
                {/* 3D text placement if needed, but Thesis says start with HTML */}
            </group>
        </group>
    )
}
