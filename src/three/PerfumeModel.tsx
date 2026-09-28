import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type MutableRefObject } from 'react'
import {
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  LinearFilter,
  MathUtils,
  MeshStandardMaterial,
  SRGBColorSpace,
} from 'three'
import { pulse, range, smooth } from './math'

interface PerfumeModelProps {
  progress: MutableRefObject<number>
  mouse: MutableRefObject<{ x: number; y: number }>
  reducedMotion?: boolean
}

function useLogoTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const context = canvas.getContext('2d')!
    context.clearRect(0, 0, 1024, 1024)
    context.textAlign = 'center'
    context.fillStyle = '#e9e6df'
    context.font = '500 102px Arial, sans-serif'
    context.letterSpacing = '18px'
    context.fillText('NOIR', 512, 380)
    context.font = '300 236px Arial, sans-serif'
    context.letterSpacing = '6px'
    context.fillText('07', 512, 635)
    context.strokeStyle = 'rgba(233,230,223,.65)'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(290, 708)
    context.lineTo(734, 708)
    context.stroke()
    context.font = '300 31px Arial, sans-serif'
    context.letterSpacing = '9px'
    context.fillText('EXTRAIT DE PARFUM', 512, 780)

    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    texture.needsUpdate = true
    return texture
  }, [])
}

/**
 * Procedural placeholder for the final GLB/GLTF bottle.
 * Keep this component boundary when swapping to useGLTF('/models/noir-07.glb').
 */
export function PerfumeModel({ progress, mouse, reducedMotion = false }: PerfumeModelProps) {
  const root = useRef<Group>(null)
  const body = useRef<Group>(null)
  const collar = useRef<Group>(null)
  const pump = useRef<Group>(null)
  const cap = useRef<Group>(null)
  const labelMaterial = useRef<MeshStandardMaterial>(null)
  const logo = useLogoTexture()

  useFrame((state, delta) => {
    const p = progress.current
    const separation = pulse(p, 0.44, 0.515, 0.61)
    const intro = smooth(range(p, 0.005, 0.085))
    const pointerX = reducedMotion ? 0 : mouse.current.x
    const pointerY = reducedMotion ? 0 : mouse.current.y

    if (root.current) {
      const rotationPass = smooth(range(p, 0.13, 0.32))
      const detailPass = smooth(range(p, 0.58, 0.7))
      const idle = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.34) * 0.018
      const targetY = rotationPass * Math.PI * 1.22 + detailPass * 0.22 + pointerX * 0.055
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, targetY, 3.1, delta)
      root.current.rotation.x = MathUtils.damp(root.current.rotation.x, pointerY * -0.025 + idle, 3.2, delta)
      root.current.position.y = MathUtils.damp(root.current.position.y, idle * 2, 2.4, delta)
      const scale = 0.82 + intro * 0.18
      root.current.scale.setScalar(MathUtils.damp(root.current.scale.x, scale, 3.5, delta))
    }

    if (body.current) {
      body.current.position.y = MathUtils.damp(body.current.position.y, -separation * 0.5, 4, delta)
    }
    if (collar.current) {
      collar.current.position.y = MathUtils.damp(collar.current.position.y, 1.82 + separation * 0.72, 4, delta)
    }
    if (pump.current) {
      pump.current.position.y = MathUtils.damp(pump.current.position.y, 2.11 + separation * 1.22, 4, delta)
      pump.current.position.x = MathUtils.damp(pump.current.position.x, separation * -0.16, 4, delta)
    }
    if (cap.current) {
      cap.current.position.y = MathUtils.damp(cap.current.position.y, 2.71 + separation * 1.9, 4, delta)
      cap.current.position.x = MathUtils.damp(cap.current.position.x, separation * 0.28, 4, delta)
      cap.current.rotation.z = MathUtils.damp(cap.current.rotation.z, separation * -0.055, 4, delta)
    }
    if (labelMaterial.current) {
      labelMaterial.current.emissiveIntensity = 0.025 + intro * 0.11
    }
  })

  return (
    <group ref={root} dispose={null}>
      <group ref={body}>
        <RoundedBox args={[2.44, 3.52, 1.18]} radius={0.2} smoothness={10} position={[0, -0.15, 0]} castShadow>
          <meshPhysicalMaterial
            color="#080707"
            roughness={0.13}
            metalness={0.08}
            transmission={0.34}
            thickness={1.65}
            ior={1.53}
            transparent
            opacity={0.95}
            envMapIntensity={1.72}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </RoundedBox>

        <RoundedBox args={[1.96, 2.92, 0.78]} radius={0.12} smoothness={7} position={[0, -0.28, -0.02]}>
          <meshPhysicalMaterial
            color="#24130d"
            roughness={0.24}
            metalness={0.02}
            transmission={0.08}
            transparent
            opacity={0.82}
            envMapIntensity={0.7}
          />
        </RoundedBox>

        <mesh position={[0, 1.68, 0]} castShadow>
          <cylinderGeometry args={[0.44, 0.56, 0.62, 48]} />
          <meshPhysicalMaterial color="#090909" metalness={0.3} roughness={0.18} clearcoat={1} />
        </mesh>

        <mesh position={[0, -0.14, 0.602]}>
          <planeGeometry args={[1.45, 1.72]} />
          <meshStandardMaterial
            ref={labelMaterial}
            map={logo}
            transparent
            color="#e4e0d7"
            metalness={0.42}
            roughness={0.31}
            emissive={new Color('#8b7b68')}
            emissiveIntensity={0.1}
            side={DoubleSide}
          />
        </mesh>

        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 2.6, 16]} />
          <meshStandardMaterial color="#24150e" roughness={0.22} transparent opacity={0.72} />
        </mesh>

        <mesh position={[0, -1.88, 0]} receiveShadow>
          <boxGeometry args={[2.12, 0.06, 0.92]} />
          <meshStandardMaterial color="#1e1510" metalness={0.18} roughness={0.24} />
        </mesh>
      </group>

      <group ref={collar} position={[0, 1.82, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.59, 0.59, 0.38, 64]} />
          <meshStandardMaterial color="#171717" metalness={0.96} roughness={0.18} envMapIntensity={1.8} />
        </mesh>
        <mesh position={[0, -0.03, 0]}>
          <torusGeometry args={[0.49, 0.035, 12, 64]} />
          <meshStandardMaterial color="#77716c" metalness={1} roughness={0.12} />
        </mesh>
      </group>

      <group ref={pump} position={[0, 2.11, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.48, 32]} />
          <meshStandardMaterial color="#272727" metalness={0.95} roughness={0.16} />
        </mesh>
        <mesh position={[0.18, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.075, 0.5, 24]} />
          <meshStandardMaterial color="#2d2d2d" metalness={0.96} roughness={0.14} />
        </mesh>
      </group>

      <group ref={cap} position={[0, 2.71, 0]}>
        <RoundedBox args={[1.23, 1.38, 1.08]} radius={0.13} smoothness={8} castShadow>
          <meshStandardMaterial color="#0b0b0b" metalness={0.88} roughness={0.16} envMapIntensity={1.7} />
        </RoundedBox>
        <mesh position={[0.58, 0, 0]}>
          <boxGeometry args={[0.018, 0.96, 0.66]} />
          <meshStandardMaterial color="#5b5854" metalness={1} roughness={0.12} />
        </mesh>
      </group>
    </group>
  )
}
