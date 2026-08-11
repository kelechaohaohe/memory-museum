// import { useTexture } from '@react-three/drei'
// import { useRef, useState } from 'react'
// import { MEMORY_CONFIG } from '../libs/memoryConfig'
// import { useMemoryStore } from '../stores/useMemoryStore'
// import USAGI from '../../public/images/usagi.jpg?url'
// import { useFrame } from '@react-three/fiber'

// const { position: PICTURE_POS } = MEMORY_CONFIG.picture

// export default function Picture({
//     position = PICTURE_POS,
//     scale = 1,
//     imageSrc = USAGI,
// }) {
//     const ref = useRef()
//     const [hovered, setHovered] = useState(false)
//     const pictureTexture = useTexture(imageSrc)
//     const setActiveMemory = useMemoryStore((s) => s.setActiveMemory)
//     const activeMemory = useMemoryStore((s) => s.activeMemory)
//     const isTransitioning = useMemoryStore((s) => s.activeMemory)
//     const isOpen = activeMemory === 'picture'

//     useFrame(() => {
//         const targetRotX = isOpen ? -0.15 : 0
//         const targetScale = hovered && !isOpen && !isTransitioning ? scale * 1.06 : scale
//         ref.current.rotation.x += (targetRotX - ref.current.rotation.x) * 0.1
//         ref.current.scale.setScalar(
//             ref.current.scale.x + (targetScale - ref.current.scale.x) * 0.1
//         )
//     })

//     return (
//         <group 
//             ref={ref}
//             position={position}
//             scale={scale}
//             onClick={(e) => {
//                 e.stopPropagation()
//                 setActiveMemory(isOpen ? null : 'picture')
//             }}
//             onPointerOver={() => !isTransitioning && setHovered(true)}
//             onPointerOut={() => setHovered(false)}
//         >
//             {/* frame */}
//             <mesh castShadow receiveShadow>
//                 <boxGeometry args={[0.5, 0.6, 0.03]} />
//                 <meshStandardMaterial color="#2b2b2b" roughness={0.4} />
//             </mesh>
//             {/* picture */}
//             <mesh position={[0, 0, 0.02]}>
//                 <planeGeometry args={[0.4, 0.25]} />
//                 <meshStandardMaterial map={photoTexture} roughness={0.9} />
//             </mesh>
//         </group>
//     )
// }