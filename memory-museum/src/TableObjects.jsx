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

export function Record() {
  return (
    <MemoryObject id="record" position={[-0.3, -0.75, -0.9]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 48]} />
        <meshStandardMaterial color="#111111" roughness={0.35} metalness={0.2} />
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