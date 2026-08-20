import { useGLTF, useAnimations, useTexture } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { LoopOnce, DoubleSide } from 'three'
import { useMemoryStore } from '../stores/useMemoryStore'
import { MEMORY_CONFIG } from '../libs/memoryConfig'

const { position: LETTER_POS } = MEMORY_CONFIG.letter
const BASE = import.meta.env.BASE_URL

export default function Letter({ position = LETTER_POS, scale = 3.5 }) {
  const group = useRef()
  const { scene, animations } = useGLTF(`${BASE}models/letter/scene.gltf`)
  const { actions } = useAnimations(animations, group)
  const setActiveMemory = useMemoryStore((s) => s.setActiveMemory)

  const diffuseMap = useTexture(`${BASE}models/letter/textures/Material_27_diffuse.png`)
  const normalMap = useTexture(`${BASE}models/letter/textures/Material_27_normal.png`)
  const occlusionMap = useTexture(`${BASE}models/letter/textures/Material_27_occlusion.png`)

  useEffect(() => {
    diffuseMap.flipY = false
    normalMap.flipY = false
    occlusionMap.flipY = false

    scene.traverse((child) => {
      if (child.isMesh) {
        const applyMaps = (mat) => {
          mat.map = diffuseMap
          mat.normalMap = normalMap
          mat.aoMap = occlusionMap
          mat.side = DoubleSide
          mat.needsUpdate = true
        }
        if (Array.isArray(child.material)) child.material.forEach(applyMaps)
        else applyMaps(child.material)
      }
    })
  }, [scene, diffuseMap, normalMap, occlusionMap])

  const handleClick = (e) => {
    e.stopPropagation()
    const clip = actions['SantaMail']
    if (clip) {
      clip.reset()
      clip.setLoop(LoopOnce, 1)
      clip.clampWhenFinished = true
      clip.play()
    }
    setActiveMemory('letter')
  }

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      rotation={[-Math.PI / 2, 0, Math.PI]}
      onClick={handleClick}
    >
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(`${BASE}models/letter/scene.gltf`)