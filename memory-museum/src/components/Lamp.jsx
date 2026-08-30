import { useState } from 'react'
import { useGLTF } from '@react-three/drei'

const BASE = import.meta.env.BASE_URL

export default function Lamp({ position = [1.8, -0.82, -0.9], scale = 2 }) {
  const { scene } = useGLTF(`${BASE}models/lamp.glb`)
  const [isOn, setIsOn] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    setIsOn(prev => !prev)
    
    scene.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive) {
        child.material.emissiveIntensity = !isOn ? 2.5 : 0.15
      }
    })
  }

  return (
    <>
      <primitive 
        object={scene} 
        position={position} 
        scale={scale} 
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      />
      
      <pointLight 
        position={[position[0], position[1] + 0.5, position[2]]} 
        intensity={isOn ? 3.0 : 0.3} 
        distance={6} 
        color={isOn ? "#fffaed" : "#ffb76b"} 
      />
    </>
  )
}

useGLTF.preload(`${BASE}models/lamp.glb`)