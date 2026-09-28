import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type MutableRefObject } from 'react'
import { Color, MathUtils, PointLight, SpotLight } from 'three'
import { pulse, range, smooth } from './math'

export function Lighting({ progress }: { progress: MutableRefObject<number> }) {
  const key = useRef<SpotLight>(null)
  const rim = useRef<SpotLight>(null)
  const amber = useRef<PointLight>(null)
  const violet = useRef<PointLight>(null)
  const coolColor = useMemo(() => new Color('#d5dce0'), [])
  const neutralColor = useMemo(() => new Color('#f1ece6'), [])
  const amberColor = useMemo(() => new Color('#bf7040'), [])
  const mixedColor = useMemo(() => new Color(), [])

  useFrame((state, delta) => {
    const p = progress.current
    const intro = smooth(range(p, 0.005, 0.095))
    const topNote = pulse(p, 0.245, 0.3, 0.355)
    const baseNote = pulse(p, 0.355, 0.425, 0.49)
    const finale = smooth(range(p, 0.84, 0.96))

    if (key.current) {
      mixedColor.copy(neutralColor).lerp(coolColor, topNote * 0.72).lerp(amberColor, baseNote * 0.28)
      key.current.color.lerp(mixedColor, 1 - Math.exp(-delta * 3.2))
      key.current.intensity = MathUtils.damp(key.current.intensity, 24 * intro + finale * 9, 3, delta)
      key.current.position.x = 4.4 + Math.sin(state.clock.elapsedTime * 0.17) * 0.32
    }
    if (rim.current) {
      rim.current.intensity = MathUtils.damp(rim.current.intensity, 16 * intro + topNote * 9, 3, delta)
    }
    if (amber.current) {
      amber.current.intensity = MathUtils.damp(amber.current.intensity, 4 + baseNote * 19 + finale * 15, 3, delta)
    }
    if (violet.current) {
      violet.current.intensity = MathUtils.damp(violet.current.intensity, 1.2 + pulse(p, 0.29, 0.36, 0.44) * 9, 3, delta)
    }
  })

  return (
    <>
      <ambientLight intensity={0.08} color="#4a4643" />
      <spotLight
        ref={key}
        position={[4.5, 5.5, 5]}
        angle={0.42}
        penumbra={0.9}
        intensity={0}
        color="#f1ece6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <spotLight ref={rim} position={[-4.8, 3.2, -3.8]} angle={0.56} penumbra={1} intensity={0} color="#aeb6c0" />
      <pointLight ref={amber} position={[0, -3.1, 2.2]} intensity={4} distance={9} decay={2} color="#bd6d38" />
      <pointLight ref={violet} position={[-3, 0.2, -2]} intensity={1.2} distance={7} decay={2} color="#291c31" />
    </>
  )
}
