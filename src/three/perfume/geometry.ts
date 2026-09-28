import { ExtrudeGeometry, Shape } from 'three'

interface RoundedPanelOptions {
  width: number
  height: number
  depth: number
  radius: number
  bevel?: number
  bevelSegments?: number
}

export function createRoundedPanelGeometry({
  width,
  height,
  depth,
  radius,
  bevel = 0.045,
  bevelSegments = 4,
}: RoundedPanelOptions) {
  const halfWidth = width / 2
  const halfHeight = height / 2
  const corner = Math.min(radius, halfWidth, halfHeight)
  const shape = new Shape()

  shape.moveTo(-halfWidth + corner, -halfHeight)
  shape.lineTo(halfWidth - corner, -halfHeight)
  shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + corner)
  shape.lineTo(halfWidth, halfHeight - corner)
  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - corner, halfHeight)
  shape.lineTo(-halfWidth + corner, halfHeight)
  shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - corner)
  shape.lineTo(-halfWidth, -halfHeight + corner)
  shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + corner, -halfHeight)

  const geometry = new ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    curveSegments: 10,
    bevelEnabled: true,
    bevelSegments,
    bevelSize: bevel,
    bevelThickness: bevel,
  })
  geometry.translate(0, 0, -depth / 2)
  geometry.computeVertexNormals()
  return geometry
}

export function createBottleGeometry() {
  const shape = new Shape()

  shape.moveTo(-1.08, -1.88)
  shape.quadraticCurveTo(-1.24, -1.88, -1.24, -1.7)
  shape.lineTo(-1.24, 1.08)
  shape.quadraticCurveTo(-1.24, 1.28, -1.09, 1.39)
  shape.bezierCurveTo(-0.92, 1.52, -0.68, 1.55, -0.53, 1.67)
  shape.quadraticCurveTo(-0.48, 1.71, -0.43, 1.71)
  shape.lineTo(0.43, 1.71)
  shape.quadraticCurveTo(0.48, 1.71, 0.53, 1.67)
  shape.bezierCurveTo(0.68, 1.55, 0.92, 1.52, 1.09, 1.39)
  shape.quadraticCurveTo(1.24, 1.28, 1.24, 1.08)
  shape.lineTo(1.24, -1.7)
  shape.quadraticCurveTo(1.24, -1.88, 1.08, -1.88)
  shape.closePath()

  const geometry = new ExtrudeGeometry(shape, {
    depth: 1.02,
    steps: 1,
    curveSegments: 14,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.085,
    bevelThickness: 0.085,
  })
  geometry.translate(0, 0, -0.51)
  geometry.computeVertexNormals()
  return geometry
}
