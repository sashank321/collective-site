import { useEffect } from 'react'
// import { useLenis } from 'lenis/react' // Verify lenis react export, mostly it's just 'lenis/react' or manual hook
import { useStore } from '../../store/useStore'

export const ExperienceController = () => {
    // We used 'lenis' package so we might not have 'lenis/react' hook built-in depending on version.
    // If not, we can use the window instance or pass it down. 
    // However, usually one uses a hook context. 
    // Since I implemented Lenis manually in App.tsx without a context provider, I need to pass it or attach a listener differently.
    // Let's refactor App.tsx to use a context or just listen to scroll events on window for now since Lenis hijacking scroll.

    const setPhase = useStore(state => state.setPhase)
    // const setScrollSpeed = useStore(state => state.setScrollSpeed) // Removed unused

    useEffect(() => {

        // Actually, let's just use useFrame in a component inside Canvas to check scrollY if we mapped it?
        // No, scroll is DOM.

        // Mouse velocity tracker
        // let lastMouseScale = 0 // Unused
        let lastTime = 0
        const onMouseMove = (e: MouseEvent) => {
            const now = performance.now()
            const dist = Math.sqrt(e.movementX ** 2 + e.movementY ** 2)
            const timeDiff = now - lastTime
            const speed = timeDiff > 0 ? dist / timeDiff : 0

            // Dampen / Normalize
            // Provide a smoothed speed to store (0 to 1 range approx)
            useStore.getState().setCursorSpeed(Math.min(speed, 5))
            lastTime = now
        }
        window.addEventListener('mousemove', onMouseMove)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
        }
    }, [setPhase])

    return null
}
