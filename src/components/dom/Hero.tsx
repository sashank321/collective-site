import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                },
                scale: 1,
                opacity: 1,
                y: 0,
                filter: 'blur(0px)'
            })

            gsap.to(titleRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                },
                scale: 3,
                opacity: 0,
                y: -200,
                filter: 'blur(20px)'
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="section" id="hero">
            <div className="absolute-center">
                <h1
                    ref={titleRef}
                    className="hero-title text-center"
                    style={{
                        fontSize: 'clamp(4rem, 20vw, 16rem)',
                        fontWeight: 700,
                        lineHeight: 0.85,
                        letterSpacing: '-0.04em',
                        mixBlendMode: 'exclusion'
                    }}
                >
                    <span className="glitch" data-text="12">12</span>
                </h1>
            </div>
            <div className="absolute-center" style={{ top: 'auto', bottom: '3rem' }}>
                <p className="text-sm tracking-widest uppercase text-secondary animate-pulse" style={{ color: 'var(--text-secondary)' }}>
                    Scroll to enter
                </p>
            </div>
        </section>
    )
}
