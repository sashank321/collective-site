import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'
// import { useStore } from '../../store/useStore'
import { PlanetMaterial } from './shaders/PlanetMaterial'
import { AtmosphereMaterial } from './shaders/AtmosphereMaterial'
import { AstronautContainer } from './Astronaut'

// Register shaders
extend({ PlanetMaterial, AtmosphereMaterial })

export function PlanetarySystem() {
    const planetRef = useRef<THREE.Mesh>(null!)
    const atmosRef = useRef<THREE.Mesh>(null!)
    const groupRef = useRef<THREE.Group>(null!)

    // Data for the journey (could be externalized)
    const planets = useMemo(() => [
        { name: 'Origin', color: '#444444', radius: 100, dist: 0 },
        { name: 'Planet A', color: '#3366ff', radius: 500, dist: 5000 },
        { name: 'Planet B', color: '#ff6633', radius: 700, dist: 15000 },
    ], [])

    useFrame((state) => {
        // const progress = useStore.getState().traversalProgress
        const t = state.clock.elapsedTime

        // "One Planet at a Time" Logic
        // We determine which planet is "active" based on progress segments
        // For now, let's map progress 0.3->0.6 to Planet A, 0.6->1.0 to Planet B

        // Position Logic (Spline handled by Camera, we need to place planets along the path)
        // Actually, in this architecture, the planets are static in world space
        // and the camera moves to them.

        // Day/Night Cycle Rotation
        if (planetRef.current) {
            planetRef.current.rotation.y = t * 0.05
        }

        // Update Shader Uniforms
        if (planetRef.current && planetRef.current.material) {
            const mat = planetRef.current.material as any
            mat.uniforms.uTime.value = t
            mat.uniforms.uSunDirection.value.set(Math.sin(t * 0.1), 0, Math.cos(t * 0.1))
        }

        if (atmosRef.current && atmosRef.current.material) {
            const mat = atmosRef.current.material as any
            mat.uniforms.uSunDirection.value.set(Math.sin(t * 0.1), 0, Math.cos(t * 0.1))

            // Pulse atmosphere based on warp speed?
            // mat.uniforms.uIntensity.value = 1.0 + useStore.getState().scrollSpeed * 5.0
        }
    })

    return (
        <group ref={groupRef}>
            {/* We simply map them all for now, but in a real "One Planet" system
          we would conditionally render or use LOD based on distance.
          Given 3 planets, we can render all but use the shader to optimized.
      */}
            {planets.map((p, i) => (
                <group key={i} position={[0, 0, -p.dist]}>
                    {/* PLANET SURFACE */}
                    <mesh ref={i === 1 ? planetRef : null}>
                        <sphereGeometry args={[p.radius, 64, 64]} />
                        {/* Use custom shader for the "Hero" planets, standard for others for now */}
                        {i === 1 ? (
                            // @ts-ignore
                            <planetMaterial
                                transparent
                                uSunDirection={new THREE.Vector3(1, 0, 0)}
                                uDayMap={null} // Needs texture loading logic
                                uNightMap={null}
                            />
                        ) : (
                            <meshStandardMaterial color={p.color} />
                        )}
                    </mesh>

                    {/* ATMOSPHERE GLOW */}
                    {/* ATMOSPHERE GLOW & ASTRONAUT */}
                    {i === 1 && (
                        <>
                            <mesh ref={atmosRef} scale={[1.2, 1.2, 1.2]}>
                                <sphereGeometry args={[p.radius, 64, 64]} />
                                {/* @ts-ignore */}
                                <atmosphereMaterial
                                    transparent
                                    side={THREE.BackSide}
                                    blending={THREE.AdditiveBlending}
                                    uColor={new THREE.Color('#3366ff')}
                                    uSunDirection={new THREE.Vector3(1, 0, 0)}
                                    uPower={4.0}
                                    uIntensity={1.0}
                                />
                            </mesh>

                            {/* Position astronaut in orbit */}
                            <AstronautContainer anchor={[p.radius + 100, 50, 0]} />
                        </>
                    )}
                </group>
            ))}
        </group>
    )
}
