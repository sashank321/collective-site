import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { ParticleField } from './components/canvas/ParticleField'
import { Hero } from './components/dom/Hero'
import { Collective } from './components/dom/Collective'
import { Momentum } from './components/dom/Momentum'
import { Memory } from './components/dom/Memory'
import { Contact } from './components/dom/Contact'
import { Cursor } from './components/ui/Cursor'
import { useStore } from './store/useStore'

import './styles/global.css'

function VelocityFill() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number
    const animate = () => {
      const speed = Math.abs(useStore.getState().scrollSpeed)
      if (ref.current) {
        ref.current.style.height = `${Math.min(speed * 2, 100)}%`
      }
      rafId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div ref={ref} className="velocity-fill" style={{
      width: '100%',
      background: 'linear-gradient(to top, var(--accent-2), var(--accent-4))',
      transformOrigin: 'bottom',
      transition: 'height 0.1s ease',
      height: '0%'
    }} />
  )
}

function VelocityBar() {
  return (
    <div className="velocity-bar" style={{
      position: 'fixed', right: '2rem', top: '50%', transform: 'translateY(-50%)',
      width: '2px', height: '200px', background: 'rgba(255,255,255,0.1)', zIndex: 100
    }}>
      <VelocityFill />
    </div>
  )
}

function App() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Add Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Disable GSAP lag smoothing to prevent stuttering during heavy animations
    gsap.ticker.lagSmoothing(0)

    function updateScroll(time: number) {
      // Update global scroll speed for Canvas components
      useStore.setState({ scrollSpeed: lenis.velocity })
      lenis.raf(time)
      requestAnimationFrame(updateScroll)
    }

    const rafId = requestAnimationFrame(updateScroll)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <Cursor />

      <div id="webgl-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <Canvas
          camera={{ position: [0, 0, 30], fov: 75 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
        >
          <ParticleField />
        </Canvas>
      </div>

      <div className="noise" />

      <main className="relative z-10">
        <Hero />
        <Collective />
        <Momentum />
        <Memory />
        <Contact />
      </main>

      <VelocityBar />
    </>
  )
}

export default App
