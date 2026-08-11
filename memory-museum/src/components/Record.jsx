import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useMemoryStore } from '../stores/useMemoryStore'
import { MEMORY_CONFIG } from '../libs/memoryConfig'

const { position: RECORD_POS } = MEMORY_CONFIG.record

export default function Record({ position = RECORD_POS, scale = 1 }) {
  const group = useRef()
  const discRef = useRef()
  const [hovered, setHovered] = useState(false)
  const setActiveMemory = useMemoryStore((s) => s.setActiveMemory)
  const activeMemory = useMemoryStore((s) => s.activeMemory)
  const isTransitioning = useMemoryStore((s) => s.isTransitioning)
  const isOpen = activeMemory === 'record'

  useFrame((_, delta) => {
    if (isOpen) discRef.current.rotation.y += delta * 2.2

    const targetY = isOpen ? position[1] + 0.05 : position[1]
    const targetScale = hovered && !isOpen && !isTransitioning ? scale * 1.05 : scale
    group.current.position.y += (targetY - group.current.position.y) * 0.1
    group.current.scale.setScalar(
      group.current.scale.x + (targetScale - group.current.scale.x) * 0.1
    )
  })

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        setActiveMemory(isOpen ? null : 'record')
      }}
      onPointerOver={() => !isTransitioning && setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* turntable base */}
      <mesh castShadow receiveShadow position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.03, 32]} />
        <meshStandardMaterial color="#3a2e28" roughness={0.6} />
      </mesh>

      {/* vinyl disc */}
      <group ref={discRef} position={[0, -0.005, 0]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.01, 48]} />
          <meshStandardMaterial color="#111111" roughness={0.35} metalness={0.2} />
        </mesh>
        {/* label */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.01, 32]} />
          <meshStandardMaterial color={MEMORY_CONFIG.record.color} roughness={0.5} />
        </mesh>
      </group>

      {/* tonearm */}
      <mesh position={[0.22, 0.02, -0.18]} rotation={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.02, 0.02, 0.22]} />
        <meshStandardMaterial color="#c9a86a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}