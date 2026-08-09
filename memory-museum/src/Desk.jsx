export default function Desk() {
  const legPositions = [
    [-2.7, -1.5, 1.3], [2.7, -1.5, 1.3],
    [-2.7, -1.5, -1.3], [2.7, -1.5, -1.3],
  ]

  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, -0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.15, 3]} />
        <meshStandardMaterial color="#d99a5b" roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.15, 1.2, 0.15]} />
          <meshStandardMaterial color="#a86b3f" roughness={0.6} />
        </mesh>
      ))}

      {/* Floor so it doesn't float in a void */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#3d2b21" roughness={0.9} />/</mesh>
    </group>
  )
}