import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
            const container = containerRef.current
            if (!track || !container) return

            // 1. Horizontal Scroll Logic
            const getScrollAmount = () => {
                const trackWidth = track.scrollWidth
                return -(trackWidth - window.innerWidth)
            }

            gsap.to(track, {
                x: getScrollAmount,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: () => `+=${track.scrollWidth - window.innerWidth}`,
                    pin: true,
                    scrub: 1, // Inertial catch-up
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                }
            })

            // 2. Velocity Skew Effect
            const proxy = { skew: 0 }
            const skewSetter = gsap.quickSetter('.momentum-panel', 'skewX', 'deg')
            const clamp = gsap.utils.clamp(-5, 5) // Gentle skew limit

            ScrollTrigger.create({
                trigger: container,
                start: 'top top',
                end: () => `+=${track.scrollWidth - window.innerWidth}`,
                onUpdate: (self) => {
                    const skew = clamp(self.getVelocity() / -500)
                    // Only update if moving fast enough to matter
                    if (Math.abs(skew) > Math.abs(proxy.skew)) {
                        proxy.skew = skew
                        gsap.to(proxy, {
                            skew: 0,
                            duration: 0.8,
                            ease: 'power3.out',
                            overwrite: true,
                            onUpdate: () => skewSetter(proxy.skew)
                        })
                    }
                }
            })

        }, containerRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="horizontal-section relative h-screen overflow-hidden" id="momentum">
            <div className="horizontal-wrapper h-full flex items-center">
                <div ref={trackRef} className="horizontal-track flex gap-[5vw] px-[5vw] will-change-transform">
                    {members.map((member, i) => (
                        <div key={member.name} className="momentum-panel flex-shrink-0 w-[40vw] md:w-[30vw] h-[60vh] relative perspective-1000">
                            <div className="card-inner w-full h-full border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md overflow-hidden relative group">

                                {/* Background Gradient */}
                                <div className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                                    style={{ background: `linear-gradient(to bottom right, ${member.color}, transparent)` }} />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                                    <div className="w-32 h-32 mb-8 rounded-full border border-white/20 flex items-center justify-center relative">
                                        <div className="absolute inset-2 rounded-full opacity-50" style={{ background: member.color }}></div>
                                        <span className="relative z-10 text-4xl font-bold font-mono">{i + 1}</span>
                                    </div>

                                    <h3 className="text-5xl font-bold mb-2 text-white">{member.name}</h3>
                                    <p className="text-sm uppercase tracking-widest text-gray-400 mb-8">{member.role}</p>

                                    {/* Energy Visualization */}
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full transition-all duration-1000 ease-out"
                                            style={{ width: `${member.energy * 100}%`, background: member.color }} />
                                    </div>
                                    <div className="mt-2 text-xs font-mono text-gray-500 flex justify-between w-full">
                                        <span>ENERGY</span>
                                        <span>{Math.round(member.energy * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
