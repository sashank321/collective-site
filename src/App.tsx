import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// import { EffectComposer, ChromaticAberration, Bloom, Noise } from '@react-three/postprocessing'
// import { BlendFunction } from 'postprocessing'
// import { DeepSpace } from './components/canvas/DeepSpace'
// import { PortalText } from './components/canvas/PortalText'
import { SceneLighting } from './components/canvas/SceneLighting'
import { WarpStars } from './components/canvas/WarpStars'
import { WarpController } from './components/canvas/WarpController'
// import { EffectsController } from './components/canvas/EffectsController'
import { SplineController } from './components/canvas/SplineController'
import { Hero } from './components/dom/Hero'
import { Collective } from './components/dom/Collective'
import { Momentum } from './components/dom/Momentum'
import { Memory } from './components/dom/Memory'
import { Contact } from './components/dom/Contact'
// import { Loading } from './components/dom/Loading'
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
  // const chromaticRef = useRef<any>(null)

  useEffect(() => {
    // ==========================================
    // LENIS + GSAP SCROLL ENGINE (DROP-IN PATCH)
    // ==========================================

    // Disable native scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Create Lenis instance
    const lenis = new Lenis({
      duration: 1.2,              // inertia weight (Aramco-like)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential ease
      smoothWheel: true,          // CRITICAL: enables smooth wheel scrolling
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      infinite: false
    });

    // RAF loop (single source of truth)
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Tell ScrollTrigger to use Lenis instead of window
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed"
    });

    // Refresh ScrollTrigger AFTER everything loads
    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    // ==========================================
    // SCROLL VELOCITY LOGIC (Aramco-style)
    // ==========================================

    let lastScrollY = 0;

    lenis.on('scroll', ({ scroll }) => {
      const scrollVelocity = Math.abs(scroll - lastScrollY);
      lastScrollY = scroll;

      // Update global store
      useStore.setState({ scrollSpeed: scrollVelocity });
    });

    // Replace native smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) lenis.scrollTo(target as HTMLElement);
        }
      });
    });

    return () => {
      lenis.destroy()
      // GSAP ticker handling is now inside the main RAF loop implicitly via lenis.raf/ScrollTrigger
    }
  }, [])

  return (
    <>
      {/* <Loading /> */}
      <Cursor />

      <div id="webgl-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <Canvas
          camera={{ position: [0, 0, 30], fov: 75 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: true, // Blueprint 1.1: Solves Z-fighting for massive scale
            toneMapping: THREE.ACESFilmicToneMapping, // Blueprint 1.1: Cinematic contrast
            outputColorSpace: THREE.SRGBColorSpace
          }}
        >
          <color attach="background" args={['#111']} />
          {/* Changed bg to dark gray to see if canvas is mounting */}
          <fog attach="fog" args={['#000000', 10, 30]} />

          <SceneLighting />
          {/* <PortalText /> */}
          {/* <DeepSpace /> */}
          <WarpStars count={20000} />
          <WarpController />

          {/* <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
            <ChromaticAberration
              ref={chromaticRef}
              blendFunction={BlendFunction.NORMAL}
              offset={[0.002, 0.002]}
            />
            <Noise opacity={0.05} />
          </EffectComposer>

          <EffectsController chromaticRef={chromaticRef} /> */}

          <SplineController />
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
