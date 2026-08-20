import { useGLTF, useTexture } from '@react-three/drei'
import { useEffect } from 'react'
import { MEMORY_CONFIG } from '../libs/memoryConfig'

const { position: PICTURE_POS } = MEMORY_CONFIG.picture
const BASE = import.meta.env.BASE_URL

export default function Picture({
  position = PICTURE_POS,
  scale = 0.5,
  rotation =[0, Math.PI / 6, 0],
  imageSrc = '/images/photo1.jpg',
}) {
  const { scene } = useGLTF(`${BASE}models/frame.glb`)
  const photoTexture = useTexture(imageSrc)

  useEffect(() => {
    photoTexture.flipY = false // try true if it looks upside down

    scene.traverse((child) => {
      if (child.isMesh && child.name === 'Cube002_Image001_0') {
        child.material.map = photoTexture
        child.material.needsUpdate = true
      }
    })
  }, [scene, photoTexture])

  return <primitive object={scene} position={position} scale={scale} rotation={rotation}/>
}

useGLTF.preload(`${BASE}models/frame.glb`)
