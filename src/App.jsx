import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import ScrollContent from './components/ScrollContent'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Global scroll state that React Three Fiber components can read in their useFrame loops
export const scrollState = {
  progress: 0
}

function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Simulate loading progress
    let current = 0
    const interval = setInterval(() => {
      current += Math.random() * 20 + 8
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setTimeout(() => setFadeOut(true), 400)
        setTimeout(() => setHidden(true), 1400)
      }
      setProgress(current)
    }, 120)
    return () => clearInterval(interval)
  }, [])

  if (hidden) return null
  const displayProgress = Math.min(Math.round(progress), 100)

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-heart">💎💖</div>
      <div className="loading-text">Summoning Phoenix Bird...</div>
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${displayProgress}%` }} />
      </div>
      <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#ff4d8d', opacity: 0.6 }}>
        {displayProgress}%
      </div>
    </div>
  )
}

export default function App() {
  const isMobile = typeof window !== 'undefined' && (/Mobi|Android|iPhone/i.test(navigator.userAgent) || window.innerWidth < 768)

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: isMobile ? 0.8 : 1.0, // Faster/responsive scroll for mobile
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: isMobile ? 1.0 : 0.9,
    })

    lenis.on('scroll', ScrollTrigger.update)

    let rafId
    function updateLenis(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(updateLenis)
    }
    rafId = requestAnimationFrame(updateLenis)

    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      onUpdate: (self) => {
        scrollState.progress = self.progress
      }
    })

    gsap.to('#middle-content', {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: '.section-middle',
        start: 'top 80%',
        end: 'center center',
        scrub: 0.5,
      }
    })

    gsap.to('#final-content', {
      opacity: 1,
      scale: 1,
      scrollTrigger: {
        trigger: '.section-final',
        start: 'top 80%',
        end: 'center center',
        scrub: 0.5,
      }
    })

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
      trigger.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isMobile])

  return (
    <>
      <LoadingScreen />

      {/* 3D Canvas Layer */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={isMobile ? 1 : [1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Native HTML Scroll Sections Layer */}
      <ScrollContent />
    </>
  )
}
