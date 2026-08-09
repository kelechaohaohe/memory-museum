import MemoryObject from './MemoryObject'

export function Book() {
  return (
    <MemoryObject id="book" position={[-1.5, -0.65, 0.5]}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.3, 0.6]} />
        <meshStandardMaterial color="#8B0000" roughness={0.5} />
      </mesh>
    </MemoryObject>
  )
}

export function Journal() {
  return (
    <MemoryObject id="journal" position={[-0.5, -0.7, -0.4]}>
      <mesh castShadow rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.06, 0.55]} />
        <meshStandardMaterial color="#c9a86a" roughness={0.8} />
      </mesh>
    </MemoryObject>
  )
}

export function Letter() {
  return (
    <MemoryObject id="letter" position={[0.7, -0.78, 0.2]}>
      <mesh castShadow rotation={[-Math.PI / 2, 0, 0.2]}>
        <planeGeometry args={[0.4, 0.28]} />
        <meshStandardMaterial color="#f4ecd8" roughness={0.9} side={2} />
      </mesh>
    </MemoryObject>
  )
}

export function Photo() {
  return (
    <MemoryObject id="photo" position={[1.8, -0.55, -0.3]}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.6, 0.03]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.4} />
      </mesh>
    </MemoryObject>
  )
}