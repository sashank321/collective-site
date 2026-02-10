import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export function WarpController() {

    useFrame((state) => {
        const progress = useStore.getState().traversalProgress
        const camera = state.camera as THREE.PerspectiveCamera

        // Phase Logic (Thesis Section 3.1)
        // 0.0 - 0.1 : Void (Idle)
        // 0.1 - 0.3 : Warp (Transition)
        // 0.3+      : Solar System (Handled by CollectiveSystem later)

        if (progress < 0.1) {
            // IDLE VOID
            // Camera at stable Z=50
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, 50, 0.1)
            camera.fov = THREE.MathUtils.lerp(camera.fov, 45, 0.1)
        } else if (progress >= 0.1 && progress < 0.3) {
            // WARP DYNAMICS (Inverted Dolly Zoom)
            // Normalized Warp Progress (0 to 1)
            const warpP = (progress - 0.1) / 0.2

            // Move Camera IN (50 -> 5)
            const targetZ = THREE.MathUtils.lerp(50, 5, warpP)
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1)

            // Widen FOV (45 -> 110)
            const targetFOV = THREE.MathUtils.lerp(45, 110, warpP)
            camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, 0.1)
        } else {
            // ARRIVAL (Reset for Solar System traversal)
            // We might want to keep the FOV wide or reset it?
            // Thesis says "Destination: Solar System". 
            // Usually we stabilize FOV.
            camera.fov = THREE.MathUtils.lerp(camera.fov, 60, 0.05)
        }

        camera.updateProjectionMatrix()
    })

    return null
}
