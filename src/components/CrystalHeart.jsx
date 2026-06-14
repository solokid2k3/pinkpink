import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../App'
import { createHeartGeometry } from '../utils/heartShape'

// ===== 1. PROCEDURAL HEART FALLBACK =====
export function ProceduralHeartFallback() {
  const meshRef = useRef()
  const geometry = useMemo(() => createHeartGeometry(1.8, 0.4), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    const delta = Math.min(state.delta, 0.1)
    const s = scrollState.progress

    // Floating animation
    const targetY = Math.sin(t * 0.8) * 0.15
    const targetRotY = t * 0.3 + s * Math.PI * 2
    const targetScale = 1.0 + Math.sin(s * Math.PI) * 0.15

    const lerpFactor = 1 - Math.exp(-3 * delta)

    meshRef.current.position.x = 0
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, lerpFactor)
    meshRef.current.position.z = 0

    // Dynamic rotation on scroll
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, lerpFactor)

    // Heartbeat + scroll scaling
    const heartbeat = 1 + Math.sin(t * 2.5) * 0.03
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale * heartbeat, lerpFactor))
  })

  return (
    <mesh ref={meshRef}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color="#ff4d8d"
        emissive="#ff2d6a"
        emissiveIntensity={0.5}
        roughness={0.15}
        metalness={0.8}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

// ===== 2. ERROR BOUNDARY =====
export class SceneErrorBoundary extends React.Component {
  state = { hasError: false }
  
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error("GLTF failed to load, falling back to procedural heart:", error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// ===== 3. MAIN GLTF HEART MODEL =====
export default function CrystalHeart() {
  const groupRef = useRef()
  const glowRef = useRef()
  const { scene } = useGLTF('/heart_in_love.glb')
  const { pointer } = useThree()

  // Calculate size and center based ONLY on geometry meshes to filter out infinite cameras/lights
  // Also configure materials to be standard/glossy to prevent invisibility caused by missing environment maps.
  const geometryInfo = useMemo(() => {
    let hasMesh = false
    const box = new THREE.Box3()
    
    scene.traverse((child) => {
      if (child.isMesh) {
        // Calculate bounding box
        if (!hasMesh) {
          box.setFromObject(child)
          hasMesh = true
        } else {
          box.expandByObject(child)
        }

        // ===== MATERIAL COMPATIBILITY FIX =====
        // Since heart_in_love.glb uses transmission glass materials (which require HDR maps to refract),
        // we convert them to beautiful, semi-transparent glossy standard materials.
        // This ensures the heart is 100% visible on any network/GPU even if Environment HDR fails to load.
        const originalColor = child.material.color ? child.material.color.clone() : new THREE.Color('#ff4d8d')
        const originalMap = child.material.map
        
        child.material = new THREE.MeshStandardMaterial({
          color: originalColor.addScalar(0.1), // slightly brighten
          map: originalMap,
          roughness: 0.15,
          metalness: 0.75,
          emissive: new THREE.Color('#ff0055'),
          emissiveIntensity: 0.35,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide
        })

        child.castShadow = true
        child.receiveShadow = true
      }
    })
    
    // Fallback if no meshes are found
    if (!hasMesh) {
      box.setFromObject(scene)
    }

    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)

    // Normalize to standard viewport size
    const maxDim = Math.max(size.x, size.y, size.z)
    const scaleFactor = maxDim > 0 ? 2.5 / maxDim : 1

    console.log('Model Geometry and Materials Configured (Meshes only):', { size, center, scaleFactor })
    return { scaleFactor, center }
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    const delta = Math.min(state.delta, 0.1)
    const s = scrollState.progress

    // Position: Always centered, gentle float on Y
    const targetY = Math.sin(t * 0.8) * 0.15
    const targetRotY = t * 0.3 + s * Math.PI * 2
    const targetScale = 1.0 + Math.sin(s * Math.PI) * 0.15

    const lerpFactor = 1 - Math.exp(-3.5 * delta)
    const mouseLerpFactor = 1 - Math.exp(-2.5 * delta)

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05)
    groupRef.current.position.z = 0
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05)

    // Mouse tilt response
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.12, mouseLerpFactor)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -pointer.x * 0.08, mouseLerpFactor)

    // Heartbeat scale oscillation
    const heartbeat = 1 + Math.sin(t * 2.5) * 0.03
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale * heartbeat, lerpFactor))

    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity,
        0.12 + Math.sin(t * 2) * 0.06,
        lerpFactor
      )
      glowRef.current.scale.setScalar(THREE.MathUtils.lerp(
        glowRef.current.scale.x,
        1.5 + Math.sin(t * 1.5) * 0.1,
        lerpFactor
      ))
    }
  })

  return (
    <group ref={groupRef}>
      <primitive 
        key={scene.uuid}
        object={scene} 
        position={[
          -geometryInfo.center.x * geometryInfo.scaleFactor,
          -geometryInfo.center.y * geometryInfo.scaleFactor,
          -geometryInfo.center.z * geometryInfo.scaleFactor
        ]}
        scale={geometryInfo.scaleFactor}
      />
      
      {/* Glow sphere */}
      <mesh ref={glowRef} position={[0, 0, -0.3]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ff4d8d" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      
      <pointLight color="#ff6b9d" intensity={3} distance={10} decay={2} />
      <pointLight color="#ffb6d5" intensity={1.5} distance={6} decay={2} position={[0, 0.5, 0.5]} />
    </group>
  )
}

useGLTF.preload('/heart_in_love.glb')
