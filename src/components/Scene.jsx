import React, { Suspense } from 'react'
import { Scroll, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

import CrystalHeart from './CrystalHeart'
import FloatingHearts from './FloatingHearts'
import ParticleField from './ParticleField'
import PetalRain from './PetalRain'
import GlowRings from './GlowRings'
import MouseEffects from './MouseEffects'
import HeartBurst from './HeartBurst'
import ScrollContent from './ScrollContent'

export default function Scene() {
  return (
    <>
      {/* ===== 3D Layer (scrolls with the 3D scroll offset) ===== */}
      <Scroll>
        {/* Lighting */}
        <ambientLight intensity={0.6} color="#ffe0ec" />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" castShadow />
        <pointLight position={[-5, 3, -3]} intensity={0.8} color="#ff6b9d" />
        <pointLight position={[3, -2, 4]} intensity={0.5} color="#ffb6d5" />
        <pointLight position={[0, 5, 0]} intensity={0.4} color="#ffd4e8" />

        {/* Environment for reflections */}
        <Environment preset="studio" environmentIntensity={0.4} />

        {/* Fog */}
        <fog attach="fog" args={['#ffe0ec', 12, 35]} />

        {/* Main Crystal Heart Model */}
        <Suspense fallback={null}>
          <CrystalHeart />
        </Suspense>

        {/* Glow rings */}
        <GlowRings />

        {/* Floating hearts */}
        <FloatingHearts />

        {/* Particles */}
        <ParticleField />

        {/* Petals */}
        <PetalRain />

        {/* Heart burst on click */}
        <HeartBurst />

        {/* Mouse parallax + trail */}
        <MouseEffects />
      </Scroll>

      {/* ===== HTML Scroll Content ===== */}
      <ScrollContent />

      {/* ===== Post-processing (applied globally) ===== */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.7}
        />
        <Vignette offset={0.3} darkness={0.35} />
      </EffectComposer>
    </>
  )
}
