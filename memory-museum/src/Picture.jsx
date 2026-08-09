import { useGLTF, useTexture } from '@react-three/drei'
import { useEffect } from 'react'

export default function Picture({
  position = [-0.6, -0.72, -1.1],
  scale = 1,
  imageSrc = '/images/photo1.jpg',
}) {
  const { scene } = useGLTF('/models/picture.glb')
  const photoTexture = useTexture(imageSrc)

  useEffect(() => {
    scene.traverse((child) => {
        if (child.isMesh) {
        child.visible = child.name === 'pCube2_lambert1_0' // toggle this name to test each one
        }
    })
    }, [scene])

  return (
    <group position={position} scale={scale}>
      <primitive object={scene} />
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[0.2, 0.26]} />
        <meshStandardMaterial map={photoTexture} roughness={0.9} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/picture.glb')