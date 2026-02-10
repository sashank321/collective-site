import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { easing } from 'maath'
// import { Planet } from './Planet'
import { members } from '../../data/members'
// import { AstronautContainer } from './Astronaut'

export function SplineController() {
    // Blueprint 4.0: Catmull-Rom Spline
    const curve = useMemo(() => {
        const pathPoints = [
            new THREE.Vector3(0, 0, 50),    // Pre-start
            new THREE.Vector3(0, 0, 0),     // Start (Portal)
            new THREE.Vector3(0, 0, -500),  // Deep Void
        ]

        // Massive Scale Planets
        members.forEach((_: any, i: number) => {
            const z = -2000 - (i * 2000) // 2000 units spacing!
            const angle = i * 0.8
            // Large sweeping spiral
            const radius = 400 + (i * 50)
            const x = Math.sin(angle) * radius
            const y = Math.cos(angle * 0.5) * (radius * 0.5)

            pathPoints.push(new THREE.Vector3(x, y, z))
        })

        // Final exit
        pathPoints.push(new THREE.Vector3(0, 0, -30000))

        return new THREE.CatmullRomCurve3(pathPoints, false, 'catmullrom', 0.1) // Lower tension for smoother curves
    }, [])

    const lookAtTarget = useRef(new THREE.Vector3())

    useFrame((state, delta) => {
        const progress = useStore.getState().traversalProgress
        const camera = state.camera // as THREE.PerspectiveCamera

        // Damp the scroll progress to avoid jitter (Blueprint 4.1)
        // We can't easily damp the *progress* variable itself without local state, 
        // but let's assume Lenis handles the smooth scroll input (Blueprint 4.1 says Lenis is source).
        // BUT, for the camera movement, we want extra "weight".

        if (progress > 0.0) {
            // Get position on curve
            const point = curve.getPointAt(progress)

            // Damped Camera Position
            easing.damp3(camera.position, point, 0.5, delta) // heavy damping

            // Look Ahead Logic (Blueprint 4.2)
            // Look slightly ahead on the curve
            const lookAtPoint = curve.getPointAt(Math.min(1, progress + 0.02))

            // Or look at specific targets? 
            // For now, look ahead along the rail is safest.
            easing.damp3(lookAtTarget.current, lookAtPoint, 0.5, delta)
            camera.lookAt(lookAtTarget.current)

            // Roll correction (simple up vector)
            // camera.up.set(0, 1, 0) // Enforce up?
        }
    })

    return null
}
