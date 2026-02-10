import { useRef } from 'react'
import { useStore } from '../../store/useStore'

export function Hero() {
    const titleRef = useRef<HTMLHeadingElement>(null!)

    // Subscribe to Monolith position from store (updated in useFrame)
    // format: [x, y] in Normalized Device Coordinates (-1 to 1)
    // We need to convert this to pixels relative to center
    // Wait, the projection gives us [-1, 1].
    // CSS translate3d uses pixels.
    // x = (ndc.x * 0.5 + 0.5) * window.innerWidth
    // y = (-(ndc.y * 0.5) + 0.5) * window.innerHeight

    // We use a selector to avoid re-renders on every frame? 
    // No, React state updates will cause re-renders. 
    // We need direct DOM manipulation for 60fps sync.
    // But useStore.subscribe is better.

    useStore.subscribe((state: any) => {
        if (!titleRef.current || !state.monolithPosition) return

        const [nx, ny] = state.monolithPosition

        // Convert NDC to Pixel Coordinates
        // center is (0,0) in CSS transform if we center the element
        // But let's map it to window coordinates
        // actually easier if the element is absolute centered and we just add offset

        // NDC x range: -1 (left) to 1 (right)
        // NDC y range: -1 (bottom) to 1 (top)

        // Pixel offset from center:
        const x = nx * (window.innerWidth * 0.5)
        const y = -ny * (window.innerHeight * 0.5) // Invert Y for CSS

        titleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    })

    return (
        <section className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mix-blend-difference">
            <h1
                ref={titleRef}
                className="text-[12vw] font-bold tracking-tighter text-white leading-none will-change-transform"
                style={{ opacity: 0.9 }} // Initial distinct look
            >
                USELESS
            </h1>
        </section>
    )
}
