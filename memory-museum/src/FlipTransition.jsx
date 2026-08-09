// FlipTransition.jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function FlipTransition({ position = [-0.5, -0.75, -0.4] }) {
  const pages = useRef([])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    pages.current.forEach((p, i) => {
      if (p) p.rotation.y = ((t * 14 + i * 0.25) % (Math.PI * 2)) - Math.PI
    })
  })

  return (
    <group position={position} scale={0.4}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} ref={(el) => (pages.current[i] = el)} position={[0, 0, i * 0.008]}>
          <planeGeometry args={[0.9, 1.2]} />
          <meshStandardMaterial color="#f4ecd8" side={2} />
        </mesh>
      ))}
    </group>
  )
}