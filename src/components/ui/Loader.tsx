import { useProgress } from '@react-three/drei'

export function Loader() {
    const { active, progress } = useProgress()

    if (!active) return null

    return (
        <div className="loader-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#000',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none'
        }}>
            <div style={{
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                opacity: 0.7,
                marginBottom: '1rem'
            }}>
                Initializing Collective
            </div>
            <div style={{
                width: '200px',
                height: '2px',
                background: '#333',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${progress}%`,
                    background: '#fff',
                    transition: 'width 0.2s ease-out'
                }} />
            </div>
        </div>
    )
}
