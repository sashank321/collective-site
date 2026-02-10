import { useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'

export function UselessOverlay() {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const unsub = useStore.subscribe(
            (state) => {
                const speed = state.scrollSpeed
                if (!ref.current) return

                // Parallax/Fade logic based on scroll
                // Ideally we'd map this to the Lenis scroll position, 
                // but for now we can infer "start" state or simply let it cover the screen initially

                // Simple fade out on scroll
                // We need actual scroll position, not just speed. 
                // But since we are using Lenis in App.tsx, we can try to hook into that 
                // or just let the CSS handle the initial state.

                // For this prototype, let's keep it static "USELESS" that fades when you start moving
                const opacity = Math.max(0, 1 - Math.min(speed * 20, 1)) // Fade out on movement
                ref.current.style.opacity = opacity.toString()
                ref.current.style.filter = `blur(${speed * 20}px)`
            }
        )
        return () => unsub()
    }, [])

    return (
        <div ref={ref} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50, // Below UI but above Canvas if needed, actually should be on top for Intro
            pointerEvents: 'none',
            mixBlendMode: 'difference',
            color: 'white'
        }}>
            <h1 style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(4rem, 20vw, 15rem)',
                letterSpacing: '-0.05em',
                margin: 0,
                lineHeight: 0.8
            }}>
                USELESS
            </h1>
        </div>
    )
}
