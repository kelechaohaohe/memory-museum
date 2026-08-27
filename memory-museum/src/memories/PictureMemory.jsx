import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { MEMORY_CONFIG } from '../libs/memoryConfig'

const TIMES_FONT = 'https://cdn.jsdelivr.net/fontsource/fonts/tinos@latest/latin-400-normal.ttf'
const PICTURE_ANCHOR = MEMORY_CONFIG.picture.position

// 1. We grab the exact final camera position from your config
const TARGET = MEMORY_CONFIG.picture.cameraTarget 

const LOCAL_OFFSET = [0, 0.15, 0]
const SCENE_SCALE = 2.1 
const BASE = import.meta.env.BASE_URL

const STORY_PARTS = [
  {
    text: "Every other photo from that year, we're posing — stiff smiles, arms around shoulders, everyone trying to look like nothing was wrong.",
    image: `${BASE}images/FamilyPic.png`
  },
  {
    text: "This one got taken by accident, days before he left, mid-laugh, nobody ready. Dad's head is tipped back. My brother's caught mid-sentence — something about the contract, the flights, trying to explain himself in his own clumsy way. I didn't realize he was trying to say sorry. I'm barely in frame. It's blurry. It's the only one I've ever framed.",
    image: `${BASE}images/FamilyPic2.png`
  }
]

function getCardDimensions(text) {
  const len = text.length
  const SIZE_MULTIPLIER = 0.7

  const width = THREE.MathUtils.clamp(
    (1.1 + len * 0.0016) * SIZE_MULTIPLIER,
    1.1 * SIZE_MULTIPLIER,
    2.0 * SIZE_MULTIPLIER
  )
  const height = width * 1.3

  const photoSize = width * (len > 250 ? 0.68 : 0.85)
  const fontSize = THREE.MathUtils.clamp(0.055 - len * 0.00003, 0.04, 0.065)

  return { width, height, photoSize, fontSize, maxWidth: width - 0.15 }
}

function PolaroidCard({ text, image, visible, index }) {
  const groupRef = useRef()
  const anim = useRef(0)
  const texture = useTexture(image)
  
  const { width, height, photoSize, fontSize, maxWidth } = useMemo(
    () => getCardDimensions(text),
    [text]
  )

  useFrame((_, delta) => {
    if (visible) {
      anim.current = THREE.MathUtils.damp(anim.current, 1, 4, delta)
    }

    if (groupRef.current) {
      const dir = index === 0 ? -1 : 1

      groupRef.current.position.x = (dir * 0.85) * anim.current
      groupRef.current.position.y = (0.2 + index * 0.05) * anim.current
      groupRef.current.position.z = 0.4 + 0.6 * anim.current
      groupRef.current.rotation.z = (dir * 0.1) * anim.current

      const scale = 0.1 + 0.9 * anim.current
      groupRef.current.scale.setScalar(Math.max(scale, 0.01))
    }
  })

  const captionY = -height / 2 + (height - photoSize) * 0.28

  return (
    <group ref={groupRef} visible={visible || anim.current > 0.01}>
      <mesh castShadow>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#f0ece0" toneMapped={false} />
      </mesh>

      <mesh position={[0, (height - photoSize) / 2 - 0.06, 0.005]}>
        <planeGeometry args={[photoSize, photoSize]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} map={texture} />
      </mesh>

      <Text
        position={[0, captionY, 0.01]}
        fontSize={fontSize}
        maxWidth={maxWidth}
        color="#1a1a1a"
        font={TIMES_FONT}
        anchorY="middle"
        textAlign="center"
        lineHeight={1.15}
        outlineWidth={0.002}
        outlineColor="#f0ece0"
      >
        {text}
      </Text>
    </group>
  )
}

export default function PictureMemory({ title }) {
  const [step, setStep] = useState(0)

  const flashMeshRef = useRef(null)
  const flashLightRef = useRef(null)
  const facingRef = useRef()
  const staticGroupRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  // 2. Lock the static elements (Title, Hint, Polaroids) to face the final Target coordinate once
  useEffect(() => {
    if (staticGroupRef.current) {
      staticGroupRef.current.lookAt(...TARGET)
    }
  }, [])

  const handleClick = (e) => {
    e.stopPropagation()
    if (step < STORY_PARTS.length) {
      if (flashMeshRef.current) flashMeshRef.current.opacity = 1
      if (flashLightRef.current) flashLightRef.current.intensity = 30
      setStep(s => s + 1)
    }
  }

  useFrame((_, delta) => {
    if (facingRef.current) {
      // 3. The 3D camera also looks at the absolute target coordinate, not the moving viewport camera
      facingRef.current.lookAt(...TARGET)
      // Apply the subtle mouse interactive tilt
      facingRef.current.rotation.x += mouse.current.y * 0.05
      facingRef.current.rotation.z += -mouse.current.x * 0.05
    }

    if (flashMeshRef.current && flashMeshRef.current.opacity > 0) {
      flashMeshRef.current.opacity = Math.max(0, flashMeshRef.current.opacity - delta * 4)
      const scale = 1 + (1 - flashMeshRef.current.opacity) * 1.5
      flashMeshRef.current.scale.setScalar(scale)
    }
    if (flashLightRef.current && flashLightRef.current.intensity > 0) {
      flashLightRef.current.intensity = Math.max(0, flashLightRef.current.intensity - delta * 100)
    }
  })

  return (
    <group position={PICTURE_ANCHOR}>
      <mesh position={[0, 0, -1]} onClick={handleClick}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* STATIC GROUP: Title and Polaroids are now combined and rigidly locked to the target */}
      <group ref={staticGroupRef} position={LOCAL_OFFSET} scale={SCENE_SCALE}>
        
        <Text position={[0, 1.4, 0]} fontSize={0.13} color="white" anchorX="center" font={TIMES_FONT}>
          {title || 'The One Where No One Is Looking at the Camera'}
        </Text>
        
        {step < STORY_PARTS.length && (
          <Text position={[0, 1.2, 0]} fontSize={0.05} color="#87ceeb" anchorX="center" font={TIMES_FONT}>
            click camera to print
          </Text>
        )}

        <group position={[0, -0.4, 0]}>
          {STORY_PARTS.map((part, i) => (
            <PolaroidCard 
              key={i} 
              text={part.text} 
              image={part.image} 
              visible={step > i} 
              index={i} 
            />
          ))}
        </group>
      </group>

      {/* DYNAMIC GROUP: 3D Camera & Progress Dots */}
      <group ref={facingRef} position={LOCAL_OFFSET} scale={SCENE_SCALE}>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <group
            position={[0, -0.4, 0]}
            onClick={handleClick}
            onPointerEnter={() => document.body.style.cursor = 'pointer'}
            onPointerLeave={() => document.body.style.cursor = 'auto'}
          >
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.65, 0.5]} />
              <meshStandardMaterial color="#bfaea3" roughness={0.7} />
            </mesh>

            <mesh position={[0, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
              <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.05, 32]} />
              <meshStandardMaterial color="#111" roughness={0.1} metalness={0.9} />
            </mesh>

            <pointLight ref={flashLightRef} position={[0.25, 0.2, 0.4]} intensity={0} distance={10} color="#ffffff" />

            <mesh position={[0.25, 0.22, 0.26]}>
              <circleGeometry args={[0.4, 32]} />
              <meshBasicMaterial ref={flashMeshRef} color="#ffffff" transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        </Float>

        <group position={[0, -0.85, 0]}>
          {STORY_PARTS.map((_, i) => (
            <mesh key={i} position={[(i - 0.5) * 0.15, 0, 0]}>
              <circleGeometry args={[0.015, 16]} />
              <meshBasicMaterial color={i < step ? '#87ceeb' : '#4a4038'} />
            </mesh>
          ))}
        </group>
      </group>
      
    </group>
  )
}