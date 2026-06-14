import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export default function MouseEffects() {
  const { camera } = useThree()
  const scroll = useScroll()
  const trailRef = useRef()
  const trailIndex = useRef(0)
  const prevPointer = useRef({ x: 0, y: 0 })
  const cameraTarget = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    const { pointer } = state
    const scrollOffset = scroll.offset

    // Camera parallax based on mouse + scroll
    cameraTarget.current.x = pointer.x * 1.2
    cameraTarget.current.y = pointer.y * 0.6

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraTarget.current.x, 0.03)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraTarget.current.y, 0.03)
    camera.lookAt(0, 0, 0)

    // Mouse trail sparkles
    if (trailRef.current) {
      const positions = trailRef.current.geometry.attributes.position.array

      const dx = pointer.x - prevPointer.current.x
      const dy = pointer.y - prevPointer.current.y
      const moved = Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001

      if (moved) {
        const idx = (trailIndex.current % 25) * 3
        positions[idx] = pointer.x * 5
        positions[idx + 1] = pointer.y * 3
        positions[idx + 2] = 2
        trailIndex.current++
      }

      for (let i = 0; i < 25; i++) {
        const i3 = i * 3
        positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], -5, 0.015)
        positions[i3] += (Math.random() - 0.5) * 0.015
        positions[i3 + 1] += (Math.random() - 0.5) * 0.015
      }

      trailRef.current.geometry.attributes.position.needsUpdate = true
      prevPointer.current = { x: pointer.x, y: pointer.y }
    }
  })

  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={25}
          array={new Float32Array(25 * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#ff4d8d"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
