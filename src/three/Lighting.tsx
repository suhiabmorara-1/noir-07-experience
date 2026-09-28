import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { Color, MathUtils, PointLight, RectAreaLight, SpotLight } from 'three'
import { pulse, range, smooth } from './math'

export function Lighting({ progress }: { progress: MutableRefObject<number> }) {
  const key = useRef<RectAreaLight>(null)
  const rim = useRef<RectAreaLight>(null)
  const fill = useRef<RectAreaLight>(null)
  const top = useRef<RectAreaLight>(null)
  const shadowKey = useRef<SpotLight>(null)
  const amber = useRef<PointLight>(null)
  const neutralColor = useMemo(() => new Color('#f2ede6'), [])
  const coolColor = useMemo(() => new Color('#d8d9d7'), [])
  const warmColor = useMemo(() => new Color('#e4cfba'), [])
  const mixedColor = useMemo(() => new Color(), [])

  useLayoutEffect(() => {
    key.current?.lookAt(0, 0.15, 0)
    rim.current?.lookAt(0, 0.25, 0)
    fill.current?.lookAt(0, 0.1, 0)
    top.current?.lookAt(0, 1.25, 0)
  }, [])

  useFrame((state, delta) => {
    const p = progress.current
    const intro = smooth(range(p, 0.005, 0.095))
    const reveal = 0.38 + intro * 0.62
    const topNote = pulse(p, 0.245, 0.3, 0.355)
    const baseNote = pulse(p, 0.355, 0.425, 0.49)
    const finale = smooth(range(p, 0.84, 0.96))

    if (key.current) {
      mixedColor.copy(neutralColor).lerp(coolColor, topNote * 0.32).lerp(warmColor, baseNote * 0.22)
      key.current.color.lerp(mixedColor, 1 - Math.exp(-delta * 3.2))
      key.current.intensity = MathUtils.damp(key.current.intensity, 12.5 * reveal + finale * 3.5, 3, delta)
      key.current.position.x = 4.25 + Math.sin(state.clock.elapsedTime * 0.14) * 0.16
    }
    if (rim.current) {
      rim.current.intensity = MathUtils.damp(rim.current.intensity, 9.5 * reveal + topNote * 3.2, 3, delta)
    }
    if (fill.current) {
      fill.current.intensity = MathUtils.damp(fill.current.intensity, 2.1 * reveal + finale * 0.8, 3, delta)
    }
    if (top.current) {
      top.current.intensity = MathUtils.damp(top.current.intensity, 7.2 * reveal + finale * 2.2, 3, delta)
    }
    if (shadowKey.current) {
      shadowKey.current.intensity = MathUtils.damp(shadowKey.current.intensity, 6.2 * reveal, 3, delta)
    }
    if (amber.current) {
      amber.current.intensity = MathUtils.damp(amber.current.intensity, 2.6 + baseNote * 7 + finale * 5, 3, delta)
    }
  })

  return (
    <>
      <ambientLight intensity={0.055} color="#4a4540" />

      <rectAreaLight
        ref={key}
        position={[4.25, 1.55, 4.1]}
        width={2.7}
        height={6.4}
        intensity={4}
        color="#f2ede6"
      />
      <rectAreaLight
        ref={rim}
        position={[-3.9, 1.15, -2.65]}
        width={0.72}
        height={6.7}
        intensity={3}
        color="#d8d9d7"
      />
      <rectAreaLight
        ref={fill}
        position={[-4.1, 0.35, 3.25]}
        width={2.2}
        height={5.2}
        intensity={0.8}
        color="#9b938b"
      />
      <rectAreaLight
        ref={top}
        position={[0.25, 5.35, 0.8]}
        width={3.2}
        height={1.25}
        intensity={2.4}
        color="#e8ded2"
      />

      <spotLight
        ref={shadowKey}
        position={[3.4, 5.2, 4.6]}
        angle={0.46}
        penumbra={0.92}
        intensity={2}
        color="#e7ded4"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00018}
      />
      <pointLight
        ref={amber}
        position={[0.35, -2.65, -2.1]}
        intensity={2.6}
        distance={8}
        decay={2}
        color="#b66a3a"
      />
    </>
  )
}
