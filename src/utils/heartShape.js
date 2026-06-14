import * as THREE from 'three'

export function createHeartShape(scale = 1) {
  const shape = new THREE.Shape()
  const x = 0, y = 0

  shape.moveTo(x, y + 0.5 * scale)
  shape.bezierCurveTo(x, y + 0.5 * scale, x - 0.1 * scale, y + 0.35 * scale, x - 0.5 * scale, y + 0.35 * scale)
  shape.bezierCurveTo(x - 0.95 * scale, y + 0.35 * scale, x - 0.95 * scale, y + 0.75 * scale, x - 0.95 * scale, y + 0.75 * scale)
  shape.bezierCurveTo(x - 0.95 * scale, y + 1.0 * scale, x - 0.75 * scale, y + 1.27 * scale, x - 0.45 * scale, y + 1.4 * scale)
  shape.bezierCurveTo(x - 0.2 * scale, y + 1.52 * scale, x, y + 1.75 * scale, x, y + 2.0 * scale)
  shape.bezierCurveTo(x, y + 1.75 * scale, x + 0.2 * scale, y + 1.52 * scale, x + 0.45 * scale, y + 1.4 * scale)
  shape.bezierCurveTo(x + 0.75 * scale, y + 1.27 * scale, x + 0.95 * scale, y + 1.0 * scale, x + 0.95 * scale, y + 0.75 * scale)
  shape.bezierCurveTo(x + 0.95 * scale, y + 0.75 * scale, x + 0.95 * scale, y + 0.35 * scale, x + 0.5 * scale, y + 0.35 * scale)
  shape.bezierCurveTo(x + 0.1 * scale, y + 0.35 * scale, x, y + 0.5 * scale, x, y + 0.5 * scale)

  return shape
}

export function createHeartGeometry(scale = 1, depth = 0.3) {
  const shape = createHeartShape(scale)
  const extrudeSettings = {
    depth: depth * scale,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 2,
    bevelSize: 0.08 * scale,
    bevelThickness: 0.08 * scale,
  }
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geometry.center()
  return geometry
}
