import { useGLTF } from '@react-three/drei'

export default function Lamp({ position = [1.8, -0.82, -0.9], scale = 2 }) {
  const { scene } = useGLTF('/models/lamp.glb')
  return <primitive object={scene} position={position} scale={scale} />
}

useGLTF.preload('/models/lamp.glb')