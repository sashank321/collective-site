import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { useStore } from '../../store/useStore'

const MemoryArtifact = ({ position, type, content }: { position: THREE.Vector3, type: 'text' | 'image', content: string }) => {
    const ref = useRef<THREE.Group>(null!)
    const scrollSpeed = useStore(state => state.scrollSpeed)

    // Random float offset
    const offset = useMemo(() => Math.random() * 100, [])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        // Float logic
        ref.current.position.y = position.y + Math.sin(time * 0.5 + offset) * 0.5
        ref.current.position.x = position.x + Math.cos(time * 0.3 + offset) * 0.2

        // Distortion based on scroll speed (Chaos)
        if (scrollSpeed > 0.1) {
            ref.current.rotation.x += scrollSpeed * 0.1
            ref.current.rotation.z += scrollSpeed * 0.05
            ref.current.scale.setScalar(1 + Math.sin(time * 10) * scrollSpeed * 0.2)
        } else {
            // Return to normal
            ref.current.rotation.x *= 0.95
            ref.current.rotation.z *= 0.95
            ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
        }
    })

    return (
        <group ref={ref} position={position}>
            {type === 'text' ? (
                <Text
                    color="#404040"
                    fontSize={0.5}
                    maxWidth={4}
                    lineHeight={1}
                    letterSpacing={0.05}
                    textAlign="center"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                >
                    {content}
                </Text>
            ) : (
                <mesh>
                    <planeGeometry args={[2, 3]} />
                    <meshBasicMaterial color="#202020" wireframe />
                </mesh>
            )}
        </group>
    )
}

export const MemoryField = () => {
    const phase = useStore(state => state.phase)

    const artifacts = useMemo(() => {
        return new Array(8).fill(0).map((_, i) => ({
            id: i,
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10 - 5
            ),
            type: Math.random() > 0.5 ? 'text' : 'image',
            content: Math.random() > 0.5 ? "MEMORY FRAGMENT" : "LOST SIGNAL"
        }))
    }, [])

    if (phase === 'entry') return null

    return (
        <group>
            {artifacts.map((art: any) => (
                <MemoryArtifact key={art.id} position={art.position} type={art.type} content={art.content} />
            ))}
        </group>
    )
}
