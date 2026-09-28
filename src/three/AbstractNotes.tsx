import { useFrame } from '@react-three/fiber'
import { useRef, type MutableRefObject } from 'react'
import { Group, MathUtils, MeshStandardMaterial } from 'three'
import { pulse } from './math'

export function AbstractNotes({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<Group>(null)
  const materials = useRef<MeshStandardMaterial[]>([])

  useFrame((state, delta) => {
    const visibility = pulse(progress.current, 0.26, 0.37, 0.49)
    materials.current.forEach((material) => {
      material.opacity = MathUtils.damp(material.opacity, visibility * 0.24, 4, delta)
    })
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.055
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
    }
  })

  const materialProps = {
    transparent: true,
    opacity: 0,
    metalness: 0.8,
    roughness: 0.22,
    wireframe: true,
  }

  return (
    <group ref={group}>
      <mesh position={[-3.25, 1.2, -0.4]} rotation={[0.3, 0.2, 0.5]}>
        <icosahedronGeometry args={[0.74, 1]} />
        <meshStandardMaterial ref={(node) => { if (node) materials.current[0] = node }} color="#aeb6b8" {...materialProps} />
      </mesh>
      <mesh position={[3.35, 0.35, -0.8]} rotation={[0.8, 0.1, 0.2]}>
        <torusKnotGeometry args={[0.55, 0.14, 80, 10]} />
        <meshStandardMaterial ref={(node) => { if (node) materials.current[1] = node }} color="#57405c" {...materialProps} />
      </mesh>
      <mesh position={[-2.75, -1.75, 0.25]} rotation={[0.2, 0.5, 0.1]}>
        <octahedronGeometry args={[0.66, 1]} />
        <meshStandardMaterial ref={(node) => { if (node) materials.current[2] = node }} color="#bc7b4d" {...materialProps} />
      </mesh>
    </group>
  )
}
