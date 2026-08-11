import { useGLTF, useAnimations, useTexture } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { LoopOnce } from 'three'
import { useMemoryStore } from '../stores/useMemoryStore'

export default function Letter({ position = [-1, -0.82, 0.2], scale = 1 }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/letter/scene.gltf')
  const { actions } = useAnimations(animations, group)
  const setActiveMemory = useMemoryStore((s) => s.setActiveMemory)

  const diffuseMap = useTexture('/models/letter/textures/Material_27_diffuse.png')
  const normalMap = useTexture('/models/letter/textures/Material_27_normal.png')
  const occlusionMap = useTexture('/models/letter/textures/Material_27_occlusion.png')

  useEffect(() => {
    // flip texture Y — glTF and Three.js sometimes disagree on this
    diffuseMap.flipY = false
    normalMap.flipY = false
    occlusionMap.flipY = false

    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.map = diffuseMap
        child.material.normalMap = normalMap
        child.material.aoMap = occlusionMap
        child.material.needsUpdate = true
      }
    })
  }, [scene, diffuseMap, normalMap, occlusionMap])

  useEffect(() => {
  diffuseMap.flipY = false

  scene.traverse((child) => {
      if (child.isMesh) {
        const applyMap = (mat) => {
          const tex = diffuseMap.clone()
          tex.needsUpdate = true

          // preserve any existing UV offset/repeat/rotation from the original material's map, if present
          if (mat.map) {
            tex.offset.copy(mat.map.offset)
            tex.repeat.copy(mat.map.repeat)
            tex.rotation = mat.map.rotation
            tex.center.copy(mat.map.center)
          }

          mat.map = tex
          mat.needsUpdate = true
        }

        if (Array.isArray(child.material)) {
          child.material.forEach(applyMap)
        } else {
          applyMap(child.material)
        }
      }
    })
  }, [scene, diffuseMap])

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
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={handleClick}
    >
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/letter/scene.gltf')