import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

const waveColors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a855f7', '#06b6d4', '#f97316']

export function Memory() {
    const containerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.wave', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                scale: 2,
                opacity: 0.2,
                stagger: 0.1
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="section" id="memory" style={{ overflow: 'hidden' }}>
            <div className="wave-container absolute inset-0">
                {waveColors.map((color, i) => (
                    <div key={i} className="wave absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                            width: '200%',
                            height: '200%',
                            background: `radial-gradient(ellipse at center, transparent 0%, ${color} 50%, transparent 70%)`,
                            opacity: 0,
                            animation: `wave-pulse 4s ease-in-out infinite ${i * 0.5}s`
                        }} />
                ))}
            </div>

            <div className="relative z-10 text-center px-8 mix-blend-exclusion">
                <h2 className="text-6xl md:text-8xl font-bold mb-8">SYNCHRONICITY</h2>
                <div className="max-w-2xl mx-auto space-y-6 text-lg text-secondary">
                    <p>Every collision creates ripples. Every conversation shifts the field.</p>
                    <p>We are not twelve separate stories. We are one evolving narrative, written in real-time.</p>
                </div>
            </div>

            {/* Morphing Blobs */}
            <div className="morph-blob absolute w-[600px] h-[600px] bg-purple-600 top-1/4 left-1/4 filter blur-[80px] opacity-50 animate-morph rounded-full mix-blend-screen" />
            <div className="morph-blob absolute w-[600px] h-[600px] bg-cyan-500 bottom-1/4 right-1/4 filter blur-[80px] opacity-50 animate-morph rounded-full mix-blend-screen" style={{ animationDelay: '-4s' }} />
        </section>
    )
}
