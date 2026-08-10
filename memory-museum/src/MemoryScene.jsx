import { Sparkles, Text } from '@react-three/drei'
import { Html } from '@react-three/drei'
import { useMemoryStore } from './stores/useMemoryStore'

const MEMORIES = {
  book:    { title: 'The Story We Wrote', color: '#8B0000' },
  journal: { title: 'Late Night Thoughts', color: '#c9a86a' },
  letter:  { title: 'A Letter Never Sent', color: '#f4ecd8' },
  photo:   { title: 'That Summer', color: '#4a90d9' },
}

export default function MemoryScene() {
  const activeMemory = useMemoryStore((s) => s.activeMemory)
  const reset = useMemoryStore((s) => s.reset)
  if (!activeMemory) return null
  const memory = MEMORIES[activeMemory]

  return (
    <group>
      <Sparkles count={150} scale={6} size={3} speed={0.3} color={memory.color} />
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