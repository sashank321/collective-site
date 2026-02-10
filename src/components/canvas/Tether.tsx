import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TetherProps {
    start: THREE.Object3D | React.MutableRefObject<THREE.Object3D>
    end: [number, number, number] // Fixed anchor point on "Shuttle"
    length?: number
    segments?: number
}

export function Tether({ start, end, segments = 20 }: TetherProps) {
    const lineRef = useRef<THREE.Line>(null!)

    // Physics State
    const points = useMemo(() => {
        return new Array(segments).fill(0).map(() => new THREE.Vector3())
    }, [segments])

    // Previous positions for Verlet
    const oldPoints = useMemo(() => {
        return new Array(segments).fill(0).map(() => new THREE.Vector3())
    }, [segments])

    // Initialize
    useMemo(() => {
        const startPos = new THREE.Vector3(0, 0, 0) // Will update frame 1
        const endPos = new THREE.Vector3(...end)
        for (let i = 0; i < segments; i++) {
            points[i].lerpVectors(startPos, endPos, i / (segments - 1))
            oldPoints[i].copy(points[i])
        }
    }, [])

    useFrame((_, delta) => {
        if (!lineRef.current) return

        // 1. Get current start position from the object (Astronaut)
        const startObj = (start as any).current || start
        if (!startObj) return

        const startPos = new THREE.Vector3()
        startObj.getWorldPosition(startPos)

        // 2. Physics Update (Verlet)
        // x_i(t+dt) = 2x_i(t) - x_i(t-dt) + a*dt^2
        const gravity = new THREE.Vector3(0, -0.5, 0) // Artificial "Sag" gravity, not real planetary gravity
        const dt = Math.min(delta, 0.1) // Cap dt

        for (let i = 1; i < segments - 1; i++) { // Skip start/end (anchors)
            const p = points[i]
            const old = oldPoints[i]

            const velocity = p.clone().sub(old)
            old.copy(p)

            // Apply verlet
            p.add(velocity).add(gravity.clone().multiplyScalar(dt * dt))

            // Damping (friction)
            // p.add(velocity.multiplyScalar(0.99))
        }

        // 3. Constraints (Relaxation)
        // Ensure segments don't stretch too much
        const constraintIterations = 3
        const segmentLen = 2.0 // Nominal length

        for (let k = 0; k < constraintIterations; k++) {
            // Anchor constraints
            points[0].copy(startPos)
            points[segments - 1].set(...end)

            for (let i = 0; i < segments - 1; i++) {
                const p1 = points[i]
                const p2 = points[i + 1]

                const dist = p1.distanceTo(p2)
                const diff = dist - segmentLen

                if (dist > 0.001) { // Avoid divide by zero
                    const correction = p2.clone().sub(p1).multiplyScalar(diff / dist * 0.5)

                    if (i !== 0) p1.add(correction)
                    if (i + 1 !== segments - 1) p2.sub(correction)
                }
            }
        }

        // 4. Update Geometry
        lineRef.current.geometry.setFromPoints(points)
    })

    return (
        // @ts-ignore
        <line ref={lineRef}>
            <bufferGeometry />
            <lineBasicMaterial color="#555" linewidth={1} />
        </line>
    )
}
