import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'

export const Loading = () => {
    const [loading, setLoading] = useState(true)
    const setPhase = useStore(state => state.setPhase)

    useEffect(() => {
        // Mock loading sequence
        const timer = setTimeout(() => {
            setLoading(false)
            setPhase('collective') // Start the experience
        }, 2500) // 2.5s ignition sequence

        return () => clearTimeout(timer)
    }, [setPhase])

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: '#000',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        style={{
                            color: '#fff',
                            fontFamily: 'var(--font-display)',
                            fontSize: '2rem',
                            letterSpacing: '0.2em',
                            marginBottom: '1rem'
                        }}
                    >
                        IGNITION SEQUENCE
                    </motion.div>

                    <div style={{
                        width: '200px',
                        height: '2px',
                        background: 'rgba(255,255,255,0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '0%' }}
                            transition={{ duration: 2.2, ease: "circOut" }}
                            style={{
                                width: '100%',
                                height: '100%',
                                background: '#fff'
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
