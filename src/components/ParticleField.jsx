import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField() {
  const pointsRef = useRef()
  const count = 600

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    
    const colorPalette = [
      new THREE.Color('#ff4d8d'),
      new THREE.Color('#ffb6d5'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#ffd4e8'),
      new THREE.Color('#ff8ab5'),
      new THREE.Color('#ffe0ec'),
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 30
      pos[i3 + 1] = (Math.random() - 0.5) * 20
      pos[i3 + 2] = (Math.random() - 0.5) * 25 - 3
      
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      col[i3] = color.r
      col[i3 + 1] = color.g
      col[i3 + 2] = color.b
      
      siz[i] = Math.random() * 0.08 + 0.02
    }
    return [pos, col, siz]
  }, [])

  const initialPositions = useMemo(() => new Float32Array(positions), [positions])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.getElapsedTime()
    const posArray = pointsRef.current.geometry.attributes.position.array
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const seed = i * 0.1
      posArray[i3] = initialPositions[i3] + Math.sin(t * 0.2 + seed) * 0.5
      posArray[i3 + 1] = initialPositions[i3 + 1] + Math.sin(t * 0.3 + seed * 1.5) * 0.3 + Math.cos(t * 0.15 + seed) * 0.2
      posArray[i3 + 2] = initialPositions[i3 + 2] + Math.cos(t * 0.2 + seed * 0.7) * 0.4
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Gentle overall rotation
    pointsRef.current.rotation.y = t * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
