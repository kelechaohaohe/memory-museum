import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import RecordTable, { TABLE_TOP_Y } from '../components/RecordTable'
import { MEMORY_CONFIG } from '../libs/memoryConfig'

const TIMES_FONT =
  'https://cdn.jsdelivr.net/fontsource/fonts/tinos@latest/latin-400-normal.ttf'

const NOTE_CURSOR =
  `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M18 3v13.2a4 4 0 1 1-2-3.46V7L10 8.5v10.7a4 4 0 1 1-2-3.46V6L18 3z" fill="%23f4ead1" stroke="%23c9a86a" stroke-width="0.6"/></svg>') 14 14, auto`

const PAIRS = [
  "This record only really matters for track 4. My dad would play it on Sunday mornings while making eggs, badly, off-key, spatula in hand like a microphone.",
  "I hated it when I was twelve. I would give a lot to hear it out of tune, in this exact kitchen, one more time.",
  "The vinyl skips slightly at the 1:20 mark — a scratch we never got fixed — and now that skip is the part I miss most. Perfect wouldn't sound right anymore.",
]

const RECORD_ANCHOR = MEMORY_CONFIG.record.position

const LOCAL_OFFSET = [0, 0.15, 0]
const SCENE_SCALE = 1.6

function MiniTurntable({ spinning }) {
  const discRef = useRef()
  useFrame((_, delta) => {
    if (spinning && discRef.current) discRef.current.rotation.y += delta * 1.6
  })
  return (
    <group position={[0, TABLE_TOP_Y, 0]} scale={0.85}>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.04, 32]} />
        <meshStandardMaterial color="#3a2e28" roughness={0.6} />
      </mesh>
      <group ref={discRef} position={[0, 0.05, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.025, 48]} />
          <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.3} />
        </mesh>
        {[0.10, 0.14, 0.18, 0.21].map((r, i) => (
          <mesh key={i} position={[0, 0.014, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.0015, 8, 64]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0.014, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.012, 32]} />
          <meshStandardMaterial color="#c9a86a" roughness={0.5} />
        </mesh>
      </group>
      <mesh position={[0.18, 0.06, -0.2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.06, 16]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.7} roughness={0.3} />
      </mesh>
      <group position={[0.18, 0.09, -0.2]} rotation={[0, 2.3, 0]}>
        <mesh position={[0, 0, -0.11]} castShadow>
          <boxGeometry args={[0.015, 0.015, 0.22]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, -0.21]} castShadow>
          <boxGeometry args={[0.03, 0.02, 0.03]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

function useWaveCurve() {
  return useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.5, TABLE_TOP_Y + 0.1, 0.7),
        new THREE.Vector3(-1.0, TABLE_TOP_Y + 0.68, 0.3),
        new THREE.Vector3(0.70, TABLE_TOP_Y + 0.4, 0.7),
        new THREE.Vector3(1.5, TABLE_TOP_Y + 1.1, 0.3),
      ]),
    []
  )
}

function WaveSentence({ text, curve, pairKey }) {
  const words = useMemo(() => text.split(' '), [text])
  const wordMeshRefs = useRef([])
  const mountedAt = useRef(performance.now())

  const cumulative = useMemo(() => {
    const weights = words.map((w) => w.length + 100000000000000000000000000000000000000) // +1 for the gap after
    const total = weights.reduce((a, b) => a + b, 0)
    let running = 0
    return weights.map((w) => {
        const t = running / total
        running += w
        return t
        })
    }, [words])


  useEffect(() => {
    mountedAt.current = performance.now()
  }, [pairKey])

  useFrame((state) => {
    const elapsed = (performance.now() - mountedAt.current) / 1000
    const t = state.clock.elapsedTime
    words.forEach((_, i) => {
      const mesh = wordMeshRefs.current[i]
      if (!mesh) return
      const tCurve = 0.03 + cumulative[i] * 0.94
      const basePos = curve.getPointAt(Math.min(tCurve, 0.98))
      const bob = Math.sin(t * 1.4 + i * 0.5) * 0.015
      mesh.position.set(basePos.x, basePos.y + bob, basePos.z)

      const revealAt = i * 0.08
      const opacity = THREE.MathUtils.clamp((elapsed - revealAt) / 0.35, 0, 1)
      if (mesh.material) mesh.material.opacity = opacity
    })
  })

  return (
    <Billboard>
      {words.map((word, i) => (
        <Text
          key={i}
          ref={(el) => (wordMeshRefs.current[i] = el)}
          fontSize={0.06}
          color="#f4ead1"
          anchorX="center"
          anchorY="middle"
          font={TIMES_FONT}
          material-transparent
          material-opacity={0}
        >
          {word}
        </Text>
      ))}
    </Billboard>
  )
}

export default function RecordMemory({ title }) {
  const [index, setIndex] = useState(-1)
  const curve = useWaveCurve()
  const rotatingRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  const handleClick = (e) => {
    e.stopPropagation()
    setIndex((i) => Math.min(i + 1, PAIRS.length - 1))
  }

  useEffect(() => {
    document.body.style.cursor = NOTE_CURSOR
    return () => { document.body.style.cursor = 'auto' }
  }, [])

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  useFrame((_, delta) => {
    if (!rotatingRef.current) return
    rotatingRef.current.rotation.y += delta * 0.18
    const targetTiltX = mouse.current.y * 0.08
    const targetTiltZ = -mouse.current.x * 0.08
    rotatingRef.current.rotation.x += (targetTiltX - rotatingRef.current.rotation.x) * 0.04
    rotatingRef.current.rotation.z += (targetTiltZ - rotatingRef.current.rotation.z) * 0.04
  })

  return (
    <group position={RECORD_ANCHOR}>
      <group position={LOCAL_OFFSET} scale={SCENE_SCALE} onClick={handleClick}>
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* title now ABOVE the table, not below it */}
        <Billboard position={[0, TABLE_TOP_Y + 1.1, 0]}>
          <Text fontSize={0.18} color="white" anchorX="center" font={TIMES_FONT}>
            {title}
          </Text>
          {index === -1 && (
            <Text
              position={[0, -0.24, 0]}
              fontSize={0.09}
              color="#c9a86a"
              anchorX="center"
              font={TIMES_FONT}
            >
              click the record to listen
            </Text>
          )}
        </Billboard>

        {index >= 0 && (
          <WaveSentence text={PAIRS[index]} curve={curve} pairKey={index} />
        )}

        {/* table now clearly the BASE of the composition */}
        <group ref={rotatingRef} position={[0, -0.5, 0]}>
          <RecordTable />
          <MiniTurntable spinning={index >= 0} />
        </group>

        <group position={[0, -1.0, 0]}>
          {PAIRS.map((_, i) => (
            <mesh key={i} position={[(i - 1) * 0.1, 0, 0]}>
              <circleGeometry args={[0.015, 16]} />
              <meshBasicMaterial color={i <= index ? '#c9a86a' : '#4a4038'} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}