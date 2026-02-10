import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

function getCloudTexture() {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')
    if (context) {
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        context.fillStyle = gradient
        context.fillRect(0, 0, 64, 64)
    }
    const texture = new THREE.CanvasTexture(canvas)
    return texture
}

export const MemoryField = () => {
    const phase = useStore(state => state.phase)
    const pointsRef = useRef<THREE.Points>(null)
    const texture = useMemo(() => getCloudTexture(), [])

    // Cloud/Nebula particles
    const count = 150 // Dense but performant
    const [positions, opacities] = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const op = new Float32Array(count)
        for (let i = 0; i < count; i++) {
            // Spiral distribution
            const angle = Math.random() * Math.PI * 2
            const radius = 10 + Math.random() * 30
            const height = (Math.random() - 0.5) * 15

            pos[i * 3] = Math.cos(angle) * radius
            pos[i * 3 + 1] = height
            pos[i * 3 + 2] = Math.sin(angle) * radius

            op[i] = Math.random() * 0.5 + 0.1
        }
        return [pos, op]
    }, [])

    useFrame((state) => {
        if (!pointsRef.current) return

        // Slow rotation
        pointsRef.current.rotation.y += 0.0003

        // Slight undulation
        pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.05

        // Scroll influence (turbulence)
        const scrollSpeed = useStore.getState().scrollSpeed
        if (scrollSpeed > 0.1) {
            pointsRef.current.rotation.y += scrollSpeed * 0.002
        }
    })

    if (phase === 'entry') return null

    return (
        <group position={[0, -10, 0]}> {/* Lower in scene */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={positions}
                        itemSize={3}
                        args={[positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-opacity"
                        count={count}
                        array={opacities}
                        itemSize={1}
                        args={[opacities, 1]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    map={texture}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    size={12} // Large soft particles
                    vertexColors={false}
                    color="#404040" // Dark grey fog
                    opacity={0.15}
                    sizeAttenuation={true}
                />
            </points>
        </group>
    )
}
