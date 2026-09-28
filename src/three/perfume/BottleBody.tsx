import { RoundedBox } from '@react-three/drei'
import { useMemo, type MutableRefObject } from 'react'
import { DoubleSide, MeshPhysicalMaterial } from 'three'
import { Branding } from './Branding'
import { createBottleGeometry, createRoundedPanelGeometry } from './geometry'

export function Liquid() {
  const geometry = useMemo(
    () => createRoundedPanelGeometry({
      width: 2.06,
      height: 2.78,
      depth: 0.74,
      radius: 0.18,
      bevel: 0.055,
      bevelSegments: 4,
    }),
    [],
  )

  return (
    <group name="Liquid">
      <mesh geometry={geometry} position={[0, -0.33, -0.015]}>
        <meshPhysicalMaterial
          color="#2b150d"
          roughness={0.21}
          metalness={0.015}
          transmission={0.28}
          thickness={1.05}
          ior={1.38}
          attenuationColor="#5b2410"
          attenuationDistance={0.66}
          envMapIntensity={1.05}
          clearcoat={0.32}
          clearcoatRoughness={0.16}
          transparent
          opacity={0.91}
        />
      </mesh>
      <RoundedBox args={[1.96, 0.035, 0.67]} radius={0.014} smoothness={3} position={[0, 1.055, -0.015]}>
        <meshPhysicalMaterial color="#6b2d13" roughness={0.18} transmission={0.2} opacity={0.5} transparent />
      </RoundedBox>
    </group>
  )
}

export function GlassBase() {
  const geometry = useMemo(
    () => createRoundedPanelGeometry({
      width: 2.25,
      height: 0.3,
      depth: 0.92,
      radius: 0.08,
      bevel: 0.04,
      bevelSegments: 4,
    }),
    [],
  )

  return (
    <mesh name="GlassBase" geometry={geometry} position={[0, -1.67, 0]} receiveShadow>
      <meshPhysicalMaterial
        color="#22191a"
        roughness={0.1}
        metalness={0.02}
        transmission={0.66}
        thickness={3.8}
        ior={1.52}
        attenuationColor="#2a1716"
        attenuationDistance={1.1}
        envMapIntensity={2.35}
        clearcoat={1}
        clearcoatRoughness={0.07}
        transparent
        opacity={0.97}
      />
    </mesh>
  )
}

export function Neck() {
  return (
    <group name="Neck" position={[0, 1.69, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.49, 0.52, 64, 2]} />
        <meshPhysicalMaterial
          color="#171315"
          roughness={0.095}
          metalness={0.04}
          transmission={0.61}
          thickness={1.5}
          ior={1.52}
          attenuationColor="#2e1818"
          attenuationDistance={1.25}
          envMapIntensity={2.15}
          clearcoat={1}
          clearcoatRoughness={0.08}
          transparent
          opacity={0.98}
        />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.425, 0.026, 12, 64]} />
        <meshStandardMaterial color="#4c4540" metalness={0.91} roughness={0.28} envMapIntensity={1.7} />
      </mesh>
    </group>
  )
}

interface BottleBodyProps {
  brandingMaterialRef: MutableRefObject<MeshPhysicalMaterial | null>
}

export function BottleBody({ brandingMaterialRef }: BottleBodyProps) {
  const bottleGeometry = useMemo(() => createBottleGeometry(), [])

  return (
    <group name="BottleBodyDetails">
      <Liquid />
      <mesh name="SmokedGlassShell" geometry={bottleGeometry} castShadow receiveShadow renderOrder={2}>
        <meshPhysicalMaterial
          color="#171316"
          roughness={0.095}
          metalness={0.035}
          transmission={0.7}
          thickness={2.25}
          ior={1.52}
          attenuationColor="#2b1719"
          attenuationDistance={1.75}
          envMapIntensity={2.25}
          clearcoat={1}
          clearcoatRoughness={0.065}
          side={DoubleSide}
          transparent
          opacity={0.985}
          depthWrite={false}
        />
      </mesh>
      <GlassBase />
      <Neck />
      <Branding materialRef={brandingMaterialRef} />
      <mesh name="LowerGlassEdge" position={[0, -1.79, 0.586]}>
        <boxGeometry args={[2.08, 0.025, 0.018]} />
        <meshPhysicalMaterial color="#6f5d55" metalness={0.28} roughness={0.2} envMapIntensity={2.1} />
      </mesh>
    </group>
  )
}
