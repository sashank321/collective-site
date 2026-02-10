import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { Planet } from './Planet'
import { members } from '../../data/members'

export function CollectiveSystem() {
    const curve = useMemo(() => {
        // Spline through the void
        const pathPoints = [
            new THREE.Vector3(0, 0, 5),    // Start (Match Warp)
            new THREE.Vector3(0, 0, -50),  // Stabilization
        ]

        // Procedural Planet Path
        members.forEach((_, i) => {
            const z = -100 - (i * 100) // Spacing 100
            // Spiral helix
            const angle = i * 0.5
            const radius = 30
            const x = Math.sin(angle) * radius
            const y = Math.cos(angle * 0.7) * (radius * 0.5)

            pathPoints.push(new THREE.Vector3(x, y, z))
        })

        // Flyout
        pathPoints.push(new THREE.Vector3(0, 0, -100 - (members.length * 100) - 50))

        return new THREE.CatmullRomCurve3(pathPoints, false, 'catmullrom', 0.5)
    }, [])

    useFrame((state) => {
        const progress = useStore.getState().traversalProgress
        const camera = state.camera

        // Phase Logic:
        // 0.3 - 1.0 : Solar System Traversal
        if (progress > 0.30) {
            // Remap 0.3 -> 1.0 to 0.0 -> 1.0 for the curve
            const t = (progress - 0.3) / 0.7
            const clampedT = Math.max(0, Math.min(1, t))

            const point = curve.getPointAt(clampedT)

            camera.position.lerp(point, 0.1)

            // Look Ahead
            const lookAtPoint = curve.getPointAt(Math.min(1, clampedT + 0.02))
            const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
                new THREE.Matrix4().lookAt(camera.position, lookAtPoint, new THREE.Vector3(0, 1, 0))
            )
            camera.quaternion.slerp(targetQuaternion, 0.1)
        }
    })

    return (
        <group>
            {members.map((member, i) => {
                // Determine position based on SAME math as spline, but offset
                const z = -100 - (i * 100)
                const angle = i * 0.5
                const radius = 30
                const x = Math.sin(angle) * radius
                const y = Math.cos(angle * 0.7) * (radius * 0.5)

                // Place planet slightly "outside" the curve so we fly by it
                const planetPos: [number, number, number] = [
                    x + (Math.sin(angle) * 15),
                    y + (Math.cos(angle * 0.7) * 15),
                    z
                ]

                return (
                    <Planet
                        key={member.id}
                        position={planetPos}
                        radius={8} // Consistent size
                        color={member.color}
                    />
                )
            })}
        </group>
    )
}
