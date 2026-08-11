import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useMemoryStore } from '../stores/useMemoryStore'
import { MEMORY_CONFIG } from '../libs/memoryConfig'

const { position: RECORD_POS } = MEMORY_CONFIG.record

export default function Record({ position = RECORD_POS, scale = 1.8 }) {
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
      <mesh castShadow receiveShadow position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.3, 0.32, 0.04, 32]} />
        <meshStandardMaterial color="#3a2e28" roughness={0.6} />
      </mesh>

      {/* vinyl disc — thicker now, with a visible edge */}
      <group ref={discRef} position={[0, -0.01, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.025, 48]} />
          <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.3} />
        </mesh>

        {/* groove rings — thin concentric torus shapes give it real texture */}
        {[0.10, 0.14, 0.18, 0.21].map((r, i) => (
          <mesh key={i} position={[0, 0.014, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.0015, 8, 64]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.4} />
          </mesh>
        ))}

        {/* label */}
        <mesh position={[0, 0.014, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.012, 32]} />
          <meshStandardMaterial color={MEMORY_CONFIG.record.color} roughness={0.5} />
        </mesh>
      </group>

      {/* tonearm pivot post — sits on the base, outside the disc's edge */}
        <mesh position={[0.18, 0.02, -0.2]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.06, 16]} />
            <meshStandardMaterial color="#8a8a8a" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* tonearm — pivots from the post above; rotate group.y to swing needle over the disc */}
        <group position={[0.18, 0.05, -0.2]} rotation={[0, 2.3, 0]}>
        {/* arm extends outward from the pivot along local -Z, offset by half its
            own length so the pivot end (not the center) stays anchored at the post */}
            <mesh position={[0, 0, -0.11]} castShadow>
                <boxGeometry args={[0.015, 0.015, 0.22]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* needle head at the far tip */}
            <mesh position={[0, 0, -0.21]} castShadow>
                <boxGeometry args={[0.03, 0.02, 0.03]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.4} />
            </mesh>
        </group>
    </group>
  )
}