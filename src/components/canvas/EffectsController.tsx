import { useFrame } from '@react-three/fiber'
import { useStore } from '../../store/useStore'
import * as THREE from 'three'

// We accept refs to the effects
export function EffectsController({ chromaticRef }: { chromaticRef: any }) {
    useFrame(() => {
        const scrollSpeed = useStore.getState().scrollSpeed

        if (chromaticRef.current) {
            // Velocity-driven aberration
            // Max offset around 0.05
            // Threshold: only apply if speed > 0.01
            const targetOffset = scrollSpeed * 0.2

            // Lerp for smoothness
            const currentX = chromaticRef.current.offset.x
            const nextX = THREE.MathUtils.lerp(currentX, targetOffset, 0.1)

            chromaticRef.current.offset.set(nextX, nextX)
        }
    })
    return null
}
