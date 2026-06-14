import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, useScroll } from '@react-three/drei'
import * as THREE from 'three'

export default function LoveText() {
  const textRef = useRef()
  const groupRef = useRef()
  const scroll = useScroll()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const s = scroll.offset

    if (textRef.current) {
      textRef.current.material.emissiveIntensity = 0.3 + Math.sin(t * 1.5) * 0.15
    }

    if (groupRef.current) {
      // Visible in hero and final
      let opacity = 0
      if (s < 0.2) {
        opacity = 1 - s / 0.2
      } else if (s > 0.75) {
        opacity = (s - 0.75) / 0.25
      }
      groupRef.current.visible = opacity > 0.01

      if (s > 0.75) {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -2.5, 0.05)
      } else {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -2.8, 0.05)
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, -2.8, 0]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text
          ref={textRef}
          fontSize={0.45}
          font="https://fonts.gstatic.com/s/dancingscript/v25/If2RXTr6YS-zF4S-kcSWSVi_szLgiuE.woff2"
          color="#ff4d8d"
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
        >
          Nguyễn Huyền
          <meshStandardMaterial
            color="#ff4d8d"
            emissive="#ff2d6a"
            emissiveIntensity={0.3}
            transparent
            opacity={0.9}
          />
        </Text>
      </Float>
    </group>
  )
}
