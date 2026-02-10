import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

const COUNT = 300

export function ParticleField() {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const { phase } = useStore()

    // Stable random positions
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < COUNT; i++) {
            const x = (Math.random() - 0.5) * 100
            const y = (Math.random() - 0.5) * 100
            const z = (Math.random() - 0.5) * 100
            const speed = 0.1 + Math.random() * 0.5
            temp.push({ x, y, z, speed, initialZ: z })
        }
        return temp
    }, [])

    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame((_state) => {
        if (!meshRef.current) return

        const scrollSpeed = useStore.getState().scrollSpeed
        // Calculate warp factor
        const warp = Math.max(1, scrollSpeed * 20)

        // Optimize: Only verify bounds/update every frame, but performant
        particles.forEach((particle, i) => {
            // Move particle towards camera (Z+)
            // Base speed + scroll boost
            let zMove = particle.speed * 0.1
            if (scrollSpeed > 0.1) {
                zMove += scrollSpeed * 0.5
            }

            particle.z += zMove

            // Reset if passed camera
            if (particle.z > 30) {
                particle.z = -100
                particle.x = (Math.random() - 0.5) * 100
                particle.y = (Math.random() - 0.5) * 100
            }

            // Update dummy object
            dummy.position.set(particle.x, particle.y, particle.z)
            dummy.scale.set(1, 1, warp) // Stretch on Z
            dummy.updateMatrix()

            meshRef.current!.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current!.instanceMatrix.needsUpdate = true

        // Fade in
        if (meshRef.current.material instanceof THREE.Material) {
            meshRef.current.material.opacity = phase === 'entry' ? 0 : 0.6
        }
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
            <boxGeometry args={[0.05, 0.05, 1.0]} />
            <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </instancedMesh>
    )
}
