import { Sparkles, Text } from '@react-three/drei'
import { useMemoryStore } from './store'

const MEMORIES = {
  book:    { title: 'The Story We Wrote', color: '#8B0000' },
  journal: { title: 'Late Night Thoughts', color: '#c9a86a' },
  letter:  { title: 'A Letter Never Sent', color: '#f4ecd8' },
  photo:   { title: 'That Summer', color: '#4a90d9' },
}

export default function MemoryScene() {
  const activeMemory = useMemoryStore((s) => s.activeMemory)
  if (!activeMemory) return null
  const memory = MEMORIES[activeMemory]

  return (
    <group>
      <Sparkles count={150} scale={6} size={3} speed={0.3} color={memory.color} />
      <Text position={[0, 1, 0]} fontSize={0.4} color="white" anchorX="center">
        {memory.title}
      </Text>
    </group>
  )
}