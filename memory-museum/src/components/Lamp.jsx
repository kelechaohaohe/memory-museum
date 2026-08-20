import { useGLTF } from '@react-three/drei'

const BASE = import.meta.env.BASE_URL

export default function Lamp({ position = [1.8, -0.82, -0.9], scale = 2 }) {
  const { scene } = useGLTF(`${BASE}models/lamp.glb`)
  return <primitive object={scene} position={position} scale={scale} />
}

useGLTF.preload(`${BASE}models/lamp.glb`)