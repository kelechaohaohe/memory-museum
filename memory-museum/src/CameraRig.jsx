// CameraRig.jsx
import { useFrame, useThree } from '@react-three/fiber'
import { useMemoryStore } from './store'

const BOOK_POS = [-0.5, -0.82, -0.4]
const ZOOM_CAM = [BOOK_POS[0], BOOK_POS[1] + 0.15, BOOK_POS[2] + 0.6]
const MEMORY_CAM = [0, 0.3, 2.5]

export default function CameraRig() {
  const { camera } = useThree()
  const isTransitioning = useMemoryStore((s) => s.isTransitioning)
  const activeMemory = useMemoryStore((s) => s.activeMemory)

  useFrame(() => {
    // Do nothing while idle at the desk — let OrbitControls have full control
    if (!isTransitioning && !activeMemory) return

    const target = isTransitioning ? ZOOM_CAM : MEMORY_CAM
    camera.position.x += (target[0] - camera.position.x) * 0.06
    camera.position.y += (target[1] - camera.position.y) * 0.06
    camera.position.z += (target[2] - camera.position.z) * 0.06

    const lookAt = activeMemory && !isTransitioning ? [0, 0, 0] : BOOK_POS
    camera.lookAt(...lookAt)
  })

  return null
}