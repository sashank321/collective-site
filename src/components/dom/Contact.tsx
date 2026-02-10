import { useRef, useEffect } from 'react'
import { useInView } from 'framer-motion'
import { useStore } from '../../store/useStore'

export function Contact() {
    const ref = useRef(null)
    const isInView = useInView(ref, { amount: 0.5 })
    const setTraversalState = useStore(state => state.setTraversalState)

    useEffect(() => {
        if (isInView) {
            setTraversalState('drift')
        }
    }, [isInView, setTraversalState])

    return (
        <section ref={ref} className="section" id="contact" style={{ background: 'transparent' }}>
            <div className="text-center px-8">
                <div className="relative inline-block mb-12">
                    {/* Subtle white glow instead of color - strictly monochrome */}
                    <div className="absolute -inset-16 bg-white rounded-full blur-3xl opacity-5 animate-pulse"></div>
                    <h2 className="relative text-5xl md:text-7xl font-bold tracking-tighter mix-blend-difference" style={{ fontFamily: 'var(--font-display)' }}>
                        JOIN THE FIELD
                    </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-xs tracking-[0.3em] uppercase text-white/60">
                    {['Instagram', 'Are.na', 'Newsletter'].map((link) => (
                        <a key={link} href="#" className="group relative px-8 py-4 border border-white/10 hover:border-white/40 transition-colors overflow-hidden">
                            <span className="relative z-10">{link}</span>
                            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 mix-blend-difference"></div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Footer info */}
            <div className="absolute bottom-8 left-0 w-full text-center text-[10px] uppercase tracking-[0.2em] text-white/20">
                Collective © 2026
            </div>
        </section>
    )
}
