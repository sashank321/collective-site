import { useState, useEffect } from 'react'
import { members } from '../../data/members'
import { useStore } from '../../store/useStore'
import { motion, AnimatePresence } from 'framer-motion'

// Text scrambler hook or component
const KineticText = ({ text }: { text: string }) => {
    const [display, setDisplay] = useState(text)

    useEffect(() => {
        let iterations = 0
        const interval = setInterval(() => {
            setDisplay(text.split('').map((_, index) => {
                if (index < iterations) return text[index]
                return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
            }).join(''))

            if (iterations >= text.length) clearInterval(interval)
            iterations += 1 / 2
        }, 30)
        return () => clearInterval(interval)
    }, [text])

    return <>{display}</>
}

export const Overlay = () => {
    const hoveredNode = useStore(state => state.hoveredNode)
    const activeMember = members.find(m => m.id === hoveredNode)

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
            <AnimatePresence>
                {activeMember && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            position: 'absolute',
                            bottom: '15%',
                            left: '10%',
                            color: activeMember.color,
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase'
                        }}
                    >
                        <h2 style={{ fontSize: '6vw', margin: 0, lineHeight: 0.9, letterSpacing: '-0.02em' }}>
                            <KineticText text={activeMember.name} />
                        </h2>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontFamily: 'var(--font-main)', fontSize: '0.9rem', opacity: 0.8, letterSpacing: '0.05em' }}>
                            <span>Trait /// {activeMember.trait}</span>
                            <span>Obsession /// {activeMember.obsession}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
