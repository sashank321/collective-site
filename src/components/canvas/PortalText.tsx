import { useRef, useState } from 'react'
import { Text3D, MeshPortalMaterial, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import { DeepSpace } from './DeepSpace'

export function PortalText() {
    const portalRef = useRef(null!)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)

    // Blend state 0 (Void) -> 1 (Entry)
    const blendRef = useRef({ value: 0 })

    useFrame((state, delta) => {
        // Camera distance logic for automatic opening
        // We assume the text is at [0,0,0]
        const dist = state.camera.position.length()

        // Map distance to blend value.
        // Far (30) -> 0. Near (5) -> 1.
        const targetBlend = THREE.MathUtils.mapLinear(dist, 30, 5, 0, 1)
        const clampedBlend = THREE.MathUtils.clamp(targetBlend, 0, 1)

        // Smooth transition
        easing.damp(blendRef.current, 'value', clampedBlend, 0.2, delta)
    })

    return (
        <group>
            <Text3D
                font="/fonts/Inter_Bold.json"
                size={5}
                letterSpacing={-0.1}
                height={1}
                position={[-12, -2, 0]} // Center "USELESS" roughly
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                USELESS
                <MeshPortalMaterial
                    ref={portalRef}
                    blend={blendRef.current.value}
                    side={THREE.DoubleSide}
                    resolution={512} // Adjusted for balance
                    blur={1} // Slight blur for dreamlike quality
                >
                    {/* The World Inside the Text */}
                    <color attach="background" args={['#000']} />
                    <ambientLight intensity={1} />
                    <DeepSpace />
                    {/* A preview of the galaxy inside the text */}
                </MeshPortalMaterial>
            </Text3D>
        </group>
    )
}
