import { useFrame } from '@react-three/fiber'
import { useRef, type MutableRefObject } from 'react'
import { Group, MathUtils, MeshPhysicalMaterial } from 'three'
import { Atomizer, Collar } from './perfume/Atomizer'
import { BottleBody } from './perfume/BottleBody'
import { Cap } from './perfume/Cap'
import { pulse, range, smooth } from './math'

interface PerfumeModelProps {
  progress: MutableRefObject<number>
  reducedMotion?: boolean
}

const COLLAR_Y = 1.96
const ATOMIZER_Y = 2.23
const CAP_Y = 2.9

/**
 * Procedural premium bottle, split into GLB-friendly product modules.
 * Keep this boundary and the four exploded-view groups when a final GLB replaces it.
 */
export function PerfumeModel({ progress, reducedMotion = false }: PerfumeModelProps) {
  const root = useRef<Group>(null)
  const body = useRef<Group>(null)
  const collar = useRef<Group>(null)
  const pump = useRef<Group>(null)
  const cap = useRef<Group>(null)
  const brandingMaterial = useRef<MeshPhysicalMaterial>(null)

  useFrame((state, delta) => {
    const p = progress.current
    const separation = pulse(p, 0.44, 0.515, 0.61)
    const intro = smooth(range(p, 0.005, 0.085))

    if (root.current) {
      const idle = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.34) * 0.018
      root.current.position.y = MathUtils.damp(root.current.position.y, -0.32 + idle * 2, 2.4, delta)
      const scale = 0.82 + intro * 0.18
      root.current.scale.setScalar(MathUtils.damp(root.current.scale.x, scale, 3.5, delta))
    }

    if (body.current) {
      body.current.position.y = MathUtils.damp(body.current.position.y, -separation * 0.5, 4, delta)
    }
    if (collar.current) {
      collar.current.position.y = MathUtils.damp(collar.current.position.y, COLLAR_Y + separation * 0.72, 4, delta)
    }
    if (pump.current) {
      pump.current.position.y = MathUtils.damp(pump.current.position.y, ATOMIZER_Y + separation * 1.22, 4, delta)
      pump.current.position.x = MathUtils.damp(pump.current.position.x, separation * -0.16, 4, delta)
    }
    if (cap.current) {
      cap.current.position.y = MathUtils.damp(cap.current.position.y, CAP_Y + separation * 1.9, 4, delta)
      cap.current.position.x = MathUtils.damp(cap.current.position.x, separation * 0.28, 4, delta)
      cap.current.rotation.z = MathUtils.damp(cap.current.rotation.z, separation * -0.055, 4, delta)
    }
    if (brandingMaterial.current) {
      brandingMaterial.current.emissiveIntensity = 0.025 + intro * 0.095
    }
  })

  return (
    <group ref={root} name="PerfumeModelParts" dispose={null}>
      <group ref={body} name="BottleBody">
        <BottleBody brandingMaterialRef={brandingMaterial} />
      </group>

      <group ref={collar} name="Collar" position={[0, COLLAR_Y, 0]}>
        <Collar />
      </group>

      <group ref={pump} name="Atomizer" position={[0, ATOMIZER_Y, 0]}>
        <Atomizer />
      </group>

      <group ref={cap} name="Cap" position={[0, CAP_Y, 0]}>
        <Cap />
      </group>
    </group>
  )
}
