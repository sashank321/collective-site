import { useRef, useLayoutEffect, useState } from 'react'
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

export function Collective() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [activeText, setActiveText] = useState('Twelve individuals. One frequency. Connected by shared moments, divergent paths, and the invisible threads that bind creative souls.')

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const nodes = gsap.utils.toArray('.member-node') as HTMLElement[]

            nodes.forEach((node, i) => {
                // Calculate initial positions based on index
                const angle = (i / members.length) * Math.PI * 2
                const radius = 250 + Math.random() * 100 // Deterministic random if seeded, but random here fine for now
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                gsap.set(node, {
                    x: x,
                    y: y
                })

                gsap.to(node, {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 2
                    },
                    rotation: 360,
                    transformOrigin: `${-x}px ${-y}px`, // Rotate around center
                    ease: 'none'
                })
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="section" id="collective" style={{ overflow: 'hidden' }}>
            <div className="orbital-container relative w-full h-screen flex items-center justify-center">
                {/* Orbits */}
                {[200, 400, 600].map(size => (
                    <div key={size} className="orbit-ring absolute border border-white/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ width: size, height: size, borderColor: 'rgba(255,255,255,0.1)' }} />
                ))}

                {/* Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
                    <div className="w-32 h-32 rounded-full opacity-80 blur-sm animate-pulse"
                        style={{ background: 'linear-gradient(to bottom right, #06b6d4, #a855f7)' }}></div>
                    <p className="mt-4 text-xs tracking-widest uppercase">The Core</p>
                </div>

                {/* Nodes */}
                {members.map((member) => (
                    <div
                        key={member.name}
                        className="member-node absolute left-1/2 top-1/2 flex flex-col items-center gap-2 cursor-pointer transition-all duration-500"
                        style={{ '--member-color': member.color } as React.CSSProperties}
                        onMouseEnter={() => setActiveText(`${member.name} — ${member.role}. Energy level: ${Math.round(member.energy * 100)}%.`)}
                        onMouseLeave={() => setActiveText('Twelve individuals. One frequency. Connected by shared moments, divergent paths, and the invisible threads that bind creative souls.')}
                    >
                        <div className="member-aura w-20 h-20 rounded-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-transparent"
                                style={{
                                    background: `conic-gradient(from 0deg, ${member.color}, transparent, ${member.color})`,
                                    animation: 'aura-rotate 4s linear infinite'
                                }} />
                            <div className="member-core absolute inset-2 rounded-full opacity-80 z-10"
                                style={{ background: member.color }} />
                        </div>
                        <span className="member-label text-xs uppercase tracking-widest opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                            {member.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="absolute top-12 left-12 max-w-md z-20 pointer-events-none mix-blend-difference">
                <p className="scramble-text text-lg font-light leading-relaxed text-secondary transition-all">
                    {activeText}
                </p>
            </div>
        </section>
    )
}
