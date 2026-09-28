import { useMemo } from 'react'
import { createRoundedPanelGeometry } from './geometry'

export function Cap() {
  const shellGeometry = useMemo(
    () => createRoundedPanelGeometry({
      width: 1.22,
      height: 1.38,
      depth: 0.94,
      radius: 0.105,
      bevel: 0.06,
      bevelSegments: 5,
    }),
    [],
  )

  return (
    <group name="CapDetails">
      <mesh name="TitaniumShell" geometry={shellGeometry} castShadow>
        <meshStandardMaterial
          color="#111110"
          metalness={0.94}
          roughness={0.235}
          envMapIntensity={2.35}
        />
      </mesh>
      <mesh name="CapFrontInset" position={[0, 0.02, 0.535]}>
        <planeGeometry args={[0.94, 1.1]} />
        <meshStandardMaterial color="#080808" metalness={0.88} roughness={0.32} envMapIntensity={1.9} />
      </mesh>
      <mesh name="SideMetalStrip" position={[0.573, 0.015, 0.025]}>
        <boxGeometry args={[0.023, 1.04, 0.69]} />
        <meshStandardMaterial color="#837e77" metalness={1} roughness={0.2} envMapIntensity={2.45} />
      </mesh>
      <mesh name="CapSeam" position={[0, -0.56, 0.529]}>
        <boxGeometry args={[0.98, 0.022, 0.015]} />
        <meshStandardMaterial color="#777169" metalness={0.98} roughness={0.2} envMapIntensity={2.3} />
      </mesh>
      <mesh name="TopPlate" position={[0, 0.736, 0]}>
        <boxGeometry args={[0.94, 0.025, 0.69]} />
        <meshStandardMaterial color="#292724" metalness={0.96} roughness={0.2} envMapIntensity={2.4} />
      </mesh>
      <mesh name="CapUnderside" position={[0, -0.735, 0]}>
        <cylinderGeometry args={[0.43, 0.43, 0.12, 48]} />
        <meshStandardMaterial color="#080808" metalness={0.76} roughness={0.36} />
      </mesh>
      <mesh name="MagneticInsert" position={[0, -0.807, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.045, 48]} />
        <meshStandardMaterial color="#53504c" metalness={0.98} roughness={0.23} envMapIntensity={2.1} />
      </mesh>
    </group>
  )
}
