// Debug: Check node tree structure
import { readFileSync } from 'fs'

const buf = readFileSync('./public/phoenix_bird.glb')
const chunk0Length = buf.readUInt32LE(12)
const jsonStr = buf.toString('utf8', 20, 20 + chunk0Length)
const gltf = JSON.parse(jsonStr)

// Build tree
function printTree(nodeIdx, depth = 0) {
  const n = gltf.nodes[nodeIdx]
  const prefix = '  '.repeat(depth)
  const hasMesh = n.mesh !== undefined ? ` [MESH ${n.mesh}]` : ''
  const hasSkin = n.skin !== undefined ? ` [SKIN ${n.skin}]` : ''
  console.log(`${prefix}[${nodeIdx}] ${n.name}${hasMesh}${hasSkin}`)
  if (n.translation) console.log(`${prefix}  pos: [${n.translation.map(v => v.toFixed(2)).join(', ')}]`)
  if (n.rotation) console.log(`${prefix}  rot: [${n.rotation.map(v => v.toFixed(4)).join(', ')}]`)
  if (n.scale) console.log(`${prefix}  scl: [${n.scale.map(v => v.toFixed(4)).join(', ')}]`)
  if (n.children) {
    for (const c of n.children) {
      printTree(c, depth + 1)
    }
  }
}

const rootNodes = gltf.scenes[gltf.scene].nodes
for (const r of rootNodes) {
  printTree(r)
}
