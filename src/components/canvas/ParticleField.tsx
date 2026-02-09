import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
//
import { PointMaterial } from '@react-three/drei'
import { useStore } from '../../store/useStore'

export function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null)

    // Create particles
    const particleCount = 200
    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3)
        const vels = []

        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100
            pos[i * 3 + 1] = (Math.random() - 0.5) * 100
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50

            vels.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            })
        }
        return [pos, vels]
    }, [])

    useFrame(() => {
        if (!pointsRef.current) return

        const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
        // Access store state directly without subscription/re-render
        const scrollVelocity = useStore.getState().scrollSpeed || 0

        // Update positions
        for (let i = 0; i < particleCount; i++) {
            // Add velocity + scroll influence
            pos[i * 3] += velocities[i].x + (scrollVelocity * 0.05) // Tuned sensitivity
            pos[i * 3 + 1] += velocities[i].y
            pos[i * 3 + 2] += velocities[i].z

            // Wrap around
            if (pos[i * 3] > 50) pos[i * 3] = -50
            if (pos[i * 3] < -50) pos[i * 3] = 50
            if (pos[i * 3 + 1] > 50) pos[i * 3 + 1] = -50
            if (pos[i * 3 + 1] < -50) pos[i * 3 + 1] = 50
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true
        pointsRef.current.rotation.y += 0.001
        pointsRef.current.rotation.x += 0.0005
    })

    return (
        <group>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={positions}
                        itemSize={3}
                        args={[positions, 3]}
                    />
                </bufferGeometry>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.5}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.6}
                />
            </points>
        </group>
    )
}
