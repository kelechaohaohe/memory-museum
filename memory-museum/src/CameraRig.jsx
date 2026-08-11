import { useFrame, useThree } from '@react-three/fiber'
import { useMemoryStore } from '../src/stores/useMemoryStore'
import { MEMORY_CONFIG } from '../src/libs/memoryConfig'

const IDLE_CAM = [0, -0.5, 6]
const MEMORY_CAM = [0, 0.3, 2.5]

export default function CameraRig() {
  const { camera, mouse } = useThree()
  const isTransitioning = useMemoryStore((s) => s.isTransitioning)
  const activeMemory = useMemoryStore((s) => s.activeMemory)

  useFrame(() => {
    // Idle at desk: subtle mouse-follow parallax
    if (!isTransitioning && !activeMemory) {
      const targetX = IDLE_CAM[0] + mouse.x * 0.3
      const targetY = IDLE_CAM[1] + mouse.y * 0.15
      camera.position.x += (targetX - camera.position.x) * 0.02
      camera.position.y += (targetY - camera.position.y) * 0.02
      camera.position.z += (IDLE_CAM[2] - camera.position.z) * 0.02
      camera.lookAt(0, -0.9, 0)
      return
    }

    // Diving into a memory: fly toward THAT object's own camera target
    if (isTransitioning && activeMemory) {
      const cfg = MEMORY_CONFIG[activeMemory]
      camera.position.x += (cfg.cameraTarget[0] - camera.position.x) * 0.08
      camera.position.y += (cfg.cameraTarget[1] - camera.position.y) * 0.08
      camera.position.z += (cfg.cameraTarget[2] - camera.position.z) * 0.08
      camera.lookAt(...cfg.position)
      return
    }

    // Inside the memory scene
    if (activeMemory && !isTransitioning) {
      camera.position.x += (MEMORY_CAM[0] - camera.position.x) * 0.06
      camera.position.y += (MEMORY_CAM[1] - camera.position.y) * 0.06
      camera.position.z += (MEMORY_CAM[2] - camera.position.z) * 0.06
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}