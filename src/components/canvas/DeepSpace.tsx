import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

function WarpStarLayer({ count, size }: { count: number, size: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null!)

    const dummy = new THREE.Object3D()
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const t = {
                x: (Math.random() - 0.5) * 400, // Wide X
                y: (Math.random() - 0.5) * 400, // Wide Y
                z: (Math.random() - 0.5) * 600, // Deep Z
                scale: Math.random(),
                speed: Math.random() + 0.5
            }
            temp.push(t)
        }
        return temp
    }, [count])

    useFrame(() => {
        const vel = useStore.getState().scrollSpeed

        particles.forEach((p, i) => {
            // Move
            p.z += vel * p.speed * 2
            if (p.z > 300) p.z -= 600

            // Update Matrix
            dummy.position.set(p.x, p.y, p.z)

            // Stretch Z based on velocity (The Warp Effect)
            // Stretch = 1 + velocity * 10
            const stretch = 1 + (vel * 20 * p.speed)

            dummy.scale.set(size, size, size * stretch)
            dummy.updateMatrix()

            meshRef.current.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </instancedMesh>
    )
}

export function DeepSpace() {
    return (
        <group>
            {/* Warp Stars - Instanced for Stretching */}
            <WarpStarLayer count={200} size={0.2} />
            <WarpStarLayer count={100} size={0.5} />
        </group>
    )
}
