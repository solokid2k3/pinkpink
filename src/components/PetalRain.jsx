import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Petal({ startPosition, speed, rotSpeed, size, delay }) {
  const meshRef = useRef()
  const materialRef = useRef()
  
  const petalShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.15 * size, 0.3 * size, 0.3 * size, 0.5 * size, 0, 0.8 * size)
    shape.bezierCurveTo(-0.3 * size, 0.5 * size, -0.15 * size, 0.3 * size, 0, 0)
    return new THREE.ShapeGeometry(shape)
  }, [size])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime() + delay
    
    // Fall down, sway horizontally
    const fallSpeed = speed * 0.3
    let yPos = startPosition[1] - (t * fallSpeed) % 16
    if (yPos < -8) yPos += 16
    
    meshRef.current.position.y = yPos
    meshRef.current.position.x = startPosition[0] + Math.sin(t * 0.5 + delay) * 1.5
    meshRef.current.position.z = startPosition[2] + Math.cos(t * 0.3 + delay) * 0.5
    
    meshRef.current.rotation.x = Math.sin(t * rotSpeed) * 0.5
    meshRef.current.rotation.y = t * rotSpeed * 0.3
    meshRef.current.rotation.z = Math.cos(t * rotSpeed * 0.7) * 0.8
    
    // Subtle opacity variation
    if (materialRef.current) {
      materialRef.current.opacity = 0.5 + Math.sin(t + delay) * 0.15
    }
  })

  return (
    <mesh ref={meshRef} position={startPosition}>
      <primitive object={petalShape} attach="geometry" />
      <meshStandardMaterial
        ref={materialRef}
        color="#ff6b9d"
        emissive="#ff4d8d"
        emissiveIntensity={0.2}
        side={THREE.DoubleSide}
        transparent
        opacity={0.6}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  )
}

export default function PetalRain({ isMobile }) {
  const petals = useMemo(() => {
    const items = []
    const count = isMobile ? 15 : 35
    for (let i = 0; i < count; i++) {
      items.push({
        startPosition: [
          (Math.random() - 0.5) * 20,
          Math.random() * 10,
          (Math.random() - 0.5) * 15 - 2,
        ],
        speed: 0.8 + Math.random() * 1.2,
        rotSpeed: 0.5 + Math.random() * 1,
        size: 0.2 + Math.random() * 0.35,
        delay: Math.random() * 20,
      })
    }
    return items
  }, [isMobile])

  return (
    <group>
      {petals.map((props, i) => (
        <Petal key={i} {...props} />
      ))}
    </group>
  )
}
