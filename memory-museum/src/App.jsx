import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemoryStore } from '../src/stores/useMemoryStore'
import Desk from '../src/components/Desk'
import Book from '../src/components/Book'
import FlipTransition from './FlipTransition'
import MemoryScene from './MemoryScene'
import CameraRig from './CameraRig'
import Lamp from '../src/components/Lamp'
import Letter from '../src/components/Letter'
import Picture from '../src/components/Picture'

export default function App() {
  const activeMemory = useMemoryStore((s) => s.activeMemory)
  const isTransitioning = useMemoryStore((s) => s.isTransitioning)
  const finishTransition = useMemoryStore((s) => s.finishTransition)

  if (isTransitioning) {
    setTimeout(() => finishTransition(), 900)
  }

  return (
    <div style={{ width: '100%', height: '100svh' }}>
      <Canvas camera={{ position: [0, -0.5, 6], fov: 50 }}>
        <color attach="background" args={['#2b2438']} />
        <ambientLight intensity={0.4} color="#ffb877" />
        <directionalLight position={[-4, 4, 3]} intensity={2} color="#ffd9a0" castShadow />

        <CameraRig />

        {!activeMemory && (
          <>
            <Desk />
            <Suspense fallback={null}>
              <Book scale={0.9} />
              <Lamp />
              <Picture />
              <Letter position={[1.4, -0.82, 0.2]} scale={4} />
            </Suspense>
          </>
        )}

        {isTransitioning && <FlipTransition />}
        {activeMemory && !isTransitioning && <MemoryScene />}

        <OrbitControls
          enabled={!activeMemory && !isTransitioning}
          target={[0, -1.5, 0]}
        />
      </Canvas>
    </div>
  )
}