export function Collar() {
  return (
    <group name="CollarDetails">
      <mesh castShadow>
        <cylinderGeometry args={[0.59, 0.61, 0.37, 72, 2]} />
        <meshStandardMaterial color="#252423" metalness={0.94} roughness={0.245} envMapIntensity={2.1} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.53, 0.53, 0.075, 72]} />
        <meshStandardMaterial color="#716b64" metalness={0.98} roughness={0.18} envMapIntensity={2.2} />
      </mesh>
      <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.51, 0.028, 12, 72]} />
        <meshStandardMaterial color="#9a9186" metalness={1} roughness={0.16} envMapIntensity={2.25} />
      </mesh>
      <mesh position={[0, -0.192, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.47, 0.012, 8, 64]} />
        <meshStandardMaterial color="#090909" metalness={0.72} roughness={0.32} />
      </mesh>
    </group>
  )
}

export function Atomizer() {
  return (
    <group name="AtomizerDetails">
      <mesh name="InnerTube" position={[0, -1.34, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 2.78, 16]} />
        <meshPhysicalMaterial color="#6b391e" roughness={0.3} transmission={0.32} transparent opacity={0.46} />
      </mesh>
      <mesh name="Stem" position={[0, -0.12, 0]} castShadow>
        <cylinderGeometry args={[0.115, 0.125, 0.48, 40]} />
        <meshStandardMaterial color="#aaa49b" metalness={0.94} roughness={0.21} envMapIntensity={2} />
      </mesh>
      <mesh name="Actuator" position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.285, 0.255, 0.32, 48, 2]} />
        <meshStandardMaterial color="#282726" metalness={0.96} roughness={0.21} envMapIntensity={2.2} />
      </mesh>
      <mesh position={[0, 0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.242, 0.016, 8, 48]} />
        <meshStandardMaterial color="#76716b" metalness={1} roughness={0.17} />
      </mesh>
      <mesh name="Nozzle" position={[0.22, 0.25, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.072, 0.088, 0.44, 28]} />
        <meshStandardMaterial color="#343230" metalness={0.96} roughness={0.19} envMapIntensity={2.2} />
      </mesh>
      <mesh name="NozzleTip" position={[0.445, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.061, 0.061, 0.028, 24]} />
        <meshStandardMaterial color="#151515" metalness={0.88} roughness={0.28} />
      </mesh>
      <mesh name="SprayPoint" position={[0.461, 0.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.017, 16]} />
        <meshBasicMaterial color="#020202" />
      </mesh>
    </group>
  )
}
