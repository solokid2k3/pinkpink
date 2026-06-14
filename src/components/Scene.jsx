import React from 'react'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

import FloatingHearts from './FloatingHearts'
import ParticleField from './ParticleField'
import PetalRain from './PetalRain'
import MouseEffects from './MouseEffects'

export default function Scene() {
  return (
    <>
      {/* ===== Fixed 3D Scene (Background elements only, reacts to scroll & mouse) ===== */}
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

      {/* Floating hearts background */}
      <FloatingHearts />

      {/* Particles background */}
      <ParticleField />

      {/* Petals background */}
      <PetalRain />

      {/* Mouse parallax + trail */}
      <MouseEffects />

      {/* Optimized Post-processing */}
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
    </>
  )
}
