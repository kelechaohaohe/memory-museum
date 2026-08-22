import { useMemoryStore } from '../stores/useMemoryStore'

export default function BackButton() {
  const closeMemory = useMemoryStore((s) => s.closeMemory)

  return (
    <button
      onClick={closeMemory}
      style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
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
  )
}