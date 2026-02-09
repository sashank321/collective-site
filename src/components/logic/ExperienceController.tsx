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
    const setScrollSpeed = useStore(state => state.setScrollSpeed)

    useEffect(() => {
        let lastScrollY = window.scrollY
        let lastScrollTime = performance.now()
        let scrollTimeout: ReturnType<typeof setTimeout>

        // Actually, let's just use useFrame in a component inside Canvas to check scrollY if we mapped it?
        // No, scroll is DOM.

        // Let's attach a listener to the window 'scroll' event. Lenis usually emits this.
        const onScroll = () => {
            const now = performance.now()
            const scrollY = window.scrollY
            const timeDiff = now - lastScrollTime

            if (timeDiff > 0) {
                const deltaY = Math.abs(scrollY - lastScrollY)
                const speed = deltaY / timeDiff
                // Normalize roughly (0 to 5)
                setScrollSpeed(Math.min(speed * 2, 5))
            }

            lastScrollY = scrollY
            lastScrollTime = now

            // Reset speed when stopped
            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => setScrollSpeed(0), 100)

            const totalHeight = document.body.scrollHeight - window.innerHeight
            const progress = scrollY / totalHeight

            if (progress < 0.1) {
                setPhase('entry')
                useStore.setState({ attractionStrength: 0.5, repulsionStrength: 1.0 })
            } else if (progress < 0.8) {
                setPhase('collective')
                useStore.setState({ attractionStrength: 0.5, repulsionStrength: 1.0 })
            } else {
                setPhase('dissolution')
                // Drift apart: Low attraction, high repulsion
                useStore.setState({ attractionStrength: 0.05, repulsionStrength: 2.0 })
            }
        }

        window.addEventListener('scroll', onScroll)

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
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('mousemove', onMouseMove)
        }
    }, [setPhase])

    return null
}
