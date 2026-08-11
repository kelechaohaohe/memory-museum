import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useMemoryStore } from '../stores/useMemoryStore'
import { MEMORY_CONFIG } from '../libs/memoryConfig'

const { position: BOOK_POS } = MEMORY_CONFIG.book

export default function Book({ position = BOOK_POS, scale = 4 }) {
  const { scene } = useGLTF('/models/journalBook.glb')
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const setActiveMemory = useMemoryStore((s) => s.setActiveMemory)
  const activeMemory = useMemoryStore((s) => s.activeMemory)
  const isTransitioning = useMemoryStore((s) => s.isTransitioning)
  const isOpen = activeMemory === 'book'

  useFrame(() => {
    // little "lift" and tilt when opened, plus hover feedback
    const targetY = isOpen ? position[1] + 0.08 : position[1]
    const targetRotX = isOpen ? -0.25 : 0
    const targetScale = hovered && !isOpen ? scale * 1.05 : scale

    ref.current.position.y += (targetY - ref.current.position.y) * 0.1
    ref.current.rotation.x += (targetRotX - ref.current.rotation.x) * 0.1
    ref.current.scale.setScalar(
      ref.current.scale.x + (targetScale - ref.current.scale.x) * 0.1
    )
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        setActiveMemory(isOpen ? null : 'book')
      }}
      onPointerOver={() => !isTransitioning && setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  )
}

useGLTF.preload('/models/journalBook.glb')