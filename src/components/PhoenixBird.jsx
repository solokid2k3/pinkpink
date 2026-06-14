import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

// ===== PHOENIX SCENE ERROR BOUNDARY =====
export class PhoenixErrorBoundary extends React.Component {
  state = { hasError: false }
  
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error("Phoenix GLTF failed to load:", error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// ===== PHOENIX LOADING FALLBACK =====
export function PhoenixFallback() {
  return null
}

// Swoop flight path
const _tmpVec = new THREE.Vector3()
const _tmpNext = new THREE.Vector3()
const _tmpDir = new THREE.Vector3()

function getSwoopPosition(p, out) {
  out.set(
    -12 + p * 24,
    3.0 - Math.sin(p * Math.PI) * 4.0,
    -4.0 + Math.sin(p * Math.PI) * 6.0
  )
  return out
}

// ===== MAIN ANIMATED PHOENIX BIRD =====
export default function PhoenixBird() {
  const groupRef = useRef()
  const gltf = useGLTF('/phoenix_bird.glb')
  const { actions, mixer } = useAnimations(gltf.animations, groupRef)
  
  const flybyRef = useRef({ active: false, startTime: 0 })
  const [, forceRender] = useState(0)

  // Fix materials on load
  useEffect(() => {
    let meshCount = 0
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        meshCount++
        const mat = child.material
        if (mat) {
          // The model uses alphaMode:BLEND + emissiveFactor:[1,1,1]
          // Fix: disable transparency, set solid rendering
          mat.transparent = false
          mat.opacity = 1
          mat.alphaTest = 0.05
          mat.side = THREE.DoubleSide
          mat.metalness = 0.1
          mat.roughness = 0.3
          mat.emissive = new THREE.Color('#ff2a8f')
          mat.emissiveIntensity = 8.0 // High emissive to trigger Bloom effect!
          mat.depthWrite = true
          mat.depthTest = true
          mat.needsUpdate = true
        }
        child.frustumCulled = false
        child.visible = true
      }
    })
    console.log(`[PhoenixBird] Loaded model with ${meshCount} meshes, ${gltf.animations.length} animations`)
    console.log(`[PhoenixBird] Available actions:`, Object.keys(actions || {}))
  }, [gltf.scene, gltf.animations.length, actions])

  // Listen to tap event
  useEffect(() => {
    const triggerFlyby = () => {
      console.log('[PhoenixBird] Flyby event received!')
      const fb = flybyRef.current
      fb.active = true
      fb.startTime = performance.now() / 1000
      
      // Start animation
      if (actions) {
        const actionName = Object.keys(actions)[0]
        if (actionName && actions[actionName]) {
          console.log('[PhoenixBird] Playing animation:', actionName)
          actions[actionName].reset().setLoop(THREE.LoopRepeat).fadeIn(0.1).play()
        }
      }
      
      forceRender(n => n + 1) // Trigger re-render to make sure visible updates
    }

    window.addEventListener('phoenix-flyby', triggerFlyby)
    return () => window.removeEventListener('phoenix-flyby', triggerFlyby)
  }, [actions])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    const fb = flybyRef.current
    
    if (!fb.active) {
      groupRef.current.visible = false
      return
    }
    
    groupRef.current.visible = true
    
    // Update animation mixer
    if (mixer) {
      mixer.update(delta)
    }
    
    const elapsed = (performance.now() / 1000) - fb.startTime
    const duration = 2.5
    const p = Math.min(elapsed / duration, 1)

    getSwoopPosition(p, _tmpVec)
    groupRef.current.position.copy(_tmpVec)

    // Face direction of travel
    getSwoopPosition(Math.min(p + 0.02, 1), _tmpNext)
    _tmpDir.subVectors(_tmpNext, _tmpVec).normalize()
    
    groupRef.current.rotation.y = Math.atan2(_tmpDir.x, _tmpDir.z)
    groupRef.current.rotation.x = -Math.asin(_tmpDir.y) * 0.5
    groupRef.current.rotation.z = _tmpDir.x * 0.3

    if (p >= 1) {
      fb.active = false
      groupRef.current.visible = false
      
      // Stop animation
      if (actions) {
        const actionName = Object.keys(actions)[0]
        if (actionName && actions[actionName]) {
          actions[actionName].fadeOut(0.3)
        }
      }
    }
  })

  // Model scale: max dimension ~963 units → want ~3 world units
  const s = 3.0 / 963.7

  return (
    <group ref={groupRef} visible={false}>
      {/* Rotate the model 90 degrees around Y so the bird body faces forward (+Z) */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <primitive 
          object={gltf.scene} 
          position={[377 * s, -169.5 * s, 0]}
          scale={s}
        />
      </group>
      {/* Dynamic light following the phoenix bird to highlight the bloom glow */}
      <pointLight color="#ff2a8f" intensity={12} distance={15} decay={1.5} />
    </group>
  )
}

useGLTF.preload('/phoenix_bird.glb')
