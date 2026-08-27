import { Sparkles, Html } from '@react-three/drei'
import { useMemoryStore } from '../src/stores/useMemoryStore'
import { MEMORY_CONFIG } from '../src/libs/memoryConfig'

import BookMemory from './memories/BookMemory'
import LetterMemory from './memories/LetterMemory'
import RecordMemory from './memories/RecordMemory'
import PictureMemory from './memories/PictureMemory'

const PARTICLE_STYLE = {
  book: { size: 2.5, speed: 0.2 },
  letter: { size: 1.5, speed: 0.6 },
  record: { size: 1.5, speed: 0.6 },
  picture: { size: 3, speed: 0.35 },
}

const MEMORY_COMPONENTS = {
  book: BookMemory,
  letter: LetterMemory,
  record: RecordMemory,
  picture: PictureMemory,
}

export default function MemoryScene({ onMemoryBlur }) {
  const activeMemory = useMemoryStore((s) => s.activeMemory)
  const reset = useMemoryStore((s) => s.reset)
  if (!activeMemory) return null

  const memory = MEMORY_CONFIG[activeMemory]
  const style = PARTICLE_STYLE[activeMemory] ?? { size: 3, speed: 0.3 }
  const ActiveComponent = MEMORY_COMPONENTS[activeMemory]

  if (!ActiveComponent) return null // safety net for memories not built yet

  return (
    <group>
      <fog attach="fog" args={['#0d0a14', 3, 10]} />
      <Sparkles
        count={150}
        scale={6}
        size={style.size}
        speed={style.speed}
        color={memory.particleColor}
      />

      <ActiveComponent
        title={memory.title}
        onMemoryBlur={onMemoryBlur}
      />
    </group>
  )
}