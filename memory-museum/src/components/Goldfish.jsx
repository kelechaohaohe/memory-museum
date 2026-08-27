import { useGLTF, useAnimations } from '@react-three/drei'
import { useRef, useState } from 'react'
import { LoopRepeat } from 'three'

const BASE = import.meta.env.BASE_URL

export default function Goldfish({ position = [0, 0, 0], scale = 3, onPress }) {
  const group = useRef()
  const { scene, animations } = useGLTF(`${BASE}models/goldfish_scene_1.glb`)
  const { actions } = useAnimations(animations, group)
  const [swimming, setSwimming] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    onPress?.()

    if (swimming) return
    setSwimming(true)

    // Kick off every clip in the file for ~2s, then stop.
    // Once you know the real clip names (check console.log(Object.keys(actions))),
    // swap this for the specific fish clip(s), e.g. actions['Aka_Swim']?.play()
    Object.values(actions).forEach((clip) => {
      clip.reset()
      clip.setLoop(LoopRepeat, Infinity)
      clip.play()
    })

    setTimeout(() => {
      Object.values(actions).forEach((clip) => clip.stop())
      setSwimming(false)
    }, 3000)
  }

  return (
    <group ref={group} position={position} scale={scale} onClick={handleClick}>
      <primitive object={scene} />
    </group>
  )
}
