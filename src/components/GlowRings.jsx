import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../App'

export default function GlowRings() {
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const s = scrollState.progress

    // Rings expand as user scrolls deeper
    const scaleMultiplier = 1 + s * 0.4

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.3
      ring1Ref.current.rotation.z = t * 0.15
      ring1Ref.current.scale.setScalar((1 + Math.sin(t * 0.8) * 0.05) * scaleMultiplier)
      ring1Ref.current.material.opacity = 0.5 - s * 0.2
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.25
      ring2Ref.current.rotation.x = Math.PI / 3 + t * 0.1
      ring2Ref.current.scale.setScalar((1 + Math.sin(t * 0.6 + 1) * 0.05) * scaleMultiplier)
      ring2Ref.current.material.opacity = 0.35 - s * 0.15
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.2
      ring3Ref.current.rotation.y = t * 0.15
      ring3Ref.current.scale.setScalar((1 + Math.sin(t * 0.7 + 2) * 0.05) * scaleMultiplier)
      ring3Ref.current.material.opacity = 0.25 - s * 0.1
    }
  })

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
        <meshBasicMaterial color="#ff6b9d" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffb6d5" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.1, 0.008, 16, 100]} />
        <meshBasicMaterial color="#ffd4e8" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}
