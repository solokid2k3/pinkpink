import React, { Suspense, useMemo } from 'react'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

import FloatingHearts from './FloatingHearts'
import ParticleField from './ParticleField'
import PetalRain from './PetalRain'
import MouseEffects from './MouseEffects'
import PhoenixBird, { PhoenixFallback, PhoenixErrorBoundary } from './PhoenixBird'

export default function Scene() {
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return /Mobi|Android|iPhone/i.test(navigator.userAgent) || window.innerWidth < 768
  }, [])

  return (
    <>
      {/* ===== Fixed 3D Scene (Stays centered, reacts to scroll & mouse) ===== */}
      {/* Lighting */}
      <ambientLight intensity={0.6} color="#ffe0ec" />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" castShadow />
      <pointLight position={[-5, 3, -3]} intensity={0.8} color="#ff6b9d" />
      <pointLight position={[3, -2, 4]} intensity={0.5} color="#ffb6d5" />
      <pointLight position={[0, 5, 0]} intensity={0.4} color="#ffd4e8" />

      {/* Wrap Environment in Suspense to prevent CDN blockage */}
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.4} />
      </Suspense>

      {/* Fog */}
      <fog attach="fog" args={['#ffe0ec', 12, 35]} />

      {/* 
        Main Phoenix Bird Model (Animated, flies dynamically around screen)
        with double fallback protection.
      */}
      <Suspense fallback={<PhoenixFallback />}>
        <PhoenixErrorBoundary fallback={<PhoenixFallback />}>
          <PhoenixBird isMobile={isMobile} />
        </PhoenixErrorBoundary>
      </Suspense>

      {/* Floating hearts background */}
      <FloatingHearts isMobile={isMobile} />

      {/* Particles background */}
      <ParticleField isMobile={isMobile} />

      {/* Petals background */}
      <PetalRain isMobile={isMobile} />

      {/* Mouse parallax + trail - disabled on mobile since no mouse exists */}
      {!isMobile && <MouseEffects />}

      {/* Optimized Post-processing (Disabled on mobile to ensure 60fps) */}
      {!isMobile && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.6}
          />
          <Vignette offset={0.35} darkness={0.3} />
        </EffectComposer>
      )}
    </>
  )
}
