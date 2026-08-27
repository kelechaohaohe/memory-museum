import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { OrbitControls, Environment } from '@react-three/drei'
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { useMemoryStore } from '../src/stores/useMemoryStore'
import Desk from '../src/components/Desk'
import Book from '../src/components/Book'
import Letter from '../src/components/Letter'
import Record from '../src/components/Record'
import Picture from '../src/components/Picture'
import Lamp from '../src/components/Lamp'
import DimOverlay from '../src/components/DimOverlay'
import FlipTransition from './FlipTransition'
import WhiteFadeTransition from './components/WhiteFadeTransition'
import MemoryScene from './MemoryScene'
import CameraRig from './CameraRig'
import BackButton from '../src/components/BackButton'
import { useSyncMemoryRoute } from './hooks/useSyncMemoryRoute'

export default function App() {
  useSyncMemoryRoute()
  const activeMemory = useMemoryStore((s) => s.activeMemory)
  const isTransitioning = useMemoryStore((s) => s.isTransitioning)
  const finishTransition = useMemoryStore((s) => s.finishTransition)
  const [memoryBlur, setMemoryBlur] = useState(false)

  useEffect(() => {
    if (!isTransitioning) return
    const timer = setTimeout(() => finishTransition(), 900)
    return () => clearTimeout(timer)
  }, [isTransitioning, finishTransition])

  return (
    <div style={{ width: '100%', height: '100svh', position: 'relative' }}>
      <Canvas camera={{ position: [0, -0.5, 6], fov: 50 }} shadows>
        <color attach="background" args={['#2b2438']} />
        <fog attach="fog" args={['#2b2438', 4, 14]} />

        <ambientLight intensity={0.15} color="#3a2e4a" />
        <directionalLight position={[-4, 4, 3]} intensity={2} color="#ffd9a0" castShadow />
        <pointLight position={[0, 1, -2]} intensity={0.8} color="#aa3bff" />

        <Environment preset="apartment" background={false} />

        <CameraRig />

        {!activeMemory && (
          <>
            <Desk />
            <Suspense fallback={null}>
              <Book scale={0.9} />
              <Lamp />
              <Picture scale={0.5} />
              <Letter />
              <Record scale={1.8} />
            </Suspense>
          </>
        )}

              
        {isTransitioning && activeMemory === 'record' && null /* white fade renders outside Canvas below */}
        {isTransitioning && activeMemory !== 'record' && activeMemory !== 'letter' && <FlipTransition />}
        {activeMemory && !isTransitioning && (
          <MemoryScene onMemoryBlur={setMemoryBlur} />
        )}

        <OrbitControls
          enabled={!activeMemory && !isTransitioning}
          target={[0, -1.5, 0]}
        />

        <EffectComposer>
          <DepthOfField 
            focusDistance={isTransitioning || memoryBlur ? 0.015 : 0}
            focalLength={0.05}
            bokehScale={isTransitioning || memoryBlur ? 3 : 0}
          />
          <Bloom intensity={0.5} luminanceThreshold={0.3} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.6} />
          <Noise opacity={0.015} />
        </EffectComposer>
      </Canvas>

      <DimOverlay />
      <WhiteFadeTransition
        active={
          isTransitioning &&
          (activeMemory === 'record' || activeMemory === 'letter')
        }
      />
      {activeMemory && !isTransitioning && <BackButton />}
    </div>
  )
}