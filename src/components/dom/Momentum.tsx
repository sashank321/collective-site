import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

const members = [
    { name: 'Aiden', color: '#ff6b6b', role: 'Architect', energy: 0.9 },
    { name: 'Blair', color: '#4ecdc4', role: 'Sound', energy: 0.7 },
    { name: 'Cass', color: '#ffe66d', role: 'Visual', energy: 0.8 },
    { name: 'Drew', color: '#a855f7', role: 'Motion', energy: 0.85 },
    { name: 'Elle', color: '#06b6d4', role: 'Words', energy: 0.75 },
    { name: 'Finn', color: '#f97316', role: 'Code', energy: 0.95 },
    { name: 'Gia', color: '#ec4899', role: 'Space', energy: 0.8 },
    { name: 'Hale', color: '#22c55e', role: 'Research', energy: 0.7 },
    { name: 'Iris', color: '#8b5cf6', role: 'Strategy', energy: 0.85 },
    { name: 'Jules', color: '#f43f5e', role: 'Community', energy: 0.9 },
    { name: 'Kai', color: '#14b8a6', role: 'Systems', energy: 0.8 },
    { name: 'Lux', color: '#f59e0b', role: 'Future', energy: 0.95 }
]

export function Momentum() {
    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const track = trackRef.current
            if (!track) return

            const scrollWidth = track.scrollWidth
            const winWidth = window.innerWidth

            gsap.to(track, {
                x: -(scrollWidth - winWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: () => `+=${scrollWidth - winWidth}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="horizontal-section" id="momentum">
            <div className="horizontal-wrapper">
                <div ref={trackRef} className="horizontal-track">
                    {members.map((member, i) => (
                        <div key={member.name} className="momentum-panel">
                            <div className="relative text-center group">
                                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full mx-auto mb-8 relative overflow-hidden transition-all duration-500 group-hover:scale-110">
                                    <div className="absolute inset-0 opacity-60 transition-opacity group-hover:opacity-80"
                                        style={{ background: `linear-gradient(135deg, ${member.color}66, transparent)` }} />
                                    <div className="absolute inset-4 rounded-full bg-[#0a0a0f] flex items-center justify-center">
                                        <span className="text-6xl md:text-8xl font-bold" style={{ color: member.color }}>
                                            {i + 1}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-4xl md:text-6xl font-bold mb-2 glitch" data-text={member.name}>
                                    {member.name}
                                </h3>
                                <p className="text-lg tracking-widest uppercase" style={{ color: member.color }}>
                                    {member.role}
                                </p>

                                {/* Energy Bars */}
                                <div className="mt-8 flex justify-center gap-2">
                                    {Array(5).fill(0).map((_, j) => (
                                        <div key={j} className="w-1 h-8 rounded-full transition-all duration-300"
                                            style={{ background: j < member.energy * 5 ? member.color : '#333' }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
