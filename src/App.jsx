import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import Scene from './components/Scene'

function LoadingScreen({ progress }) {
  const [fadeOut, setFadeOut] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setFadeOut(true), 500)
      const hideTimer = setTimeout(() => setHidden(true), 1500)
      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    }
  }, [progress])

  if (hidden) return null

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-heart">💎💖</div>
      <div className="loading-text">Loading Love...</div>
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += Math.random() * 15 + 5
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setTimeout(() => setLoading(false), 2000)
      }
      setProgress(current)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <LoadingScreen progress={progress} />

      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: 3,
            toneMappingExposure: 1.2,
          }}
          style={{
            background: 'linear-gradient(135deg, #ffe0ec 0%, #fff5f9 40%, #ffffff 100%)',
          }}
        >
          <Suspense fallback={null}>
            <ScrollControls pages={3} damping={0.25} distance={1.2}>
              <Scene />
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}
