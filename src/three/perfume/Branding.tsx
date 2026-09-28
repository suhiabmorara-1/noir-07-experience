import { useEffect, useMemo, type MutableRefObject } from 'react'
import {
  CanvasTexture,
  Color,
  DoubleSide,
  LinearFilter,
  MeshPhysicalMaterial,
  SRGBColorSpace,
} from 'three'

interface BrandingProps {
  materialRef: MutableRefObject<MeshPhysicalMaterial | null>
}

function useBrandingTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1200
    const context = canvas.getContext('2d')!

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = '#d7c7ae'
    context.shadowColor = 'rgba(255,244,224,.22)'
    context.shadowBlur = 7
    context.font = '500 104px Arial, sans-serif'
    context.letterSpacing = '20px'
    context.fillText('NOIR', 512, 365)
    context.font = '300 270px Arial, sans-serif'
    context.letterSpacing = '5px'
    context.fillText('07', 512, 650)
    context.shadowBlur = 0
    context.strokeStyle = 'rgba(215,199,174,.78)'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(298, 824)
    context.lineTo(726, 824)
    context.stroke()
    context.font = '300 32px Arial, sans-serif'
    context.letterSpacing = '9px'
    context.fillText('EXTRAIT DE PARFUM', 512, 900)

    const result = new CanvasTexture(canvas)
    result.colorSpace = SRGBColorSpace
    result.minFilter = LinearFilter
    result.magFilter = LinearFilter
    result.needsUpdate = true
    return result
  }, [])

  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

export function Branding({ materialRef }: BrandingProps) {
  const texture = useBrandingTexture()

  return (
    <mesh name="Branding" position={[0, -0.12, 0.602]} renderOrder={3}>
      <planeGeometry args={[1.43, 1.69]} />
      <meshPhysicalMaterial
        ref={materialRef}
        map={texture}
        transparent
        alphaTest={0.015}
        color="#dfd0b8"
        metalness={0.72}
        roughness={0.31}
        clearcoat={0.36}
        clearcoatRoughness={0.22}
        emissive={new Color('#6f5f4d')}
        emissiveIntensity={0.08}
        envMapIntensity={1.65}
        side={DoubleSide}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  )
}
