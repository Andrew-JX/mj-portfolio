import * as THREE from 'three'
import gsap from 'gsap'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// 页脚落款：一方墨玉印章在撕边宣纸上盖下“吉敏宇印”（朱文），
// 印泥的斑驳与纸纹由着色器生成，每次盖印位置和角度略有不同。

export type SealScene = {
  stamp: () => void
  dispose: () => void
}

const NOISE = /* glsl */ `
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

const PLANE_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const PAPER_FRAGMENT = /* glsl */ `
uniform vec2 uSize;
varying vec2 vUv;
${NOISE}
void main() {
  vec2 d = min(vUv, 1.0 - vUv) * uSize;
  float edge = min(d.x, d.y);
  float rag = fbm(vUv * vec2(26.0, 20.0)) * 0.16 + fbm(vUv * 140.0) * 0.03;
  float alpha = smoothstep(0.02, 0.05, edge - rag);
  float fiber = fbm(vUv * vec2(160.0, 40.0)) * 0.5 + fbm(vUv * 60.0) * 0.5;
  vec3 paper = vec3(0.949, 0.929, 0.882) * (0.94 + 0.08 * fiber);
  paper *= 1.0 - 0.07 * (1.0 - smoothstep(0.0, 0.35, edge - rag));
  gl_FragColor = vec4(paper, alpha);
  #include <colorspace_fragment>
}
`

const IMPRESSION_FRAGMENT = /* glsl */ `
uniform sampler2D uMask;
uniform float uPress;
uniform float uSeed;
uniform float uOpacity;
uniform vec3 uColor;
varying vec2 vUv;
${NOISE}
void main() {
  vec2 wobble = (vec2(noise(vUv * 70.0 + uSeed), noise(vUv * 70.0 + uSeed + 7.0)) - 0.5) * 0.007;
  float mask = texture2D(uMask, vUv + wobble).r;
  float coverage = fbm(vUv * 22.0 + uSeed) * 0.7 + uPress * 0.75 - 0.12;
  float ink = smoothstep(0.28, 0.5, coverage);
  float speck = smoothstep(0.12, 0.3, noise(vUv * 190.0 + uSeed * 3.0));
  float density = 0.8 + 0.2 * fbm(vUv * 7.0 + uSeed);
  float alpha = mask * ink * mix(0.55, 1.0, speck) * density * uOpacity;
  gl_FragColor = vec4(uColor * (0.88 + 0.16 * density), alpha);
  #include <colorspace_fragment>
}
`

const SHADOW_FRAGMENT = /* glsl */ `
uniform float uStrength;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  gl_FragColor = vec4(0.08, 0.06, 0.08, (1.0 - smoothstep(0.2, 1.0, d)) * uStrength);
}
`

// 朱文印面：外框加四字，右列“吉敏”，左列“宇印”，按传统自右向左读
function sealMask() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 30
  ctx.strokeRect(30, 30, size - 60, size - 60)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '900 196px "Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", "SimSun", serif'
  const cell = (size - 120) / 2
  const cells: Array<[string, number, number]> = [
    ['吉', 1, 0],
    ['敏', 1, 1],
    ['宇', 0, 0],
    ['印', 0, 1],
  ]
  for (const [char, col, row] of cells) {
    const cx = 60 + cell * col + cell / 2
    const cy = 60 + cell * row + cell / 2
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(1, 1.06)
    ctx.fillText(char, 0, 6)
    ctx.restore()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  return texture
}

// 墨玉石纹：深色底上几道淡紫与洋红的流纹，侧面刻一个细小的 MJ
function stoneTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, size, size)
  g.addColorStop(0, '#2c2833')
  g.addColorStop(1, '#1b1a20')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  let seed = 7
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  for (let k = 0; k < 9; k++) {
    ctx.strokeStyle = k % 3 === 0 ? 'rgba(223, 72, 178, 0.22)' : 'rgba(190, 184, 230, 0.14)'
    ctx.lineWidth = 1 + rand() * 5
    ctx.beginPath()
    let x = rand() * size
    let y = 0
    ctx.moveTo(x, y)
    while (y < size) {
      x += (rand() - 0.5) * 60
      y += 20 + rand() * 30
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.fillStyle = 'rgba(223, 72, 178, 0.55)'
  ctx.font = '400 26px "SFMono-Regular", Consolas, monospace'
  ctx.textAlign = 'center'
  ctx.fillText('MJ', size / 2, size * 0.86)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// onPress 在印面接触纸的瞬间回调印文中心的屏幕坐标
export function createSealScene(host: HTMLElement, reducedMotion: boolean, onPress?: (x: number, y: number) => void): SealScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTexture

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
  camera.position.set(0.15, 8.4, 4.6)
  camera.lookAt(0.15, 0, 0.05)

  scene.add(new THREE.HemisphereLight('#fff6ee', '#2a2430', 0.7))
  const key = new THREE.DirectionalLight('#ffffff', 1.6)
  key.position.set(3, 6, 3)
  scene.add(key)
  const rim = new THREE.PointLight('#df48b2', 6, 8)
  rim.position.set(-2.5, 2.2, -1.5)
  scene.add(rim)

  const paperSize = new THREE.Vector2(4.4, 3.2)
  const paperMat = new THREE.ShaderMaterial({
    uniforms: { uSize: { value: paperSize } },
    vertexShader: PLANE_VERTEX,
    fragmentShader: PAPER_FRAGMENT,
    transparent: true,
  })
  const paperGeo = new THREE.PlaneGeometry(paperSize.x, paperSize.y)
  const paper = new THREE.Mesh(paperGeo, paperMat)
  paper.rotation.x = -Math.PI / 2
  paper.rotation.z = 0.04
  scene.add(paper)

  const mask = sealMask()
  const impressionMat = new THREE.ShaderMaterial({
    uniforms: {
      uMask: { value: mask },
      uPress: { value: 0 },
      uSeed: { value: Math.random() * 50 },
      uOpacity: { value: 1 },
      uColor: { value: new THREE.Color('#c92f6c') },
    },
    vertexShader: PLANE_VERTEX,
    fragmentShader: IMPRESSION_FRAGMENT,
    transparent: true,
    depthWrite: false,
  })
  const impressionGeo = new THREE.PlaneGeometry(1.5, 1.5)
  const impression = new THREE.Mesh(impressionGeo, impressionMat)
  impression.rotation.x = -Math.PI / 2
  impression.position.set(-0.65, 0.004, 0.15)
  scene.add(impression)

  const shadowMat = new THREE.ShaderMaterial({
    uniforms: { uStrength: { value: 0.35 } },
    vertexShader: PLANE_VERTEX,
    fragmentShader: SHADOW_FRAGMENT,
    transparent: true,
    depthWrite: false,
  })
  const shadowGeo = new THREE.PlaneGeometry(2.6, 2.6)
  const shadow = new THREE.Mesh(shadowGeo, shadowMat)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.006
  scene.add(shadow)

  const stoneMap = stoneTexture()
  const stoneMat = new THREE.MeshPhysicalMaterial({ map: stoneMap, roughness: 0.28, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.2 })
  const bodyGeo = new RoundedBoxGeometry(1.4, 2.1, 1.4, 5, 0.16)
  bodyGeo.translate(0, 1.05 + 0.06, 0)
  const knobGeo = new THREE.SphereGeometry(0.42, 32, 16)
  knobGeo.scale(1, 0.55, 1)
  knobGeo.translate(0, 2.2, 0)
  const baseMat = new THREE.MeshStandardMaterial({ color: '#8c1f4d', roughness: 0.7 })
  const baseGeo = new THREE.BoxGeometry(1.34, 0.08, 1.34)
  baseGeo.translate(0, 0.04, 0)
  const stamp = new THREE.Group()
  stamp.add(new THREE.Mesh(bodyGeo, stoneMat), new THREE.Mesh(knobGeo, stoneMat), new THREE.Mesh(baseGeo, baseMat))
  const rest = { x: 1.55, y: 0, z: -0.75, ry: -0.5 }
  stamp.scale.setScalar(0.82)
  stamp.position.set(rest.x, rest.y, rest.z)
  stamp.rotation.y = rest.ry
  scene.add(stamp)

  const syncShadow = () => {
    shadow.position.x = stamp.position.x
    shadow.position.z = stamp.position.z
    const lift = Math.min(stamp.position.y / 2, 1)
    shadow.scale.setScalar(0.9 + lift * 0.6)
    shadowMat.uniforms.uStrength.value = 0.42 * (1 - lift * 0.65)
  }

  const resize = () => {
    const w = host.clientWidth || 240
    const h = host.clientHeight || 200
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  const render = () => {
    syncShadow()
    renderer.render(scene, camera)
  }
  resize()
  render()

  let animating = false
  const tick = () => render()
  const startTicking = () => {
    if (animating) return
    animating = true
    gsap.ticker.add(tick)
  }
  const stopTicking = () => {
    animating = false
    gsap.ticker.remove(tick)
    render()
  }

  let timeline: gsap.core.Timeline | null = null
  let stamped = false

  const stamp_ = () => {
    // 每次盖在略有不同的位置与角度
    const target = { x: -0.65 + (Math.random() - 0.5) * 0.25, z: 0.15 + (Math.random() - 0.5) * 0.2, rot: (Math.random() - 0.5) * 0.14 }
    const seed = Math.random() * 50
    if (reducedMotion) {
      impression.position.x = target.x
      impression.position.z = target.z
      impression.rotation.z = target.rot
      impressionMat.uniforms.uSeed.value = seed
      impressionMat.uniforms.uPress.value = 1
      impressionMat.uniforms.uOpacity.value = 1
      render()
      return
    }
    timeline?.kill()
    startTicking()
    const tl = gsap.timeline({ onComplete: stopTicking })
    if (stamped) tl.to(impressionMat.uniforms.uOpacity, { value: 0, duration: 0.35, ease: 'power1.out' }, 0)
    tl.to(stamp.position, { x: target.x, z: target.z, y: 1.7, duration: 0.7, ease: 'power2.inOut' }, 0)
      .to(stamp.rotation, { y: target.rot, z: 0.06, duration: 0.7, ease: 'power2.inOut' }, 0)
      .call(() => {
        impression.position.x = target.x
        impression.position.z = target.z
        impression.rotation.z = target.rot
        impressionMat.uniforms.uSeed.value = seed
        impressionMat.uniforms.uPress.value = 0
        impressionMat.uniforms.uOpacity.value = 1
      })
      .to(stamp.rotation, { z: 0, duration: 0.18, ease: 'power2.in' })
      .to(stamp.position, { y: 0, duration: 0.18, ease: 'power3.in' }, '<')
      .to(stamp.scale, { y: 0.82 * 0.965, duration: 0.08, ease: 'power2.out' })
      .to(impressionMat.uniforms.uPress, { value: 1, duration: 0.32, ease: 'power2.out' }, '<')
      .call(() => {
        if (!onPress) return
        const point = impression.position.clone().project(camera)
        const rect = renderer.domElement.getBoundingClientRect()
        onPress(rect.left + ((point.x + 1) / 2) * rect.width, rect.top + ((1 - point.y) / 2) * rect.height)
      }, [], '<')
      .to(stamp.rotation, { y: target.rot + 0.05, duration: 0.12, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.05')
      .to(stamp.scale, { y: 0.82, duration: 0.18, ease: 'back.out(3)' }, '+=0.05')
      .to(stamp.position, { y: 1.3, duration: 0.32, ease: 'power2.out' }, '<')
      .to(stamp.position, { x: rest.x, z: rest.z, y: rest.y, duration: 0.7, ease: 'power2.inOut' })
      .to(stamp.rotation, { y: rest.ry, duration: 0.7, ease: 'power2.inOut' }, '<')
    timeline = tl
    stamped = true
  }

  const observer = new ResizeObserver(() => {
    resize()
    render()
  })
  observer.observe(host)

  return {
    stamp: stamp_,
    dispose: () => {
      timeline?.kill()
      gsap.ticker.remove(tick)
      observer.disconnect()
      for (const item of [paperGeo, paperMat, mask, impressionGeo, impressionMat, shadowGeo, shadowMat, stoneMap, stoneMat, bodyGeo, knobGeo, baseGeo, baseMat, envTexture, pmrem]) item.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    },
  }
}
