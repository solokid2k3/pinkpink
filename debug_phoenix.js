// Debug script: Analyze phoenix_bird.glb structure
import { readFileSync } from 'fs'

const buf = readFileSync('./public/phoenix_bird.glb')

// GLB header: magic(4) + version(4) + length(4)
const magic = buf.toString('ascii', 0, 4)
const version = buf.readUInt32LE(4)
const totalLength = buf.readUInt32LE(8)
console.log(`GLB: magic=${magic}, version=${version}, totalLength=${totalLength}`)

// Chunk 0 (JSON)
const chunk0Length = buf.readUInt32LE(12)
const chunk0Type = buf.readUInt32LE(16)
const jsonStr = buf.toString('utf8', 20, 20 + chunk0Length)
const gltf = JSON.parse(jsonStr)

console.log('\n=== SCENE STRUCTURE ===')
console.log('Nodes:', gltf.nodes?.length)
gltf.nodes?.forEach((n, i) => {
  console.log(`  Node[${i}]: name="${n.name}", mesh=${n.mesh}, skin=${n.skin}, children=${JSON.stringify(n.children)}, translation=${JSON.stringify(n.translation)}, rotation=${JSON.stringify(n.rotation)}, scale=${JSON.stringify(n.scale)}`)
})

console.log('\n=== MESHES ===')
gltf.meshes?.forEach((m, i) => {
  console.log(`  Mesh[${i}]: name="${m.name}", primitives=${m.primitives?.length}`)
  m.primitives?.forEach((p, j) => {
    console.log(`    Primitive[${j}]: material=${p.material}, attributes=${JSON.stringify(p.attributes)}`)
  })
})

console.log('\n=== MATERIALS ===')
gltf.materials?.forEach((m, i) => {
  console.log(`  Material[${i}]: name="${m.name}"`)
  console.log(`    pbrMetallicRoughness:`, JSON.stringify(m.pbrMetallicRoughness))
  console.log(`    alphaMode: ${m.alphaMode}, doubleSided: ${m.doubleSided}`)
  console.log(`    extensions:`, JSON.stringify(m.extensions))
  console.log(`    emissiveFactor:`, m.emissiveFactor)
})

console.log('\n=== ANIMATIONS ===')
gltf.animations?.forEach((a, i) => {
  console.log(`  Animation[${i}]: name="${a.name}", channels=${a.channels?.length}, samplers=${a.samplers?.length}`)
})

console.log('\n=== ACCESSORS (position) ===')
gltf.meshes?.forEach((m) => {
  m.primitives?.forEach((p) => {
    const posAccessor = gltf.accessors?.[p.attributes?.POSITION]
    if (posAccessor) {
      console.log(`  POSITION accessor: min=${JSON.stringify(posAccessor.min)}, max=${JSON.stringify(posAccessor.max)}, count=${posAccessor.count}`)
    }
  })
})

console.log('\n=== SKINS ===')
gltf.skins?.forEach((s, i) => {
  console.log(`  Skin[${i}]: name="${s.name}", joints=${s.joints?.length}`)
})

console.log('\n=== SCENE ROOT ===')
console.log('Scenes:', JSON.stringify(gltf.scenes))
console.log('Default scene:', gltf.scene)
