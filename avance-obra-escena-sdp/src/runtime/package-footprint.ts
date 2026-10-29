// Ground footprint of a scene layer package, from the oriented bounding boxes of its leaf nodes (I3S node pages): one
// convex polygon per leaf, in WGS84. Used to hide the context volumetry where the stations are.
const A = 6378137
const E2 = 6.69437999014e-3

type Vec3 = [number, number, number]

const toEcef = ([lon, lat, h]: Vec3): Vec3 => {
  const [l, p] = [lon * Math.PI / 180, lat * Math.PI / 180]
  const n = A / Math.sqrt(1 - E2 * Math.sin(p) ** 2)
  return [(n + h) * Math.cos(p) * Math.cos(l), (n + h) * Math.cos(p) * Math.sin(l), (n * (1 - E2) + h) * Math.sin(p)]
}

// Lon/lat of an ECEF point (a few fixed-point iterations are plenty at building heights).
const toLonLat = ([x, y, z]: Vec3): [number, number] => {
  const r = Math.hypot(x, y)
  let lat = Math.atan2(z, r * (1 - E2))
  for (let i = 0; i < 4; i++) {
    const n = A / Math.sqrt(1 - E2 * Math.sin(lat) ** 2)
    lat = Math.atan2(z + E2 * n * Math.sin(lat), r)
  }
  return [Math.atan2(y, x) * 180 / Math.PI, lat * 180 / Math.PI]
}

// Rotates v by the unit quaternion [x, y, z, w].
const rotate = ([qx, qy, qz, qw]: number[], v: Vec3): Vec3 => {
  const t = [2 * (qy * v[2] - qz * v[1]), 2 * (qz * v[0] - qx * v[2]), 2 * (qx * v[1] - qy * v[0])]
  return [v[0] + qw * t[0] + qy * t[2] - qz * t[1], v[1] + qw * t[1] + qz * t[0] - qx * t[2], v[2] + qw * t[2] + qx * t[1] - qy * t[0]]
}

const hull = (points: Array<[number, number]>): Array<[number, number]> => {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const half = (list: Array<[number, number]>) => {
    const out: Array<[number, number]> = []
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop()
      out.push(p)
    }
    out.pop()
    return out
  }
  return [...half(sorted), ...half([...sorted].reverse())]
}

const obbRing = (obb: { center: Vec3, halfSize: Vec3, quaternion: number[] }): Array<[number, number]> => {
  const center = toEcef(obb.center)
  const corners: Array<[number, number]> = []
  for (let i = 0; i < 8; i++) {
    const signs = [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1]
    const offset = rotate(obb.quaternion, [signs[0] * obb.halfSize[0], signs[1] * obb.halfSize[1], signs[2] * obb.halfSize[2]])
    corners.push(toLonLat([center[0] + offset[0], center[1] + offset[1], center[2] + offset[2]]))
  }
  const ring = hull(corners)
  return [...ring, ring[0]]
}

// Approximate area in m² of a small lon/lat ring.
const area = (ring: Array<[number, number]>): number => {
  const kx = 111320 * Math.cos(ring[0][1] * Math.PI / 180)
  let sum = 0
  for (let i = 0; i < ring.length - 1; i++) sum += kx * ring[i][0] * 110574 * ring[i + 1][1] - kx * ring[i + 1][0] * 110574 * ring[i][1]
  return Math.abs(sum / 2)
}

// A leaf box this large spans a whole corridor (e.g. 884 × 54 m in I16) and would hide the buildings along it; the
// smaller leaves around it already cover the structure.
const MAX_LEAF_AREA = 20000

// Rings of the leaf boxes of a WGS84 scene layer (…/SceneServer/layers/0); empty when the node pages can't be read.
export async function packageFootprint (layerUrl: string): Promise<Array<Array<[number, number]>>> {
  const rings: Array<Array<[number, number]>> = []
  for (let page = 0; ; page++) {
    const response = await fetch(`${layerUrl}/nodepages/${page}`).catch(() => null)
    if (!response?.ok) break
    const { nodes } = await response.json()
    for (const node of nodes ?? []) {
      if (!node.mesh || node.children?.length || !node.obb) continue
      const ring = obbRing(node.obb)
      if (area(ring) <= MAX_LEAF_AREA) rings.push(ring)
    }
    if (!nodes?.length) break
  }
  return rings
}
