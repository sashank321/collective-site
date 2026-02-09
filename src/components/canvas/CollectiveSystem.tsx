import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { members } from '../../data/members'
import { useStore } from '../../store/useStore'
import { MeshDistortMaterial } from '@react-three/drei'

const NODE_SIZE = 0.5

function Node({ member, position }: { member: any, position: THREE.Vector3 }) {
    const mesh = useRef<THREE.Mesh>(null!)
    const setHovered = useStore(state => state.setHoveredNode)
    const cursorSpeed = useStore(state => state.cursorSpeed)

    // Random offset for "floating" feel
    const offset = useMemo(() => Math.random() * 100, [])

    useFrame((state) => {
        // Floating motion
        const time = state.clock.getElapsedTime()
        mesh.current.position.y = position.y + Math.sin(time + offset) * 0.1
        mesh.current.position.x = position.x + Math.cos(time * 0.5 + offset) * 0.05

        // Look at camera (billboard effect if we use planes, but using spheres currently)
    })

    return (
        <mesh
            ref={mesh}
            position={position}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(member.id) }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(null) }}
        >
            <sphereGeometry args={[NODE_SIZE, 32, 32]} />
            <MeshDistortMaterial
                color={member.color}
                emissive={member.color}
                emissiveIntensity={0.2 + cursorSpeed * 0.5}
                roughness={0.2}
                metalness={0.8}
                distort={0.4 + cursorSpeed * 0.5}
                speed={2 + cursorSpeed * 5}
            />
        </mesh>
    )
}

export const CollectiveSystem = () => {
    // Initial random positions
    const [positions] = useState(() => members.map(() => new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
    )))

    const { attractionStrength, repulsionStrength, phase } = useStore()
    const mouse = useRef(new THREE.Vector3())
    const groupRef = useRef<THREE.Group>(null!)

    useFrame((state) => {
        // Animation based on phase
        const targetScale = phase === 'entry' ? 0 : 1
        if (groupRef.current) {
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.02)
        }

        // Update mouse position
        mouse.current.set(state.mouse.x * 5, state.mouse.y * 5, 0)

        // Physics Loop (only if visible-ish)
        if (phase !== 'entry' || (groupRef.current && groupRef.current.scale.x > 0.01)) {
            for (let i = 0; i < members.length; i++) {
                const pos = positions[i]
                const force = new THREE.Vector3()

                // 1. Attraction to Center (Gravity)
                force.add(pos.clone().negate().multiplyScalar(0.01 * attractionStrength))

                // 2. Repulsion from other nodes
                for (let j = 0; j < members.length; j++) {
                    if (i === j) continue
                    const other = positions[j]
                    const diff = pos.clone().sub(other)
                    const dist = diff.length()

                    if (dist < 3) {
                        const repel = diff.normalize().multiplyScalar(repulsionStrength / (dist * dist + 0.1))
                        force.add(repel.multiplyScalar(0.05))
                    }
                }

                // 3. Mouse Repulsion/Attraction
                const mouseDiff = pos.clone().sub(mouse.current)
                const mouseDist = mouseDiff.length()
                if (mouseDist < 4) {
                    const mouseForce = mouseDiff.normalize().multiplyScalar(0.05 / (mouseDist + 0.01))
                    force.add(mouseForce)
                }

                // Apply velocity
                pos.add(force)
            }
        }
    })

    return (
        <group ref={groupRef}>
            {members.map((member, i) => (
                <Node key={member.id} member={member} position={positions[i]} />
            ))}
        </group>
    )
}
