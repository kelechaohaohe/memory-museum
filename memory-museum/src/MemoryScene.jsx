import { Sparkles, Text, Html } from '@react-three/drei'
import { useMemoryStore } from '../src/stores/useMemoryStore'
import { MEMORY_CONFIG } from '../src/libs/memoryConfig'

const PARTICLE_STYLE = {
  book: { size: 2.5, speed: 0.2 },
  letter: { size: 4, speed: 0.15 },
  record: { size: 1.5, speed: 0.6 },
  picture: { size: 3, speed: 0.35 },
}

export default function MemoryScene() {
  const activeMemory = useMemoryStore((s) => s.activeMemory)
  const reset = useMemoryStore((s) => s.reset)
  if (!activeMemory) return null

  const memory = MEMORY_CONFIG[activeMemory]
  const style = PARTICLE_STYLE[activeMemory] ?? { size: 3, speed: 0.3 }

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
      <Text position={[0, 1, 0]} fontSize={0.4} color="white" anchorX="center">
        {memory.title}
      </Text>

      <Html center position={[0, -1, 0]}>
        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 999,
            color: 'white',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
          }}
        >
          ← back to the desk
        </button>
      </Html>
    </group>
  )
}