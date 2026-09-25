import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { InkRoadTime } from '@/data/inkRoad'

// 墨线水彩公路：程序化生成的小镇、跨海桥、竖直回环与升天螺旋。
// 渲染三遍：法线 → 彩色 → 合成（墨线描边 + 水彩纸纹 + 撕纸边框）。

export type InkRoadCameraMode = 'chase' | 'top'

export type InkRoadFrame = {
  speed: number
  heading: number
  progress: number
  // 前方最近的路边广告牌下标，没有时为 -1
  billboard: number
}

export type InkRoadBillboardSpec = {
  slug: string
  name: string
  at: number
  side: 1 | -1
  eyebrow: string
  caption: string
  metrics: string[]
  tone: string
  period: string
}

export type InkRoadEngine = {
  setProgress: (progress: number) => void
  setTime: (time: InkRoadTime, instant?: boolean) => void
  setCameraMode: (mode: InkRoadCameraMode) => void
  setPointer: (x: number, y: number) => void
  setActive: (active: boolean) => void
  snap: () => void
  resize: () => void
  dispose: () => void
}

type EngineOptions = {
  lowPower: boolean
  chapterStarts: number[]
  onFrame?: (frame: InkRoadFrame) => void
  onToken?: (count: number, total: number) => void
  billboards: InkRoadBillboardSpec[]
  onBillboard?: (slug: string) => void
}

const ROAD_WIDTH = 10
const SIDEWALK = 3.4
const PAPER = '#f2ede1'
const INK = '#1e1e1e'
const DRIVE_END = 0.94

type TimePreset = {
  top: string
  bottom: string
  cloud: string
  sun: string
  sunI: number
  sunDir: [number, number, number]
  hemiSky: string
  hemiGround: string
  hemiI: number
  water: string
  windows: string
  bulb: string
  halo: number
}

const TIME_PRESETS: Record<InkRoadTime, TimePreset> = {
  dawn: { top: '#8fa3dc', bottom: '#ffd6c2', cloud: '#fff1ea', sun: '#ffc9a6', sunI: 1.1, sunDir: [0.7, 0.2, -0.5], hemiSky: '#dfe2ff', hemiGround: '#e9c7b5', hemiI: 1.3, water: '#9fd0e4', windows: '#34508f', bulb: '#f4e9d8', halo: 0.15 },
  morning: { top: '#79b4ec', bottom: '#eef4f7', cloud: '#ffffff', sun: '#fff3dd', sunI: 1.45, sunDir: [0.5, 0.6, 0.35], hemiSky: '#e8f2ff', hemiGround: '#efe3c9', hemiI: 1.35, water: '#8fd6e6', windows: '#2c4a98', bulb: '#f1efe8', halo: 0 },
  noon: { top: '#4f9fee', bottom: '#dcefff', cloud: '#ffffff', sun: '#ffffff', sunI: 1.6, sunDir: [0.2, 0.92, 0.25], hemiSky: '#eaf4ff', hemiGround: '#efe6cf', hemiI: 1.4, water: '#7fd4ea', windows: '#2c4a98', bulb: '#f1efe8', halo: 0 },
  golden: { top: '#86a8e0', bottom: '#ffdcae', cloud: '#fff4e2', sun: '#ffd6a6', sunI: 1.35, sunDir: [-0.75, 0.32, -0.3], hemiSky: '#fff0dc', hemiGround: '#f2dcc0', hemiI: 1.3, water: '#9ed4e2', windows: '#3a4d8a', bulb: '#ffe7b3', halo: 0.3 },
  dusk: { top: '#3f3f7c', bottom: '#f09ab0', cloud: '#f7c6d6', sun: '#ff9aa8', sunI: 0.9, sunDir: [-0.8, 0.12, -0.45], hemiSky: '#b7a8e6', hemiGround: '#c98fa8', hemiI: 1.05, water: '#9c86c9', windows: '#ffcf7a', bulb: '#ff7ccf', halo: 0.75 },
  night: { top: '#0c0f2c', bottom: '#3a2a5c', cloud: '#4a3f73', sun: '#9fb0ff', sunI: 0.55, sunDir: [0.3, 0.7, -0.5], hemiSky: '#8088d0', hemiGround: '#4a3a62', hemiI: 1.15, water: '#34387a', windows: '#ffd57a', bulb: '#ff5fcf', halo: 1 },
}

const WALLS = ['#f4efe6', '#f2c7c7', '#c9c3e8', '#f3dc8a', '#a9cbe9', '#e9b8a2', '#d8e7c4', '#f6e2c4']
const TOWERS = ['#efc75e', '#f3ead7', '#eab3b0', '#b9c7ea']
const ROOFS = ['#e2703a', '#d0602f', '#c9764a']
const SHUTTERS = ['#3a5fc8', '#4e9a6a', '#2f7fb0', '#c8443a']
const GREENS = ['#7cc242', '#5fae3b', '#a5d64c', '#8bcf4f']

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

// ---------------------------------------------------------------------------
// 几何收集：所有静态道具合并成少数几个 draw call

class GeoBag {
  parts: THREE.BufferGeometry[] = []

  add(source: THREE.BufferGeometry, matrix: THREE.Matrix4 | null, color: string | [string, string]) {
    let geo = source.index ? source.toNonIndexed() : source.clone()
    if (geo.getAttribute('uv')) geo.deleteAttribute('uv')
    if (geo.getAttribute('uv1')) geo.deleteAttribute('uv1')
    geo.clearGroups()
    const pos = geo.getAttribute('position') as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)
    const a = new THREE.Color(Array.isArray(color) ? color[0] : color)
    const b = new THREE.Color(Array.isArray(color) ? color[1] : color)
    geo.computeBoundingBox()
    const box = geo.boundingBox!
    const span = Math.max(box.max.y - box.min.y, 0.0001)
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) - box.min.y) / span
      c.copy(b).lerp(a, t)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    if (matrix) geo.applyMatrix4(matrix)
    geo.computeVertexNormals()
    this.parts.push(geo)
    if (geo !== source) source.dispose()
  }

  build() {
    if (this.parts.length === 0) return new THREE.BufferGeometry()
    const merged = mergeGeometries(this.parts, false)
    this.parts.forEach((part) => part.dispose())
    this.parts = []
    return merged ?? new THREE.BufferGeometry()
  }
}

function lumpy(geo: THREE.BufferGeometry, amount: number, seed: number) {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const h = Math.sin(v.x * 12.9898 + v.y * 78.233 + v.z * 37.719 + seed) * 43758.5453
    const n = h - Math.floor(h)
    v.multiplyScalar(1 + (n - 0.5) * amount)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  return geo
}

function roofPrism(width: number, depth: number, height: number) {
  const shape = new THREE.Shape()
  shape.moveTo(-depth / 2 - 0.6, 0)
  shape.lineTo(depth / 2 + 0.6, 0)
  shape.lineTo(0, height)
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, { depth: width + 0.8, bevelEnabled: false })
  geo.translate(0, 0, -(width + 0.8) / 2)
  geo.rotateY(Math.PI / 2)
  return geo
}

// ---------------------------------------------------------------------------
// 道路路径与旋转最小标架

type Track = {
  count: number
  length: number
  P: THREE.Vector3[]
  T: THREE.Vector3[]
  U: THREE.Vector3[]
  S: THREE.Vector3[]
  indexAt: (s: number) => number
  sAt: (index: number) => number
  nearestS: (point: THREE.Vector3) => number
}

function buildTrack(): Track {
  const pts: THREE.Vector3[] = []
  const push = (x: number, y: number, z: number) => pts.push(new THREE.Vector3(x, y, z))

  for (let z = 60; z > 0; z -= 5) push(0, 0, z)
  for (let s = 0; s <= 340; s += 5) {
    const bend = 7 * (1 - Math.cos((2 * Math.PI * s) / 170)) * (s < 170 ? 1 : -1)
    push(bend, 0, -s)
  }
  for (let s = 5; s <= 220; s += 5) push(-30 * smooth(20, 200, s), 12 * smooth(0, 120, s), -340 - s)
  for (let z = -565; z >= -600; z -= 5) push(-30, 12, z)
  const R = 32
  for (let k = 1; k <= 48; k++) {
    const u = k / 48
    const theta = Math.PI * 2 * u
    push(-30 + 16 * (3 * u * u - 2 * u * u * u), 12 + R * (1 - Math.cos(theta)), -600 - R * Math.sin(theta))
  }
  for (let z = -605; z >= -680; z -= 5) push(-14, 12, z)
  const turns = Math.PI * 2.2
  for (let k = 1; k <= 72; k++) {
    const u = k / 72
    const phi = turns * u
    push(-64 + 50 * Math.cos(phi), 12 + 112 * Math.pow(u, 1.6), -680 - 50 * Math.sin(phi))
  }
  const last = pts[pts.length - 1]
  const dir = last.clone().sub(pts[pts.length - 2]).normalize()
  for (let k = 1; k <= 8; k++) pts.push(last.clone().addScaledVector(dir, k * 5))

  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
  const length = curve.getLength()
  const count = Math.round(length)
  const P = curve.getSpacedPoints(count - 1)
  const T: THREE.Vector3[] = []
  const U: THREE.Vector3[] = []
  const S: THREE.Vector3[] = []

  for (let i = 0; i < count; i++) {
    const a = P[Math.max(i - 1, 0)]
    const b = P[Math.min(i + 1, count - 1)]
    T.push(b.clone().sub(a).normalize())
  }
  // 双反射法求旋转最小标架：回环里“上”方向跟着翻转，不会拧麻花
  U.push(new THREE.Vector3(0, 1, 0).addScaledVector(T[0], -T[0].y).normalize())
  for (let i = 0; i < count - 1; i++) {
    const v1 = P[i + 1].clone().sub(P[i])
    const c1 = v1.dot(v1) || 1e-6
    const rL = U[i].clone().addScaledVector(v1, (-2 / c1) * v1.dot(U[i]))
    const tL = T[i].clone().addScaledVector(v1, (-2 / c1) * v1.dot(T[i]))
    const v2 = T[i + 1].clone().sub(tL)
    const c2 = v2.dot(v2) || 1e-6
    const next = rL.addScaledVector(v2, (-2 / c2) * v2.dot(rL))
    next.addScaledVector(T[i + 1], -next.dot(T[i + 1])).normalize()
    U.push(next)
  }
  for (let i = 0; i < count; i++) S.push(new THREE.Vector3().crossVectors(T[i], U[i]).normalize())

  const step = length / (count - 1)
  return {
    count,
    length,
    P,
    T,
    U,
    S,
    indexAt: (s) => Math.min(Math.max(Math.round(s / step), 0), count - 1),
    sAt: (index) => index * step,
    nearestS: (point) => {
      let best = 0
      let bestD = Infinity
      for (let i = 0; i < count; i++) {
        const d = P[i].distanceToSquared(point)
        if (d < bestD) {
          bestD = d
          best = i
        }
      }
      return best * step
    },
  }
}

// ---------------------------------------------------------------------------
// 画布纹理

function roadTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const rand = rng(7)
  ctx.fillStyle = '#c9c8e2'
  ctx.fillRect(0, 0, 256, 512)
  for (let y = 0; y < 512; y += 44) {
    const offset = (y / 44) % 2 === 0 ? 0 : 30
    for (let x = -offset; x < 256; x += 60) {
      ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(120,118,170,0.08)'
      ctx.fillRect(x + 2, y + 2, 56, 40)
      ctx.strokeStyle = 'rgba(70,66,110,0.35)'
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(x + rand() * 3, y + rand() * 2)
      ctx.lineTo(x + 60 + rand() * 3, y + rand() * 2)
      ctx.moveTo(x + rand() * 2, y)
      ctx.lineTo(x + rand() * 2, y + 44)
      ctx.stroke()
      if (rand() > 0.82) {
        ctx.beginPath()
        ctx.moveTo(x + 10 + rand() * 30, y + 8)
        ctx.lineTo(x + 20 + rand() * 30, y + 20 + rand() * 14)
        ctx.lineTo(x + 18 + rand() * 30, y + 36)
        ctx.stroke()
      }
    }
  }
  const lane = (u: number, width: number) => {
    ctx.strokeStyle = '#1d1b2c'
    ctx.lineWidth = width
    ctx.beginPath()
    for (let y = 0; y <= 512; y += 16) ctx.lineTo(u * 256 + Math.sin(y * 0.05) * 1.2, y)
    ctx.stroke()
  }
  lane(0.05, 5)
  lane(0.95, 5)
  lane(0.3, 3)
  lane(0.7, 3)
  ctx.fillStyle = '#f2c230'
  for (let y = 20; y < 512; y += 128) {
    ctx.fillRect(122, y, 5, 72)
    ctx.fillRect(130, y, 5, 72)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 8
  return tex
}

function waveTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const rand = rng(11)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 256, 256)
  ctx.strokeStyle = 'rgba(40,110,160,0.35)'
  ctx.lineCap = 'round'
  for (let i = 0; i < 26; i++) {
    const x = rand() * 256
    const y = rand() * 256
    ctx.lineWidth = 1.5 + rand() * 2
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + 10, y - 6, x + 22, y)
    ctx.quadraticCurveTo(x + 32, y + 5, x + 42, y - 1)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}

const GLYPHS: [string, string][] = [
  ['{ }', '#df48b2'],
  ['</>', '#3558b8'],
  ['AI', '#f0a020'],
  ['✦', '#df48b2'],
  ['⌘', '#2fa37a'],
  ['∑', '#e2703a'],
  ['↯', '#3558b8'],
]

function glyphTexture(text: string, color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.font = `900 ${text.length > 2 ? 46 : 64}px "Arial Black", "Helvetica Neue", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 10
  ctx.strokeStyle = INK
  ctx.strokeText(text, 64, 66)
  ctx.fillStyle = color
  ctx.fillText(text, 64, 66)
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.strokeText(text, 62, 62)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const BOARD_TONES: Record<string, [string, string]> = {
  sunset: ['#f7b733', '#df48b2'],
  ocean: ['#2f8fb5', '#8fd6e6'],
  violet: ['#6b5bd6', '#c9c3e8'],
  forest: ['#2fa37a', '#bfe08a'],
  ember: ['#e2703a', '#f2c230'],
  mono: ['#1a1830', '#c9c8e2'],
}

function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

// 广告牌海报：纸底 + 水彩色块 + 墨线框，字体就绪后会重画一次
function drawBillboard(canvas: HTMLCanvasElement, spec: InkRoadBillboardSpec, index: number) {
  const W = canvas.width
  const H = canvas.height
  const ctx = canvas.getContext('2d')!
  const [a, b] = BOARD_TONES[spec.tone] ?? BOARD_TONES.mono
  const rand = rng(index * 31 + 5)
  const display = '"Inter", "Helvetica Neue", sans-serif'
  const mono = '"SFMono-Regular", Consolas, "Liberation Mono", monospace'

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f7f2e6'
  ctx.fillRect(0, 0, W, H)
  for (let k = 0; k < 8; k++) {
    const x = 520 + rand() * 520
    const y = rand() * H
    const r = 110 + rand() * 210
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    const c = k % 2 ? a : b
    g.addColorStop(0, withAlpha(c, 0.5))
    g.addColorStop(0.7, withAlpha(c, 0.18))
    g.addColorStop(1, withAlpha(c, 0))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }
  ctx.textBaseline = 'alphabetic'
  ctx.font = `500 300px ${display}`
  ctx.fillStyle = withAlpha(a, 0.2)
  ctx.textAlign = 'right'
  ctx.fillText(String(index + 1).padStart(2, '0'), W - 50, H - 150)
  ctx.textAlign = 'left'

  ctx.textBaseline = 'top'
  ctx.font = `400 24px ${mono}`
  ctx.fillStyle = INK
  ctx.fillText(`ROADSIDE No.${String(index + 1).padStart(2, '0')}  ·  ${spec.period}`.toUpperCase(), 58, 54)
  ctx.fillStyle = a === '#1a1830' ? '#b8318f' : a
  ctx.font = `400 26px ${mono}`
  ctx.fillText(spec.eyebrow.toUpperCase(), 58, 90)

  let size = 132
  const setTitle = () => {
    ctx.font = `500 ${size}px ${display}`
    ctx.letterSpacing = `${-size * 0.06}px`
  }
  setTitle()
  while (ctx.measureText(spec.name).width > 900 && size > 64) {
    size -= 8
    setTitle()
  }
  ctx.fillStyle = INK
  ctx.fillText(spec.name, 50, 136)
  ctx.letterSpacing = '0px'

  ctx.font = `500 29px "Inter", "Helvetica Neue", sans-serif`
  ctx.fillStyle = '#34304a'
  const words = spec.caption.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > 880 && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  lines.slice(0, 2).forEach((text, k) => {
    const last = k === 1 && lines.length > 2
    ctx.fillText(last ? `${text.replace(/[,.;]?$/, '')}…` : text, 58, 128 + size * 1.02 + k * 40)
  })

  let x = 58
  ctx.font = `400 23px ${mono}`
  for (const metric of spec.metrics.slice(0, 3)) {
    const w = ctx.measureText(metric.toUpperCase()).width + 40
    ctx.beginPath()
    ctx.rect(x, H - 118, w, 54)
    ctx.fillStyle = '#fffdf8'
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = INK
    ctx.stroke()
    ctx.fillStyle = INK
    ctx.fillText(metric.toUpperCase(), x + 20, H - 104)
    x += w + 14
  }

  ctx.fillStyle = '#111111'
  ctx.fillRect(W - 312, H - 116, 262, 62)
  ctx.fillStyle = INK
  ctx.fillRect(W - 318, H - 122, 262, 62)
  ctx.fillStyle = '#df48b2'
  ctx.font = `400 24px ${mono}`
  ctx.fillText('VIEW PROJECT →', W - 296, H - 104)

  ctx.lineWidth = 14
  ctx.strokeStyle = INK
  ctx.strokeRect(16, 16, W - 32, H - 32)
}

function haloTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.45)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

// ---------------------------------------------------------------------------
// 着色器

const NOISE_GLSL = /* glsl */ `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
`

const BEND_VERTEX = /* glsl */ `
vec4 mvPosition = modelMatrix * vec4( transformed, 1.0 );
vec3 bendRel = mvPosition.xyz - uBendOrigin;
float bendAhead = max(dot(bendRel, uBendDir) - uBendStart, 0.0);
mvPosition.xyz += uBendUp * (bendAhead * bendAhead * uBend);
mvPosition = viewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;
`

const COMPOSITE_FRAGMENT = /* glsl */ `
uniform sampler2D tColor;
uniform sampler2D tNormal;
uniform sampler2D tDepth;
uniform vec2 uRes;
uniform float uTime;
uniform float uNear;
uniform float uFar;
uniform float uDpr;
uniform float uBorder;
uniform float uFrame;
uniform vec3 uPaper;
uniform vec3 uInk;
varying vec2 vUv;
${NOISE_GLSL}
float linDepth(vec2 uv) {
  float z = texture2D(tDepth, uv).x * 2.0 - 1.0;
  return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear));
}
void main() {
  vec2 uv = vUv;
  float boil = floor(uTime * 6.0);
  vec2 px = 1.0 / uRes;
  vec2 wob = (vec2(fbm(uv * 7.0 + boil * 0.37), fbm(uv * 7.0 + 17.0 + boil * 0.21)) - 0.5) * 0.0035;
  vec3 base = texture2D(tColor, uv + wob).rgb;
  vec3 blur = texture2D(tColor, uv + wob + vec2(px.x * 2.5, 0.0)).rgb
    + texture2D(tColor, uv + wob - vec2(px.x * 2.5, 0.0)).rgb
    + texture2D(tColor, uv + wob + vec2(0.0, px.y * 2.5)).rgb
    + texture2D(tColor, uv + wob - vec2(0.0, px.y * 2.5)).rgb;
  blur *= 0.25;
  vec3 col = mix(base, blur, 0.35);

  float grain = fbm(uv * uRes / (9.0 * uDpr));
  col *= 0.9 + 0.16 * grain;
  float wetEdge = clamp(length(base - blur) * 3.0, 0.0, 1.0);
  col *= 1.0 - wetEdge * 0.22;

  // 墨线：法线与深度的不连续处，偏移带抖动，逐 1/6 秒“沸腾”
  vec2 jit = (vec2(noise(uv * uRes / (50.0 * uDpr) + boil), noise(uv * uRes / (50.0 * uDpr) + 9.0 + boil)) - 0.5) * px * 2.2 * uDpr;
  vec2 o = px * 1.35 * uDpr;
  vec2 c = uv + jit;
  vec3 n0 = texture2D(tNormal, c).rgb;
  float d0 = linDepth(c);
  float nEdge = 0.0;
  float dEdge = 0.0;
  vec2 offs[4];
  offs[0] = vec2(o.x, 0.0);
  offs[1] = vec2(-o.x, 0.0);
  offs[2] = vec2(0.0, o.y);
  offs[3] = vec2(0.0, -o.y);
  for (int i = 0; i < 4; i++) {
    nEdge += length(texture2D(tNormal, c + offs[i]).rgb - n0);
    dEdge += abs(linDepth(c + offs[i]) - d0) / max(d0, 1.0);
  }
  float edge = max(smoothstep(0.42, 0.8, nEdge), smoothstep(0.04, 0.1, dEdge));
  edge *= 1.0 - smoothstep(320.0, 1100.0, d0);
  edge *= 0.75 + 0.25 * noise(uv * uRes / (14.0 * uDpr));

  float paperTex = fbm(uv * uRes / (2.5 * uDpr)) * 0.6 + fbm(uv * uRes / (40.0 * uDpr)) * 0.4;
  col = mix(col, uPaper, 0.07);
  col *= 0.95 + 0.07 * paperTex;
  col = mix(col, uInk, edge * 0.9);

  // 撕纸边框：进入尾声时边框变宽、外圈透出页面底色
  vec2 p = uv * uRes;
  float d = min(min(p.x, uRes.x - p.x), min(p.y, uRes.y - p.y));
  float ragged = fbm(p / (70.0 * uDpr)) * 0.75 + fbm(p / (11.0 * uDpr)) * 0.35;
  float border = mix(uBorder, min(uRes.x, uRes.y) * 0.16, uFrame) * (0.55 + 0.9 * ragged);
  float inside = smoothstep(border, border + 16.0 * uDpr, d);
  col *= 1.0 - 0.14 * (1.0 - smoothstep(border, border + 60.0 * uDpr, d));
  vec3 paperCol = uPaper * (0.97 + 0.05 * paperTex);
  col = mix(paperCol, col, inside);
  float rim = smoothstep(border - 14.0 * uDpr * (0.4 + ragged), border - 2.0 * uDpr, d);
  // 撕边外侧始终透明，露出站点底色，与页面融为一体
  float alpha = rim;

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
  gl_FragColor.rgb *= alpha;
  gl_FragColor.a = alpha;
}
`

const SKY_VERTEX = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_Position.z = gl_Position.w;
}
`

const SKY_FRAGMENT = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uBottom;
uniform vec3 uCloud;
uniform vec3 uSun;
uniform vec3 uSunDir;
uniform float uTime;
varying vec3 vDir;
${NOISE_GLSL}
void main() {
  vec3 dir = normalize(vDir);
  float h = dir.y;
  vec3 col = mix(uBottom, uTop, smoothstep(-0.05, 0.6, h));
  vec2 q = dir.xz / (abs(h) + 0.22) * 1.3 + vec2(uTime * 0.008, 0.0);
  float cl = fbm(q * 1.6) * 0.7 + fbm(q * 5.0) * 0.3;
  cl = smoothstep(0.48, 0.72, cl) * smoothstep(-0.02, 0.2, h);
  col = mix(col, uCloud, cl * 0.8);
  float s = max(dot(dir, normalize(uSunDir)), 0.0);
  col += uSun * pow(s, 60.0) * 0.5 + uSun * pow(s, 6.0) * 0.08;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`

const HALO_VERTEX = /* glsl */ `
uniform float uBend;
uniform vec3 uBendOrigin;
uniform vec3 uBendDir;
uniform vec3 uBendUp;
uniform float uBendStart;
uniform float uScale;
void main() {
  vec3 transformed = position;
  ${BEND_VERTEX}
  gl_PointSize = uScale / max(-mvPosition.z, 1.0);
}
`

const HALO_FRAGMENT = /* glsl */ `
uniform sampler2D uMap;
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  float a = texture2D(uMap, gl_PointCoord).a * uOpacity;
  gl_FragColor = vec4(uColor * a, a);
}
`

// ---------------------------------------------------------------------------

export function createInkRoadEngine(container: HTMLElement, options: EngineOptions): InkRoadEngine {
  const { lowPower, chapterStarts } = options
  // 每个引擎独占一块画布：同一画布上重建渲染器会共享 GL 上下文并互相污染状态
  const canvas = document.createElement('canvas')
  canvas.className = 'inkroad-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  container.prepend(canvas)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  renderer.autoClear = true

  const dprCap = lowPower ? 1 : 1.6
  let dpr = Math.min(window.devicePixelRatio || 1, dprCap)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(58, 1, 0.5, 3200)
  camera.layers.enableAll()
  const rand = rng(2026)
  const track = buildTrack()
  const disposables: Array<{ dispose: () => void }> = []

  // 世界弯折：前方远处的世界朝镜头“上方”翻起，像纸被折起来
  const bend = {
    uBend: { value: 0.0004 },
    uBendOrigin: { value: new THREE.Vector3() },
    uBendDir: { value: new THREE.Vector3(0, 0, -1) },
    uBendUp: { value: new THREE.Vector3(0, 1, 0) },
    uBendStart: { value: 55 },
  }
  const withBend = <M extends THREE.Material>(material: M) => {
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, bend)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\nuniform float uBend;\nuniform vec3 uBendOrigin;\nuniform vec3 uBendDir;\nuniform vec3 uBendUp;\nuniform float uBendStart;`)
        .replace('#include <project_vertex>', BEND_VERTEX)
    }
    material.customProgramCacheKey = () => 'ink-bend'
    disposables.push(material)
    return material
  }

  const gradient = new THREE.DataTexture(new Uint8Array([96, 168, 222, 255]), 4, 1, THREE.RedFormat)
  gradient.minFilter = THREE.NearestFilter
  gradient.magFilter = THREE.NearestFilter
  gradient.needsUpdate = true
  disposables.push(gradient)

  const propsMat = withBend(new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: gradient, side: THREE.DoubleSide }))
  const roadTex = roadTexture()
  disposables.push(roadTex)
  const roadMat = withBend(new THREE.MeshToonMaterial({ map: roadTex, gradientMap: gradient, side: THREE.DoubleSide }))
  const windowMat = withBend(new THREE.MeshBasicMaterial({ color: '#2c4a98' }))
  const bulbMat = withBend(new THREE.MeshBasicMaterial({ color: '#f1efe8' }))
  const waveTex = waveTexture()
  waveTex.repeat.set(90, 90)
  disposables.push(waveTex)
  const waterMat = withBend(new THREE.MeshToonMaterial({ color: '#8fd6e6', map: waveTex, gradientMap: gradient }))
  const normalMat = withBend(new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }))

  const props = new GeoBag()
  const windows = new GeoBag()
  const bulbs = new GeoBag()
  const haloPositions: number[] = []

  const at = (i: number, lateral: number, up: number) =>
    track.P[i].clone().addScaledVector(track.S[i], lateral).addScaledVector(track.U[i], up)
  const frameMatrix = (i: number, position: THREE.Vector3) =>
    new THREE.Matrix4().makeBasis(track.T[i], track.U[i], track.S[i]).setPosition(position)

  const markS = {
    start: track.nearestS(new THREE.Vector3(0, 0, 24)),
    prompt: track.nearestS(new THREE.Vector3(0, 0, -165)),
    bridge: track.nearestS(new THREE.Vector3(0, 0, -340)),
    loop: track.nearestS(new THREE.Vector3(-30, 12, -560)),
    fold: track.nearestS(new THREE.Vector3(-14, 12, -680)),
    end: track.length - 32,
  }
  const townEndIndex = track.indexAt(markS.bridge + 6)

  // --- 进度 → 路程 ---
  const progressStops = [...chapterStarts, DRIVE_END]
  const sStops = [markS.start, markS.prompt, markS.bridge, markS.loop, markS.fold, markS.end]
  const progressToS = (p: number) => {
    const clamped = Math.min(Math.max(p, 0), DRIVE_END)
    for (let k = 0; k < progressStops.length - 1; k++) {
      if (clamped <= progressStops[k + 1]) {
        const t = (clamped - progressStops[k]) / (progressStops[k + 1] - progressStops[k])
        return sStops[k] + (sStops[k + 1] - sStops[k]) * t
      }
    }
    return markS.end
  }

  // 广告牌立在“出现进度”对应位置前方一段，保证车开到那里时牌子正在视野里
  const boardPlacements = options.billboards.map((spec) => ({ spec, s: progressToS(spec.at) + 26 }))
  const nearBoard = (s: number, side: number, gap: number) =>
    boardPlacements.some((board) => board.spec.side === side && Math.abs(board.s - s) < gap)


  // --- 路面 ---
  {
    const positions: number[] = []
    const uvs: number[] = []
    const indices: number[] = []
    for (let i = 0; i < track.count; i++) {
      const l = at(i, -ROAD_WIDTH / 2, 0)
      const r = at(i, ROAD_WIDTH / 2, 0)
      const v = track.sAt(i) / 26
      positions.push(l.x, l.y, l.z, r.x, r.y, r.z)
      uvs.push(0, v, 1, v)
      if (i < track.count - 1) {
        const a = i * 2
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    const road = new THREE.Mesh(geo, roadMat)
    road.frustumCulled = false
    scene.add(road)
    disposables.push(geo)
  }

  const ribbon = (i0: number, i1: number, step: number, a: (i: number) => THREE.Vector3, b: (i: number) => THREE.Vector3, color: string) => {
    const positions: number[] = []
    for (let i = i0; i < i1; i += step) {
      const j = Math.min(i + step, i1)
      const a0 = a(i)
      const b0 = b(i)
      const a1 = a(j)
      const b1 = b(j)
      positions.push(a0.x, a0.y, a0.z, b0.x, b0.y, b0.z, a1.x, a1.y, a1.z)
      positions.push(b0.x, b0.y, b0.z, b1.x, b1.y, b1.z, a1.x, a1.y, a1.z)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    props.add(geo, null, color)
  }

  // 路基：镇里是人行道，镇外是橙色护栏和奶油色桥体
  const half = ROAD_WIDTH / 2
  ribbon(0, townEndIndex, 2, (i) => at(i, -half - SIDEWALK, 0.28), (i) => at(i, -half, 0.28), '#e9d8b4')
  ribbon(0, townEndIndex, 2, (i) => at(i, half, 0.28), (i) => at(i, half + SIDEWALK, 0.28), '#e9d8b4')
  ribbon(0, townEndIndex, 2, (i) => at(i, -half, 0.28), (i) => at(i, -half, -0.1), '#d9c49a')
  ribbon(0, townEndIndex, 2, (i) => at(i, half, 0.28), (i) => at(i, half, -0.1), '#d9c49a')
  const outStart = townEndIndex - 4
  ribbon(outStart, track.count - 1, 2, (i) => at(i, -half, 0), (i) => at(i, -half, -1.6), '#f1e3c4')
  ribbon(outStart, track.count - 1, 2, (i) => at(i, half, 0), (i) => at(i, half, -1.6), '#f1e3c4')
  ribbon(outStart, track.count - 1, 2, (i) => at(i, -half, -1.6), (i) => at(i, half, -1.6), '#cfc6e6')
  ribbon(outStart, track.count - 1, 2, (i) => at(i, -half - 0.6, 0.55), (i) => at(i, -half, 0.55), '#e8743b')
  ribbon(outStart, track.count - 1, 2, (i) => at(i, half, 0.55), (i) => at(i, half + 0.6, 0.55), '#e8743b')
  ribbon(outStart, track.count - 1, 2, (i) => at(i, -half - 0.6, 0.55), (i) => at(i, -half - 0.6, -1.6), '#e8743b')
  ribbon(outStart, track.count - 1, 2, (i) => at(i, half + 0.6, 0.55), (i) => at(i, half + 0.6, -1.6), '#e8743b')

  // --- 小镇岛与水面 ---
  {
    const top = new THREE.PlaneGeometry(200, 450, 40, 90)
    top.rotateX(-Math.PI / 2)
    top.translate(0, -0.2, -130)
    props.add(top, null, '#eadfbf')
    const cliff = new THREE.BoxGeometry(200, 3.4, 450, 20, 1, 45)
    cliff.translate(0, -1.95, -130)
    props.add(cliff, null, ['#d8c49a', '#bfa57a'])
    for (let k = 0; k < 26; k++) {
      const lawn = new THREE.BoxGeometry(14 + rand() * 20, 0.3, 14 + rand() * 30)
      const side = rand() > 0.5 ? 1 : -1
      lawn.translate(side * (34 + rand() * 50), -0.1, 70 - rand() * 400)
      props.add(lawn, null, rand() > 0.5 ? '#bfe08a' : '#a9d67a')
    }
    const water = new THREE.PlaneGeometry(6400, 6400, lowPower ? 90 : 160, lowPower ? 90 : 160)
    water.rotateX(-Math.PI / 2)
    const sea = new THREE.Mesh(water, waterMat)
    sea.position.set(-40, -3, -600)
    sea.frustumCulled = false
    scene.add(sea)
    disposables.push(water)
  }

  // --- 房子与高楼 ---
  const addHouse = (i: number, side: number, width: number, depth: number, height: number, tower: boolean) => {
    const lateral = side * (half + SIDEWALK + 1 + depth / 2)
    const base = at(i, lateral, -0.2)
    const m = frameMatrix(i, base)
    const wall = tower ? TOWERS[Math.floor(rand() * TOWERS.length)] : WALLS[Math.floor(rand() * WALLS.length)]
    const body = new THREE.BoxGeometry(width, height, depth)
    body.translate(0, height / 2, 0)
    props.add(body, m, wall)

    if (tower) {
      const cap = new THREE.BoxGeometry(width + 0.6, 0.8, depth + 0.6)
      cap.translate(0, height + 0.4, 0)
      props.add(cap, m, '#f7f1e3')
      if (rand() > 0.4) {
        const hut = new THREE.BoxGeometry(width * 0.35, 2.4, depth * 0.35)
        hut.translate((rand() - 0.5) * width * 0.4, height + 2, (rand() - 0.5) * depth * 0.3)
        props.add(hut, m, '#e6ddd0')
      }
    } else {
      const roof = roofPrism(width, depth, 2.2 + rand() * 2.6)
      roof.translate(0, height, 0)
      props.add(roof, m, ROOFS[Math.floor(rand() * ROOFS.length)])
      if (rand() > 0.6) {
        const chimney = new THREE.BoxGeometry(0.9, 2.4, 0.9)
        chimney.translate(width * 0.25, height + 2.2, depth * 0.15)
        props.add(chimney, m, '#b5694a')
      }
    }

    const face = -side * (depth / 2 + 0.07)
    const shutter = SHUTTERS[Math.floor(rand() * SHUTTERS.length)]
    const cols = Math.max(1, Math.floor((width - 1.6) / 2.5))
    const floorStep = tower ? 3 : 3.3
    let floor = 0
    for (let y = 2.4; y < height - 1.4; y += floorStep, floor++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * 2.5
        if (!tower && floor === 0 && c === Math.floor(cols / 2)) {
          const door = new THREE.BoxGeometry(1.4, 2.3, 0.14)
          door.translate(x, 1.15, face)
          props.add(door, m, '#7c4f36')
          continue
        }
        const win = new THREE.BoxGeometry(1.0, 1.4, 0.12)
        win.translate(x, y, face)
        windows.add(win, m, '#ffffff')
        if (!tower) {
          const shL = new THREE.BoxGeometry(0.34, 1.4, 0.1)
          shL.translate(x - 0.72, y, face)
          props.add(shL, m, shutter)
          const shR = new THREE.BoxGeometry(0.34, 1.4, 0.1)
          shR.translate(x + 0.72, y, face)
          props.add(shR, m, shutter)
        }
      }
      if (!tower && floor > 0 && rand() > 0.55) {
        const balcony = new THREE.BoxGeometry(width * 0.5, 0.22, 1)
        balcony.translate(0, y - 0.9, face - side * 0.5)
        props.add(balcony, m, '#f7f1e3')
        const rail = new THREE.BoxGeometry(width * 0.5, 0.7, 0.08)
        rail.translate(0, y - 0.45, face - side * 1)
        props.add(rail, m, '#2a2733')
      }
    }
    if (!tower && rand() > 0.5) {
      const awning = new THREE.BoxGeometry(width * 0.7, 0.18, 1.6)
      awning.rotateX(side * 0.25)
      awning.translate(0, 3, face - side * 0.8)
      props.add(awning, m, rand() > 0.5 ? '#2f8fb5' : '#df48b2')
    }
  }

  const addTree = (position: THREE.Vector3, kind: number, scale = 1) => {
    const m = new THREE.Matrix4().makeScale(scale, scale, scale).setPosition(position)
    const trunk = new THREE.BoxGeometry(0.42, 3.4, 0.42)
    trunk.translate(0, 1.7, 0)
    props.add(trunk, m, '#8a5a3c')
    if (kind === 0) {
      const crown = lumpy(new THREE.IcosahedronGeometry(2.4, 1), 0.3, rand() * 10)
      crown.scale(1, 1.1, 1)
      crown.translate(0, 4.6, 0)
      props.add(crown, m, [GREENS[Math.floor(rand() * GREENS.length)], '#4f9a36'])
    } else if (kind === 1) {
      const crown = lumpy(new THREE.IcosahedronGeometry(1.35, 1), 0.2, rand() * 10)
      crown.scale(1, 3.3, 1)
      crown.translate(0, 5.6, 0)
      props.add(crown, m, ['#6fbf4a', '#2f8a4a'])
    } else {
      const crown = lumpy(new THREE.IcosahedronGeometry(2.5, 1), 0.34, rand() * 10)
      crown.translate(0, 4.8, 0)
      props.add(crown, m, ['#f7b733', '#df48b2'])
    }
    if (rand() > 0.5) {
      const bush = lumpy(new THREE.IcosahedronGeometry(1.1, 1), 0.3, rand() * 10)
      bush.translate(1.4, 0.7, 0.6)
      props.add(bush, m, ['#d4ec63', '#9ccc3c'])
    }
  }

  {
    const townStart = 0
    const townEnd = markS.bridge - 6
    for (const side of [-1, 1]) {
      let s = townStart + rand() * 6
      while (s < townEnd) {
        const inPrompt = s > markS.prompt - 10
        const tower = inPrompt && rand() > 0.35
        const width = tower ? 9 + rand() * 6 : 7 + rand() * 5
        s += width / 2
        const i = track.indexAt(s)
        if (nearBoard(s, side, 9 + width / 2)) {
          // 给广告牌留出空地
        } else if (rand() > 0.14) {
          const height = tower ? 22 + rand() * 30 : 6.5 + rand() * 6
          addHouse(i, side, width, tower ? 10 + rand() * 4 : 7 + rand() * 3, height, tower)
        } else {
          addTree(at(i, side * (half + SIDEWALK + 5), -0.2), Math.floor(rand() * 3), 1.1)
        }
        s += width / 2 + 0.8 + rand() * 2.2
        if (lowPower) s += 4
      }
      for (let t = townStart + 8; t < townEnd; t += 15 + rand() * 10) {
        if (nearBoard(t, side, 7)) continue
        const i = track.indexAt(t)
        addTree(at(i, side * (half + SIDEWALK - 0.9), 0.28), rand() > 0.72 ? 2 : rand() > 0.5 ? 1 : 0, 0.8)
      }
      for (let k = 0; k < (lowPower ? 20 : 45); k++) {
        const i = track.indexAt(rand() * townEnd)
        addTree(at(i, side * (half + SIDEWALK + 18 + rand() * 40), -0.2), Math.floor(rand() * 3), 0.9 + rand() * 0.6)
      }
    }
  }

  // --- 路灯与桥墩 ---
  {
    let side = 1
    for (let s = 14; s < markS.end; s += 34) {
      const i = track.indexAt(s)
      const inTown = i < townEndIndex
      const lateral = side * (inTown ? half + 1.1 : half + 0.3)
      const base = at(i, lateral, inTown ? 0.28 : 0.55)
      const m = frameMatrix(i, base)
      const post = new THREE.BoxGeometry(0.24, 5.8, 0.24)
      post.translate(0, 2.9, 0)
      props.add(post, m, '#26242e')
      const arm = new THREE.BoxGeometry(0.16, 0.16, 1.5)
      arm.translate(0, 5.7, -side * 0.7)
      props.add(arm, m, '#26242e')
      const head = new THREE.BoxGeometry(0.62, 0.5, 0.62)
      head.translate(0, 5.5, -side * 1.35)
      props.add(head, m, '#26242e')
      const bulb = new THREE.IcosahedronGeometry(0.3, 0)
      bulb.translate(0, 5.1, -side * 1.35)
      bulbs.add(bulb, m, '#ffffff')
      const glow = new THREE.Vector3(0, 5, -side * 1.35).applyMatrix4(m)
      haloPositions.push(glow.x, glow.y, glow.z)
      side *= -1
    }
    for (let s = markS.bridge + 16; s < markS.fold + 70; s += 22) {
      const i = track.indexAt(s)
      if (track.U[i].y < 0.97 || track.P[i].y < 2.5) continue
      const top = track.P[i].y - 1.6
      const pillar = new THREE.CylinderGeometry(0.9, 1.2, top + 3, 8)
      pillar.translate(track.P[i].x, (top - 3) / 2, track.P[i].z)
      props.add(pillar, null, ['#f3ead7', '#cdbfa2'])
    }
  }

  // --- 远处地标、小岛、浮空岛、云 ---
  const addIslandTown = (center: THREE.Vector3, radius: number, floating: boolean, houses: number) => {
    if (floating) {
      const rock = lumpy(new THREE.ConeGeometry(radius, radius * 1.3, 8, 3), 0.18, rand() * 10)
      rock.rotateX(Math.PI)
      rock.translate(center.x, center.y - radius * 0.65 - 0.6, center.z)
      props.add(rock, null, ['#cbb9ea', '#8f79c2'])
    }
    const top = new THREE.CylinderGeometry(radius, radius * 0.96, 1.2, 10)
    top.translate(center.x, center.y - 0.6, center.z)
    props.add(top, null, floating ? '#a9d86b' : '#e7d8b0')
    for (let k = 0; k < houses; k++) {
      const a = rand() * Math.PI * 2
      const r = rand() * radius * 0.7
      const w = 3 + rand() * 3
      const h = 3 + rand() * 5
      const m = new THREE.Matrix4().makeRotationY(rand() * Math.PI).setPosition(center.x + Math.cos(a) * r, center.y, center.z + Math.sin(a) * r)
      const body = new THREE.BoxGeometry(w, h, w * 0.9)
      body.translate(0, h / 2, 0)
      props.add(body, m, WALLS[Math.floor(rand() * WALLS.length)])
      const roof = roofPrism(w, w * 0.9, 1.6 + rand())
      roof.translate(0, h, 0)
      props.add(roof, m, ROOFS[Math.floor(rand() * ROOFS.length)])
    }
    for (let k = 0; k < Math.ceil(houses / 2); k++) {
      const a = rand() * Math.PI * 2
      const r = radius * (0.55 + rand() * 0.35)
      addTree(new THREE.Vector3(center.x + Math.cos(a) * r, center.y, center.z + Math.sin(a) * r), Math.floor(rand() * 3), 0.7)
    }
  }

  const addTower = (x: number, z: number, h: number, color: string) => {
    const pad = new THREE.CylinderGeometry(22, 24, 4, 10)
    pad.translate(x, -2.5, z)
    props.add(pad, null, '#e7d8b0')
    const body = new THREE.BoxGeometry(22, h, 20)
    body.translate(x, h / 2, z)
    props.add(body, null, color)
    for (let y = 6; y < h - 4; y += 6) {
      for (let c = -2; c <= 2; c++) {
        const win = new THREE.BoxGeometry(2.2, 3, 0.3)
        win.translate(x + c * 4, y, z + 10.1)
        windows.add(win, null, '#ffffff')
      }
      if (y % 12 === 0) {
        const planter = new THREE.BoxGeometry(3, 1.6, 2.4)
        planter.translate(x + (rand() - 0.5) * 16, y - 2, z + 11)
        props.add(planter, null, rand() > 0.5 ? '#e2703a' : '#7cc242')
      }
    }
  }
  addTower(125, -760, 118, '#efc75e')
  addTower(-205, -760, 96, '#eab3b0')
  addTower(96, -930, 140, '#f3ead7')
  addTower(-150, -420, 70, '#b9c7ea')

  for (const [x, z, r] of [[130, -520, 40], [-170, -560, 34], [150, -800, 50], [-260, -900, 60], [40, -1100, 70]] as const) {
    addIslandTown(new THREE.Vector3(x, -2.4, z), r, false, lowPower ? 6 : 14)
  }

  const endIndex = track.count - 1
  const endDir = track.T[endIndex].clone().setY(0).normalize()
  const destination = track.P[endIndex].clone().addScaledVector(endDir, 18)
  destination.y = track.P[endIndex].y - 0.3
  addIslandTown(destination, 30, true, 6)
  for (const [x, y, z, r] of [[-170, 78, -600, 18], [52, 96, -770, 22], [-70, 170, -880, 26], [-205, 128, -790, 16], [30, 58, -520, 12], [-120, 40, -470, 10]] as const) {
    addIslandTown(new THREE.Vector3(x, y, z), r, true, Math.round(r / 5))
  }

  for (let k = 0; k < (lowPower ? 18 : 40); k++) {
    const cx = -320 + rand() * 520
    const cz = -80 - rand() * 1000
    const cy = 36 + rand() * 150
    if (Math.hypot(cx + 64, cz + 680) < 80 && cy < 150) continue
    for (let p = 0; p < 5; p++) {
      const puff = lumpy(new THREE.IcosahedronGeometry(5 + rand() * 7, 1), 0.25, rand() * 10)
      puff.scale(1.4, 0.62, 1)
      puff.translate(cx + (rand() - 0.5) * 22, cy + rand() * 4, cz + (rand() - 0.5) * 14)
      props.add(puff, null, ['#ffffff', '#e4e2f4'])
    }
  }

  const propsMesh = new THREE.Mesh(props.build(), propsMat)
  const windowMesh = new THREE.Mesh(windows.build(), windowMat)
  const bulbMesh = new THREE.Mesh(bulbs.build(), bulbMat)
  for (const mesh of [propsMesh, windowMesh, bulbMesh]) {
    mesh.frustumCulled = false
    scene.add(mesh)
    disposables.push(mesh.geometry)
  }

  const haloGeo = new THREE.BufferGeometry()
  haloGeo.setAttribute('position', new THREE.Float32BufferAttribute(haloPositions, 3))
  const haloTex = haloTexture()
  const haloMat = new THREE.ShaderMaterial({
    uniforms: { ...bend, uMap: { value: haloTex }, uColor: { value: new THREE.Color('#ff5fcf') }, uOpacity: { value: 0 }, uScale: { value: 900 } },
    vertexShader: HALO_VERTEX,
    fragmentShader: HALO_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const halos = new THREE.Points(haloGeo, haloMat)
  halos.layers.set(1)
  halos.frustumCulled = false
  scene.add(halos)
  disposables.push(haloGeo, haloTex, haloMat)

  // --- 天空 ---
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      uTop: { value: new THREE.Color() },
      uBottom: { value: new THREE.Color() },
      uCloud: { value: new THREE.Color() },
      uSun: { value: new THREE.Color() },
      uSunDir: { value: new THREE.Vector3(0.5, 0.6, 0.3) },
      uTime: { value: 0 },
    },
    vertexShader: SKY_VERTEX,
    fragmentShader: SKY_FRAGMENT,
    side: THREE.BackSide,
    depthWrite: false,
  })
  const skyGeo = new THREE.SphereGeometry(2800, 32, 16)
  const sky = new THREE.Mesh(skyGeo, skyMat)
  sky.layers.set(1)
  sky.frustumCulled = false
  sky.renderOrder = -1
  scene.add(sky)
  disposables.push(skyGeo, skyMat)

  const hemi = new THREE.HemisphereLight('#e8f2ff', '#efe3c9', 1.3)
  const sun = new THREE.DirectionalLight('#fff3dd', 1.4)
  scene.add(hemi, sun)
  scene.fog = new THREE.Fog('#eef4f7', 180, 1250)

  // --- 小车 ---
  const car = new THREE.Group()
  const wheels: THREE.Mesh[] = []
  {
    const bag = new GeoBag()
    const part = (w: number, h: number, d: number, x: number, y: number, z: number, color: string) => {
      const g = new THREE.BoxGeometry(w, h, d)
      g.translate(x, y, z)
      bag.add(g, null, color)
    }
    part(2.3, 0.8, 3.6, 0, 0.95, 0, '#f4f1ea')
    part(2.2, 0.35, 1.3, 0, 1.5, -1.1, '#f4f1ea')
    part(2.4, 0.3, 0.3, 0, 0.7, -1.9, '#2a2733')
    part(2.4, 0.3, 0.3, 0, 0.7, 1.9, '#2a2733')
    part(0.14, 1.3, 0.14, -1.05, 2.0, 0.9, '#d8402f')
    part(0.14, 1.3, 0.14, 1.05, 2.0, 0.9, '#d8402f')
    part(2.3, 0.16, 0.16, 0, 2.65, 0.9, '#d8402f')
    part(2.6, 0.16, 0.5, 0, 2.7, 1.3, '#d8402f')
    part(2.0, 0.7, 0.08, 0, 1.95, -0.45, '#9fc7e8')
    part(0.7, 0.9, 0.7, -0.5, 1.9, 0.25, '#2e4fa3')
    part(0.55, 0.55, 0.55, -0.5, 2.6, 0.2, '#f1c27d')
    part(0.6, 0.18, 0.6, -0.5, 2.92, 0.2, '#2a2733')
    part(0.5, 0.18, 0.1, -0.75, 1.0, -1.82, '#ffe27a')
    part(0.5, 0.18, 0.1, 0.75, 1.0, -1.82, '#ffe27a')
    part(0.4, 0.2, 0.1, -0.85, 1.05, 1.82, '#e04848')
    part(0.4, 0.2, 0.1, 0.85, 1.05, 1.82, '#e04848')
    const board = new THREE.CylinderGeometry(0.28, 0.28, 2.4, 8)
    board.rotateZ(Math.PI / 2)
    board.translate(0.3, 1.75, 1.35)
    bag.add(board, null, '#f2c230')
    const spare = new THREE.CylinderGeometry(0.55, 0.55, 0.35, 12)
    spare.rotateX(Math.PI / 2)
    spare.translate(0, 1.2, 2.0)
    bag.add(spare, null, '#2a2733')
    const body = new THREE.Mesh(bag.build(), propsMat)
    car.add(body)
    disposables.push(body.geometry)
    const wheelBag = new GeoBag()
    const tire = new THREE.CylinderGeometry(0.58, 0.58, 0.48, 12)
    tire.rotateZ(Math.PI / 2)
    wheelBag.add(tire, null, '#2a2733')
    const hub = new THREE.CylinderGeometry(0.26, 0.26, 0.5, 6)
    hub.rotateZ(Math.PI / 2)
    wheelBag.add(hub, null, '#b8b4c8')
    const wheelGeo = wheelBag.build()
    disposables.push(wheelGeo)
    for (const [x, z] of [[-1.15, -1.2], [1.15, -1.2], [-1.15, 1.25], [1.15, 1.25]] as const) {
      const wheel = new THREE.Mesh(wheelGeo, propsMat)
      wheel.position.set(x, 0.58, z)
      wheels.push(wheel)
      car.add(wheel)
    }
    car.scale.setScalar(1.05)
    scene.add(car)
  }

  // --- 路上漂浮的符号（收集后计数） ---
  type Glyph = { sprite: THREE.Sprite; s: number; base: THREE.Vector3; up: THREE.Vector3; phase: number; collected: number }
  const glyphs: Glyph[] = []
  {
    const textures = GLYPHS.map(([text, color]) => glyphTexture(text, color))
    disposables.push(...textures)
    let k = 0
    for (let s = markS.start + 34; s < markS.end - 30; s += 26 + rand() * 8) {
      const i = track.indexAt(s)
      const material = new THREE.SpriteMaterial({ map: textures[k % textures.length], transparent: true, depthWrite: false })
      disposables.push(material)
      const sprite = new THREE.Sprite(material)
      const base = at(i, (rand() - 0.5) * 6, 2.6)
      sprite.position.copy(base)
      sprite.scale.setScalar(2.3)
      sprite.layers.set(1)
      scene.add(sprite)
      glyphs.push({ sprite, s, base, up: track.U[i].clone(), phase: rand() * 6, collected: -1 })
      k++
    }
  }
  let tokenCount = 0

  // --- 路边广告牌：点击进入项目详情 ---
  type Board = { slug: string; s: number; group: THREE.Group; face: THREE.Mesh }
  const boards: Board[] = []
  const boardCanvases: Array<{ canvas: HTMLCanvasElement; texture: THREE.CanvasTexture; spec: InkRoadBillboardSpec; index: number }> = []
  boardPlacements.forEach(({ spec, s }, index) => {
    const i = track.indexAt(s)
    const inTown = i < townEndIndex
    const side = spec.side
    const angle = 0.9
    const up = track.U[i].clone()
    const normal = track.T[i].clone().multiplyScalar(-Math.cos(angle)).addScaledVector(track.S[i], -side * Math.sin(angle)).normalize()
    const xAxis = new THREE.Vector3().crossVectors(up, normal).normalize()
    const W = 10
    const H = (W * 600) / 1024
    const bottom = inTown ? 3.4 : 2.8
    const base = at(i, side * (inTown ? half + SIDEWALK + 2 : half + 4.4), inTown ? 0.28 : 0)
    const group = new THREE.Group()
    group.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAxis, up, normal))
    group.position.copy(base).addScaledVector(up, bottom + H / 2)

    const postLen = bottom + (inTown ? 0.3 : up.y > 0.9 ? track.P[i].y + 3 : 0.4)
    const bag = new GeoBag()
    const box = (w: number, h: number, d: number, x: number, y: number, z: number, color: string) => {
      const g = new THREE.BoxGeometry(w, h, d)
      g.translate(x, y, z)
      bag.add(g, null, color)
    }
    box(W + 0.7, H + 0.7, 0.4, 0, 0, -0.25, '#2a2733')
    for (const px of [-W * 0.3, W * 0.3]) box(0.45, postLen, 0.45, px, -H / 2 - postLen / 2, -0.35, '#3a3645')
    box(W * 0.62, 0.3, 0.3, 0, -H / 2 - 1.1, -0.35, '#3a3645')
    box(W * 0.6, 0.26, 0.8, 0, H / 2 + 0.55, 0.3, '#26242e')
    const frameGeo = bag.build()
    const frame = new THREE.Mesh(frameGeo, propsMat)

    const canvas2d = document.createElement('canvas')
    canvas2d.width = 1024
    canvas2d.height = 600
    drawBillboard(canvas2d, spec, index)
    const texture = new THREE.CanvasTexture(canvas2d)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    const faceMat = withBend(new THREE.MeshBasicMaterial({ map: texture }))
    const faceGeo = new THREE.PlaneGeometry(W, H)
    const face = new THREE.Mesh(faceGeo, faceMat)
    face.position.z = 0.02
    for (const mesh of [frame, face]) mesh.frustumCulled = false
    group.add(frame, face)
    scene.add(group)
    disposables.push(frameGeo, faceGeo, texture)
    boards.push({ slug: spec.slug, s, group, face })
    boardCanvases.push({ canvas: canvas2d, texture, spec, index })
  })
  let fontsDisposed = false
  document.fonts?.ready.then(() =>
    Promise.all([document.fonts.load('500 132px "Inter"')]).catch(() => []),
  ).then(() => {
    if (fontsDisposed) return
    boardCanvases.forEach(({ canvas: c, texture, spec, index }) => {
      drawBillboard(c, spec, index)
      texture.needsUpdate = true
    })
  })

  const raycaster = new THREE.Raycaster()
  const pointerNdc = new THREE.Vector2()
  let hoveredBoard = -1
  const pickBoard = (event: PointerEvent | MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    pointerNdc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(pointerNdc, camera)
    const hit = raycaster.intersectObjects(boards.map((board) => board.face), false)[0]
    if (!hit || hit.distance > 240) return -1
    return boards.findIndex((board) => board.face === hit.object)
  }
  const onCanvasMove = (event: PointerEvent) => {
    hoveredBoard = pickBoard(event)
    canvas.style.cursor = hoveredBoard >= 0 ? 'pointer' : ''
  }
  const onCanvasClick = (event: MouseEvent) => {
    const index = pickBoard(event)
    if (index >= 0) options.onBillboard?.(boards[index].slug)
  }
  canvas.addEventListener('pointermove', onCanvasMove)
  canvas.addEventListener('click', onCanvasClick)

  // --- 渲染目标与合成 ---
  const colorRT = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType })
  colorRT.depthTexture = new THREE.DepthTexture(1, 1)
  colorRT.depthTexture.type = THREE.UnsignedIntType
  const normalRT = new THREE.WebGLRenderTarget(1, 1)
  disposables.push(colorRT, normalRT)

  const compositeMat = new THREE.ShaderMaterial({
    uniforms: {
      tColor: { value: colorRT.texture },
      tNormal: { value: normalRT.texture },
      tDepth: { value: colorRT.depthTexture },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uNear: { value: camera.near },
      uFar: { value: camera.far },
      uDpr: { value: dpr },
      uBorder: { value: 22 },
      uFrame: { value: 0 },
      uPaper: { value: new THREE.Color(PAPER) },
      uInk: { value: new THREE.Color(INK) },
    },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: COMPOSITE_FRAGMENT,
    depthTest: false,
    depthWrite: false,
  })
  const quadGeo = new THREE.PlaneGeometry(2, 2)
  const quad = new THREE.Mesh(quadGeo, compositeMat)
  quad.frustumCulled = false
  const quadScene = new THREE.Scene()
  quadScene.add(quad)
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  disposables.push(quadGeo, compositeMat)

  // --- 时间段过渡 ---
  const live = {
    top: new THREE.Color(),
    bottom: new THREE.Color(),
    cloud: new THREE.Color(),
    sun: new THREE.Color(),
    hemiSky: new THREE.Color(),
    hemiGround: new THREE.Color(),
    water: new THREE.Color(),
    windows: new THREE.Color(),
    bulb: new THREE.Color(),
    sunDir: new THREE.Vector3(),
    sunI: 1,
    hemiI: 1,
    halo: 0,
  }
  let target = TIME_PRESETS.morning
  const targetColors = () => ({
    top: new THREE.Color(target.top),
    bottom: new THREE.Color(target.bottom),
    cloud: new THREE.Color(target.cloud),
    sun: new THREE.Color(target.sun),
    hemiSky: new THREE.Color(target.hemiSky),
    hemiGround: new THREE.Color(target.hemiGround),
    water: new THREE.Color(target.water),
    windows: new THREE.Color(target.windows),
    bulb: new THREE.Color(target.bulb),
  })
  let targetC = targetColors()
  const applyTime = (k: number) => {
    for (const key of Object.keys(targetC) as Array<keyof typeof targetC>) live[key].lerp(targetC[key], k)
    live.sunDir.lerp(new THREE.Vector3(...target.sunDir).normalize(), k)
    live.sunI += (target.sunI - live.sunI) * k
    live.hemiI += (target.hemiI - live.hemiI) * k
    live.halo += (target.halo - live.halo) * k
    skyMat.uniforms.uTop.value.copy(live.top)
    skyMat.uniforms.uBottom.value.copy(live.bottom)
    skyMat.uniforms.uCloud.value.copy(live.cloud)
    skyMat.uniforms.uSun.value.copy(live.sun)
    skyMat.uniforms.uSunDir.value.copy(live.sunDir)
    sun.color.copy(live.sun)
    sun.intensity = live.sunI
    sun.position.copy(live.sunDir).multiplyScalar(100)
    hemi.color.copy(live.hemiSky)
    hemi.groundColor.copy(live.hemiGround)
    hemi.intensity = live.hemiI
    waterMat.color.copy(live.water)
    windowMat.color.copy(live.windows)
    bulbMat.color.copy(live.bulb)
    haloMat.uniforms.uColor.value.copy(live.bulb)
    haloMat.uniforms.uOpacity.value = live.halo
    halos.visible = live.halo > 0.01
    ;(scene.fog as THREE.Fog).color.copy(live.bottom)
  }
  applyTime(1)

  const sampleFrame = (s: number) => {
    const f = Math.min(Math.max((s / track.length) * (track.count - 1), 0), track.count - 1.001)
    const i = Math.floor(f)
    const t = f - i
    return {
      p: track.P[i].clone().lerp(track.P[i + 1], t),
      tan: track.T[i].clone().lerp(track.T[i + 1], t).normalize(),
      up: track.U[i].clone().lerp(track.U[i + 1], t).normalize(),
      side: track.S[i].clone().lerp(track.S[i + 1], t).normalize(),
    }
  }

  const state = {
    targetP: 0,
    p: 0,
    carS: markS.start,
    speed: 0,
    mode: 'chase' as InkRoadCameraMode,
    topBlend: 0,
    pointer: new THREE.Vector2(),
    pointerTarget: new THREE.Vector2(),
    camPos: new THREE.Vector3(),
    camLook: new THREE.Vector3(),
    camUp: new THREE.Vector3(0, 1, 0),
    active: false,
    raf: 0,
    last: performance.now(),
    elapsed: 0,
    primed: false,
  }

  const revealLook = new THREE.Vector3(-60, 36, -560)
  const revealPos = new THREE.Vector3(250, 165, -360)

  const bendForProgress = (p: number) => {
    const settle = 1 - smooth(DRIVE_END - 0.02, 1, p)
    const fold = smooth(chapterStarts[4], chapterStarts[4] + 0.08, p) * settle
    return 0.00032 * settle + 0.00012 + fold * 0.0036
  }

  const update = (dt: number) => {
    state.elapsed += dt
    const k = 1 - Math.exp(-dt * 3.2)
    state.p += (state.targetP - state.p) * k
    const prevS = state.carS
    state.carS = progressToS(state.p)
    const rawSpeed = Math.abs(state.carS - prevS) / Math.max(dt, 1e-3)
    state.speed += (rawSpeed - state.speed) * (1 - Math.exp(-dt * 4))
    state.topBlend += ((state.mode === 'top' ? 1 : 0) - state.topBlend) * (1 - Math.exp(-dt * 2.5))
    state.pointer.lerp(state.pointerTarget, 1 - Math.exp(-dt * 3))

    const f = sampleFrame(state.carS)
    const bounce = Math.sin(state.elapsed * 16) * Math.min(state.speed / 60, 1) * 0.05
    car.position.copy(f.p).addScaledVector(f.up, bounce)
    car.matrix.makeBasis(f.side, f.up, f.tan.clone().negate())
    car.quaternion.setFromRotationMatrix(car.matrix)
    car.rotateZ(Math.sin(state.elapsed * 1.7) * 0.012)
    wheels.forEach((wheel) => {
      wheel.rotation.x -= (state.speed * dt) / 0.6
    })

    const back = THREE.MathUtils.lerp(14.5, 9, state.topBlend)
    const height = THREE.MathUtils.lerp(5.4, 30, state.topBlend)
    const chasePos = f.p.clone().addScaledVector(f.tan, -back).addScaledVector(f.up, height)
      .addScaledVector(f.side, state.pointer.x * 1.6)
      .addScaledVector(f.up, state.pointer.y * 0.8)
    const chaseLook = f.p.clone().addScaledVector(f.tan, THREE.MathUtils.lerp(12, 6, state.topBlend)).addScaledVector(f.up, 2.2)
    const reveal = smooth(DRIVE_END - 0.02, 1, state.targetP)
    const desiredPos = chasePos.lerp(revealPos, reveal)
    const desiredLook = chaseLook.lerp(revealLook, reveal)
    const desiredUp = f.up.clone().lerp(new THREE.Vector3(0, 1, 0), reveal).normalize()

    if (!state.primed) {
      state.camPos.copy(desiredPos)
      state.camLook.copy(desiredLook)
      state.camUp.copy(desiredUp)
      state.primed = true
    } else {
      const ck = 1 - Math.exp(-dt * 5)
      state.camPos.lerp(desiredPos, ck)
      state.camLook.lerp(desiredLook, ck)
      state.camUp.lerp(desiredUp, 1 - Math.exp(-dt * 4)).normalize()
    }
    camera.position.copy(state.camPos)
    camera.up.copy(state.camUp)
    camera.lookAt(state.camLook)
    camera.updateMatrixWorld()
    sky.position.copy(camera.position)

    bend.uBend.value = bendForProgress(state.p)
    bend.uBendOrigin.value.copy(camera.position)
    camera.getWorldDirection(bend.uBendDir.value)
    bend.uBendUp.value.copy(camera.up)

    for (const glyph of glyphs) {
      if (glyph.collected < 0 && state.carS > glyph.s) {
        glyph.collected = 0
        tokenCount++
        options.onToken?.(tokenCount, glyphs.length)
      }
      if (glyph.collected >= 0) {
        glyph.collected += dt
        const t = Math.min(glyph.collected / 0.55, 1)
        glyph.sprite.visible = t < 1
        glyph.sprite.scale.setScalar(2.3 + t * 2.4)
        glyph.sprite.position.copy(glyph.base).addScaledVector(glyph.up, t * 3.5)
        ;(glyph.sprite.material as THREE.SpriteMaterial).opacity = 1 - t
      } else {
        glyph.sprite.position.copy(glyph.base).addScaledVector(glyph.up, Math.sin(state.elapsed * 2 + glyph.phase) * 0.35)
        ;(glyph.sprite.material as THREE.SpriteMaterial).rotation = Math.sin(state.elapsed + glyph.phase) * 0.18
      }
    }

    applyTime(1 - Math.exp(-dt * 2.2))
    skyMat.uniforms.uTime.value = state.elapsed
    compositeMat.uniforms.uTime.value = state.elapsed
    compositeMat.uniforms.uFrame.value = smooth(DRIVE_END + 0.01, 1, state.targetP)

    boards.forEach((board, index) => {
      const scale = board.group.scale.x + ((index === hoveredBoard ? 1.06 : 1) - board.group.scale.x) * (1 - Math.exp(-dt * 10))
      board.group.scale.setScalar(scale)
    })
    const billboard = boards.findIndex((board) => board.s - state.carS > -6 && board.s - state.carS < 95)

    const heading = Math.atan2(f.tan.x, -f.tan.z)
    options.onFrame?.({ speed: state.speed * 3.2, heading, progress: state.p, billboard })
  }

  const render = () => {
    renderer.setRenderTarget(normalRT)
    renderer.setClearColor(0x7f7fff, 1)
    camera.layers.set(0)
    scene.overrideMaterial = normalMat
    renderer.render(scene, camera)
    scene.overrideMaterial = null
    camera.layers.enableAll()

    renderer.setRenderTarget(colorRT)
    renderer.setClearColor((scene.fog as THREE.Fog).color, 1)
    renderer.render(scene, camera)

    renderer.setRenderTarget(null)
    renderer.setClearColor(0x000000, 0)
    renderer.render(quadScene, quadCam)
  }

  const loop = () => {
    if (!state.active) return
    const now = performance.now()
    const dt = Math.min((now - state.last) / 1000, 0.25)
    state.last = now
    update(dt)
    render()
    state.raf = requestAnimationFrame(loop)
  }

  const resize = () => {
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight
    dpr = Math.min(window.devicePixelRatio || 1, dprCap)
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    const w = Math.round(width * dpr)
    const h = Math.round(height * dpr)
    colorRT.setSize(w, h)
    normalRT.setSize(w, h)
    compositeMat.uniforms.uRes.value.set(w, h)
    compositeMat.uniforms.uDpr.value = dpr
    compositeMat.uniforms.uBorder.value = (width < 700 ? 14 : 30) * dpr
    camera.aspect = width / Math.max(height, 1)
    camera.fov = width < 700 ? 70 : 58
    camera.updateProjectionMatrix()
    if (!state.active) {
      update(0.016)
      render()
    }
  }

  resize()

  return {
    setProgress: (progress) => {
      state.targetP = Math.min(Math.max(progress, 0), 1)
    },
    setTime: (time, instant) => {
      target = TIME_PRESETS[time]
      targetC = targetColors()
      if (instant) applyTime(1)
    },
    setCameraMode: (mode) => {
      state.mode = mode
    },
    setPointer: (x, y) => {
      state.pointerTarget.set(x, y)
    },
    setActive: (active) => {
      if (active === state.active) return
      state.active = active
      if (active) {
        state.last = performance.now()
        state.raf = requestAnimationFrame(loop)
      } else {
        cancelAnimationFrame(state.raf)
      }
    },
    snap: () => {
      state.p = state.targetP
      state.primed = false
      update(0.016)
      render()
    },
    resize,
    dispose: () => {
      state.active = false
      cancelAnimationFrame(state.raf)
      fontsDisposed = true
      canvas.removeEventListener('pointermove', onCanvasMove)
      canvas.removeEventListener('click', onCanvasClick)
      disposables.forEach((item) => item.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    },
  }
}
