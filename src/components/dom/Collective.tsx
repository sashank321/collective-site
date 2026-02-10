import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { members } from '../../data/members'
import { useStore } from '../../store/useStore'

gsap.registerPlugin(ScrollTrigger)

export function Collective() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [activeData, setActiveData] = useState<{ index: number, opacity: number }>({ index: 0, opacity: 0 })

    const setTraversalProgress = useStore((state: any) => state.setTraversalProgress)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // HARD MODE: 5000vh. Massive travel time.
            const travelDistance = window.innerHeight * 50

            gsap.to({}, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 0,
                    start: "top top",
                    end: `+=${travelDistance}`,
                    onUpdate: (self) => {
                        const progress = self.progress
                        if (setTraversalProgress) setTraversalProgress(progress)

                        // Blueprint 4.0: Spline Sync
                        // The spline in SplineController is defined by points.
                        // Planets are added sequentially.
                        // We assume planets are distributed roughly evenly from t=0.05 to t=0.95

                        const N = members.length
                        // Avoid division by zero

                        let closestIndex = 0
                        let minDist = Infinity

                        for (let i = 0; i < N; i++) {
                            // Target progress for this planet
                            // Start slightly in (0.05)
                            const targetP = 0.05 + (i * 0.8 / (N - 1))
                            // 0.05 to 0.85 approx. 

                            const dist = Math.abs(progress - targetP)

                            if (dist < minDist) {
                                minDist = dist
                                closestIndex = i
                            }
                        }

                        // Visibility Window (Blueprint 4.0 "Damping")
                        // If we are close, opacity 1.
                        // Window size needs to be tuned.
                        const visibilityWindow = 0.05
                        const opacity = Math.max(0, 1 - (minDist / visibilityWindow))

                        setActiveData({ index: closestIndex, opacity })
                    }
                }
            })

        }, containerRef)
        return () => ctx.revert()
    }, [setTraversalProgress])

    const activeMember = members[activeData.index]
    const styles = { opacity: activeData.opacity, transition: 'opacity 0.1s linear' }

    return (
        <section ref={containerRef} className="relative h-screen w-full z-20 pointer-events-none">

            <div className="absolute inset-0 flex items-center justify-center">

                {/* Text Container - Synced to "Orbit" */}
                {/* Using a key force-remounts ONLY when index changes, but we want opacity control */}

                <div className="text-center mix-blend-difference" style={styles}>

                    {/* Name */}
                    <h2 className="text-[10vw] md:text-[8vw] font-bold leading-none tracking-tighter text-white">
                        {activeMember.name}
                    </h2>

                    {/* Anchor */}
                    <div className="w-[1px] h-24 bg-white/50 mx-auto my-6" />

                    {/* Details */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm uppercase tracking-[0.4em] text-white/80">
                            {activeMember.trait}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                            Obsession: {activeMember.obsession}
                        </span>
                    </div>

                </div>
            </div>

            {/* Travel Diagnostics (Optional, remove for prod) */}
            <div className="absolute bottom-12 right-12 text-[10px] uppercase tracking-[0.2em] text-white/20">
                DIST: {(activeData.index * 800).toFixed(0)} AU
            </div>
        </section>
    )
}
