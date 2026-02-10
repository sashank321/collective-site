import { useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'

export function UselessOverlay() {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let frameId: number
        let time = 0

        const animate = () => {
            time += 0.01

            // Lissajous Drift (Frame 0)
            // x = A sin(at)
            // y = B sin(bt)
            if (ref.current) {
                // We add the drift to the transform
                // BUT we also need to handle the scroll-based fade/ignition
                const speed = useStore.getState().scrollSpeed
                const opacity = Math.max(0, 1 - Math.min(speed * 30, 1))

                // Drift calculation
                const x = 20 * Math.sin(0.23 * time)
                const y = 10 * Math.sin(0.37 * time)
                const rot = Math.sin(time * 0.1) * 2 // degrees

                // Ignition Effect (Frame 1)
                // When speed increases, we scale up and blur
                const scale = 1 + (speed * 20)
                const blur = speed * 40

                ref.current.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`
                ref.current.style.opacity = opacity.toString()
                ref.current.style.filter = `blur(${blur}px)`

                // Optional: Chromatic Aberration via text-shadow?
                if (speed > 0.01) {
                    ref.current.style.textShadow = `${speed * 10}px 0 red, -${speed * 10}px 0 blue`
                } else {
                    ref.current.style.textShadow = 'none'
                }
            }

            frameId = requestAnimationFrame(animate)
        }

        animate()
        return () => cancelAnimationFrame(frameId)
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
