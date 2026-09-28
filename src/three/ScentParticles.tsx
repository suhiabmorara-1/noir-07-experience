import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type MutableRefObject } from 'react'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, MathUtils, PointsMaterial } from 'three'
import { pulse } from './math'

interface ScentParticlesProps {
  progress: MutableRefObject<number>
  mobile?: boolean
  reducedMotion?: boolean
}

function makeCluster(count: number, seed: number, radius: number) {
  let state = seed >>> 0
  const random = () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 4294967296
  }
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const angle = random() * Math.PI * 2
    const ring = radius * (0.55 + random() * 0.75)
    positions[i * 3] = Math.cos(angle) * ring
    positions[i * 3 + 1] = (random() - 0.5) * 5.8
    positions[i * 3 + 2] = Math.sin(angle) * ring * 0.65 + (random() - 0.5)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  return geometry
}

export function ScentParticles({ progress, mobile = false, reducedMotion = false }: ScentParticlesProps) {
  const group = useRef<Group>(null)
  const cool = useRef<PointsMaterial>(null)
  const violet = useRef<PointsMaterial>(null)
  const amber = useRef<PointsMaterial>(null)
  const count = mobile ? 110 : 340
  const geometries = useMemo(
    () => [makeCluster(count, 7, 3.3), makeCluster(count, 19, 3.8), makeCluster(count, 71, 4.2)],
    [count],
  )

  useFrame((state, delta) => {
    const p = progress.current
    const visible = pulse(p, 0.245, 0.35, 0.47)
    const top = pulse(p, 0.245, 0.3, 0.37) * visible
    const heart = pulse(p, 0.3, 0.36, 0.43) * visible
    const base = pulse(p, 0.36, 0.425, 0.49) * visible
    if (cool.current) cool.current.opacity = MathUtils.damp(cool.current.opacity, top * 0.7, 4, delta)
    if (violet.current) violet.current.opacity = MathUtils.damp(violet.current.opacity, heart * 0.55, 4, delta)
    if (amber.current) amber.current.opacity = MathUtils.damp(amber.current.opacity, base * 0.76, 4, delta)
    if (group.current && !reducedMotion) {
      group.current.rotation.y += delta * 0.055
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.12) * 0.08
    }
  })

  return (
    <group ref={group}>
      <points geometry={geometries[0]} rotation={[0.1, 0, 0.3]}>
        <pointsMaterial ref={cool} color="#bbc4c9" size={mobile ? 0.025 : 0.035} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} />
      </points>
      <points geometry={geometries[1]} rotation={[-0.35, 0.6, -0.2]}>
        <pointsMaterial ref={violet} color="#38283f" size={mobile ? 0.035 : 0.05} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} />
      </points>
      <points geometry={geometries[2]} rotation={[0.55, -0.4, 0.1]}>
        <pointsMaterial ref={amber} color="#c17b45" size={mobile ? 0.03 : 0.045} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} />
      </points>
    </group>
  )
}
