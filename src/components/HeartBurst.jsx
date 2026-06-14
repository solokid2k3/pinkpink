import React, { useRef, useState, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createHeartGeometry } from '../utils/heartShape'

function BurstHeart({ position, velocity, startTime }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const geometry = useMemo(() => createHeartGeometry(0.12, 0.06), [])
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return
    const elapsed = state.clock.getElapsedTime() - startTime
    
    if (elapsed > 2.5) {
      meshRef.current.visible = false
      return
    }
    
    meshRef.current.visible = true
    
    // Physics: velocity + gravity
    meshRef.current.position.x = position[0] + velocity[0] * elapsed
    meshRef.current.position.y = position[1] + velocity[1] * elapsed - 0.5 * elapsed * elapsed
    meshRef.current.position.z = position[2] + velocity[2] * elapsed
    
    // Spin
    meshRef.current.rotation.x = elapsed * 3
    meshRef.current.rotation.z = elapsed * 2
    
    // Fade out and shrink
    const life = 1 - elapsed / 2.5
    materialRef.current.opacity = life * 0.8
    const s = life * (0.5 + Math.sin(elapsed * 8) * 0.1)
    meshRef.current.scale.setScalar(Math.max(s, 0))
  })

  return (
    <mesh ref={meshRef} position={position}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        ref={materialRef}
        color="#ff4d8d"
        emissive="#ff2d6a"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  )
}

export default function HeartBurst() {
  const [bursts, setBursts] = useState([])
  const { camera, raycaster, pointer } = useThree()
  const burstIdRef = useRef(0)
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))
  const intersectPoint = useRef(new THREE.Vector3())

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    
    // Get 3D position from click
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(planeRef.current, intersectPoint.current)
    
    const pos = [intersectPoint.current.x, intersectPoint.current.y, intersectPoint.current.z]
    const now = performance.now() / 1000
    
    const newHearts = []
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.3
      const speed = 1.5 + Math.random() * 2
      newHearts.push({
        id: burstIdRef.current++,
        position: [...pos],
        velocity: [
          Math.cos(angle) * speed,
          Math.sin(angle) * speed + 1,
          (Math.random() - 0.5) * 1.5,
        ],
        startTime: now,
      })
    }
    
    setBursts(prev => [...prev.slice(-50), ...newHearts])
    
    // Cleanup old bursts
    setTimeout(() => {
      setBursts(prev => prev.filter(b => performance.now() / 1000 - b.startTime < 3))
    }, 3000)
  }, [camera, raycaster, pointer])

  return (
    <group>
      {/* Invisible click plane */}
      <mesh onClick={handleClick} visible={false}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {bursts.map((burst) => (
        <BurstHeart
          key={burst.id}
          position={burst.position}
          velocity={burst.velocity}
          startTime={burst.startTime}
        />
      ))}
    </group>
  )
}
