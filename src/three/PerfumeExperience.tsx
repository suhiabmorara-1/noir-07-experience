import { AdaptiveDpr, ContactShadows } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import {
  ACESFilmicToneMapping,
  FogExp2,
  Group,
  MathUtils,
  MeshPhysicalMaterial,
  PMREMGenerator,
  Vector3,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { AbstractNotes } from './AbstractNotes'
import { Lighting } from './Lighting'
import { PerfumeModel } from './PerfumeModel'
import { ProductControls, type ProductInteractionState } from './ProductControls'
import { ScentParticles } from './ScentParticles'
import { pulse, sample } from './math'

interface PerfumeExperienceProps {
  progress: MutableRefObject<number>
  mouse: MutableRefObject<{ x: number; y: number }>
  mobile?: boolean
  reducedMotion?: boolean
  onProductInteractionChange?: (state: ProductInteractionState) => void
}

const X_KEYS = [
  [0, 0], [0.15, 0], [0.23, -1.15], [0.32, 0], [0.45, 0.2],
  [0.6, 0], [0.69, 1.2], [0.78, 1.7], [0.86, -1.1], [1, -1.1],
] as const
const Y_KEYS = [[0, -0.12], [0.45, 0], [0.7, 0.35], [0.84, -0.35], [1, -0.36]] as const
const SCALE_KEYS = [[0, 0.94], [0.1, 1], [0.28, 0.9], [0.45, 0.82], [0.58, 0.9], [0.69, 1.36], [0.78, 0.58], [0.87, 0.92], [1, 0.95]] as const
const CAM_X = [[0, 0], [0.15, 0], [0.28, 0.85], [0.42, 0], [0.58, 0], [0.69, -1.45], [0.76, 0], [1, 0.45]] as const
const CAM_Y = [[0, 0.28], [0.3, 0.45], [0.56, 0.15], [0.69, 1.05], [0.8, 0.6], [1, 0.28]] as const
const CAM_Z = [[0, 8.8], [0.13, 8.25], [0.3, 7.45], [0.45, 9.2], [0.58, 8.6], [0.69, 4.95], [0.78, 11.5], [0.88, 8.3], [1, 8.1]] as const

function StudioEnvironment() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const room = new RoomEnvironment()
    const environment = pmrem.fromScene(room, 0.04).texture
    const previous = scene.environment
    scene.environment = environment
    return () => {
      scene.environment = previous
      environment.dispose()
      room.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])

  return null
}

function SceneRig({
  progress,
  mouse,
  mobile = false,
  reducedMotion = false,
  onProductInteractionChange,
}: PerfumeExperienceProps) {
  const stage = useRef<Group>(null)
  const floorMaterial = useRef<MeshPhysicalMaterial>(null)
  const { camera, scene } = useThree()
  const cameraTarget = useMemo(() => new Vector3(), [])
  const desiredCamera = useMemo(() => new Vector3(), [])

  useEffect(() => {
    scene.fog = new FogExp2('#050505', mobile ? 0.047 : 0.037)
    return () => { scene.fog = null }
  }, [mobile, scene])

  useFrame((_, delta) => {
    const p = progress.current
    const mobileFactor = mobile ? 0.62 : 1

    if (stage.current) {
      const x = sample(p, X_KEYS) * mobileFactor
      const y = sample(p, Y_KEYS)
      const scale = sample(p, SCALE_KEYS) * (mobile ? 0.78 : 1)
      stage.current.position.x = MathUtils.damp(stage.current.position.x, x, 3.3, delta)
      stage.current.position.y = MathUtils.damp(stage.current.position.y, y, 3.3, delta)
      stage.current.scale.setScalar(MathUtils.damp(stage.current.scale.x, scale, 3.4, delta))
    }

    desiredCamera.set(
      sample(p, CAM_X) * mobileFactor,
      sample(p, CAM_Y),
      sample(p, CAM_Z) + (mobile ? 1.35 : 0),
    )
    camera.position.lerp(desiredCamera, 1 - Math.exp(-delta * (reducedMotion ? 8 : 2.8)))
    cameraTarget.set(sample(p, X_KEYS) * mobileFactor * 0.2, sample(p, Y_KEYS) * 0.35, 0)
    camera.lookAt(cameraTarget)

    if (floorMaterial.current) {
      const finalVisibility = pulse(p, 0.8, 0.96, 1.3)
      floorMaterial.current.opacity = MathUtils.damp(floorMaterial.current.opacity, 0.04 + finalVisibility * 0.82, 3, delta)
    }
  })

  return (
    <>
      <StudioEnvironment />
      <Lighting progress={progress} />
      <ScentParticles progress={progress} mobile={mobile} reducedMotion={reducedMotion} />
      {!mobile && <AbstractNotes progress={progress} />}

      <group ref={stage} name="CinematicGroup">
        <ProductControls
          mouse={mouse}
          mobile={mobile}
          reducedMotion={reducedMotion}
          onInteractionChange={onProductInteractionChange}
        >
          <PerfumeModel progress={progress} reducedMotion={reducedMotion} />
        </ProductControls>
      </group>

      <mesh position={[0, -2.55, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshPhysicalMaterial
          ref={floorMaterial}
          color="#050505"
          metalness={0.82}
          roughness={0.24}
          transparent
          opacity={0.05}
          envMapIntensity={0.85}
        />
      </mesh>
      {!mobile && (
        <ContactShadows
          position={[0, -2.5, 0]}
          scale={9}
          opacity={0.4}
          blur={2.6}
          far={5}
          resolution={512}
          frames={1}
          color="#000000"
        />
      )}
      <mesh position={[0, -2.4, -4.5]}>
        <sphereGeometry args={[4.4, 32, 16]} />
        <meshBasicMaterial color="#472113" transparent opacity={0.018} depthWrite={false} />
      </mesh>
    </>
  )
}

export function PerfumeExperience(props: PerfumeExperienceProps) {
  return (
    <div className="experience-shell" aria-hidden="true">
      <Canvas
        shadows={!props.mobile}
        dpr={props.mobile ? [1, 1.25] : [1, 1.65]}
        camera={{ position: [0, 0.28, 8.8], fov: props.mobile ? 39 : 34, near: 0.1, far: 60 }}
        gl={{ antialias: !props.mobile, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping
          gl.toneMappingExposure = 0.92
        }}
      >
        <Suspense fallback={null}>
          <SceneRig {...props} />
          {!props.reducedMotion && (
            <EffectComposer multisampling={0} enableNormalPass={false}>
              <Bloom intensity={0.34} luminanceThreshold={0.76} luminanceSmoothing={0.22} mipmapBlur />
              <Vignette eskil={false} offset={0.18} darkness={0.7} />
            </EffectComposer>
          )}
          <AdaptiveDpr pixelated />
        </Suspense>
      </Canvas>
    </div>
  )
}
