import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemoryStore } from './store'
import Desk from './Desk'
import Book from './Book'
import FlipTransition from './FlipTransition'
import MemoryScene from './MemoryScene'
import CameraRig from './CameraRig'
import Lamp from './Lamp'
import Letter from './Letter'
import Picture from './Picture'

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
              <Book scale={0.7} />
              <Lamp />
              <Picture />
              <Letter position={[0.7, -0.82, 0.2]} scale={3} />
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