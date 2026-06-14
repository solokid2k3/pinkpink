import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createHeartGeometry } from '../utils/heartShape'
import { scrollState } from '../App'

function Heart({ position, scale, speed, rotationSpeed, color, delay }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime() + delay

    meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.5
    meshRef.current.position.x = position[0] + Math.sin(t * speed * 0.7) * 0.2
    meshRef.current.rotation.x = Math.sin(t * rotationSpeed) * 0.3
    meshRef.current.rotation.y = t * rotationSpeed
    meshRef.current.rotation.z = Math.cos(t * rotationSpeed * 0.5) * 0.2
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <primitive object={createHeartGeometry(0.3, 0.15)} attach="geometry" />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.7}
        transparent
        opacity={0.75}
      />
    </mesh>
  )
}

export default function FloatingHearts() {
  const groupRef = useRef()

  const hearts = useMemo(() => {
    const colors = ['#ff4d8d', '#ff6ba3', '#ffb6d5', '#ff8ab5', '#ffa0c5', '#ff3377']
    const items = []

    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2
      const radius = 4 + Math.random() * 8
      items.push({
        position: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 8,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 3 - 3,
        ],
        scale: 0.3 + Math.random() * 0.6,
        speed: 0.3 + Math.random() * 0.5,
        rotationSpeed: 0.2 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 10,
      })
    }
    return items
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    const s = scrollState.progress
    groupRef.current.rotation.y = s * Math.PI * 2
  })

  return (
    <group ref={groupRef}>
      {hearts.map((props, i) => (
        <Heart key={i} {...props} />
      ))}
    </group>
  )
}
