import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Desk() {
  return (
    <mesh position={[0, -1, 0]}>
      <boxGeometry args={[6, 0.2, 3]} />
      <meshStandardMaterial color="#8B5E3C" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={1} color="#ffd9a0" />
      <Desk />
      <OrbitControls />
    </Canvas>
  )
}