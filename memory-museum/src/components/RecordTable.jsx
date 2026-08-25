export const TABLE_TOP_Y = -0.1

export default function RecordTable() {
  const thickness = 0.06
  return (
    <group>
      <mesh position={[0, TABLE_TOP_Y - thickness / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.6, thickness, 1.1]} />
        <meshStandardMaterial color="#8a5a34" roughness={0.55} metalness={0.05} />
      </mesh>
      {[
        [-0.68, TABLE_TOP_Y - thickness - 0.28, -0.42],
        [0.68, TABLE_TOP_Y - thickness - 0.28, -0.42],
        [-0.68, TABLE_TOP_Y - thickness - 0.28, 0.42],
        [0.68, TABLE_TOP_Y - thickness - 0.28, 0.42],
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.07, 0.56, 0.07]} />
          <meshStandardMaterial color="#5e3b22" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}