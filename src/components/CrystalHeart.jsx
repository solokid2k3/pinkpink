import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useScroll } from '@react-three/drei'
import * as THREE from 'three'

export default function CrystalHeart() {
  const groupRef = useRef()
  const glowRef = useRef()
  const { scene } = useGLTF('/crystal_heart.glb')
  const scroll = useScroll()
  const { pointer } = useThree()

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.material.transparent = true
        child.material.opacity = 0.85
        child.material.roughness = 0.1
        child.material.metalness = 0.6
        child.material.envMapIntensity = 2.0
        child.material.color = new THREE.Color('#ff6b9d')
        child.material.emissive = new THREE.Color('#ff2d6a')
        child.material.emissiveIntensity = 0.3
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    const s = scroll.offset

    // Always centered (x=0, z=0), gentle float on Y
    const targetY = Math.sin(t * 0.8) * 0.15
    const targetRotY = t * 0.3 + s * Math.PI * 2
    const targetScale = 1.8 + Math.sin(s * Math.PI) * 0.3

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05)
    groupRef.current.position.z = 0
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05)

    // Mouse tilt
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.12, 0.04)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -pointer.x * 0.08, 0.04)

    // Heartbeat + scale
    const heartbeat = 1 + Math.sin(t * 2.5) * 0.02
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale * heartbeat, 0.05))

    if (glowRef.current) {
      glowRef.current.material.opacity = 0.12 + Math.sin(t * 2) * 0.06
      glowRef.current.scale.setScalar(1.3 + Math.sin(t * 1.5) * 0.1)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={clonedScene} />
      <mesh ref={glowRef} position={[0, 0, -0.3]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#ff4d8d" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <pointLight color="#ff6b9d" intensity={2} distance={8} decay={2} />
      <pointLight color="#ffb6d5" intensity={1} distance={5} decay={2} position={[0, 0.5, 0.5]} />
    </group>
  )
}

useGLTF.preload('/crystal_heart.glb')
