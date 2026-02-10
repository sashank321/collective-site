import { useRef } from 'react'
import * as THREE from 'three'

export function SceneLighting() {
    const spotLightRef = useRef<THREE.SpotLight>(null!)
    const rimLightRef = useRef<THREE.PointLight>(null!)

    return (
        <group>
            {/* Key Light: Cool, defined shadows, 45 deg angle */}
            <spotLight
                ref={spotLightRef}
                position={[10, 10, 10]}
                angle={0.3}
                penumbra={0.5}
                intensity={2}
                castShadow
                shadow-bias={-0.0001}
                color="#cceeff" // Cool cyan tint
            />

            {/* Rim Light: The Cinematic Halo. High intensity, Backlight */}
            <pointLight
                ref={rimLightRef}
                position={[0, 5, -5]}
                intensity={5}
                color="#ffaa00" // Warm rim
                distance={20}
            />

            {/* Fill Light: Subtle, from below (Stubborn Nebula reflection) */}
            <rectAreaLight
                width={10}
                height={10}
                position={[0, -10, 0]}
                color="#443355" // Deep purple/warm fill
                intensity={2}
                rotation={[-Math.PI / 2, 0, 0]} // Pointing up
            />

            {/* Ambient Base */}
            <ambientLight intensity={0.05} />
        </group>
    )
}
