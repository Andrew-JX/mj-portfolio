// 能力画像的水墨图：四种能力各是一个距离场图形，在撕边宣纸上以水彩墨呈现，
// 滚动时墨团在图形之间晕开再聚拢；鼠标靠近会把墨轻轻吸过去。

export type CapabilityInk = {
  setMorph: (value: number) => void
  setPointer: (x: number, y: number, active: boolean) => void
  setActive: (active: boolean) => void
  setTheme: (dark: boolean) => void
  resize: () => void
  dispose: () => void
}

const VERTEX = /* glsl */ `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform vec2 uRes;
uniform float uTime;
uniform float uMorph;
uniform vec3 uPointer;
uniform float uDark;

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
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdCircle(vec2 p, float r) { return length(p) - r; }
float sdSegment(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
float sdBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
mat2 rot(float a) { float c = cos(a); float s = sin(a); return mat2(c, -s, s, c); }

// 01 AI 应用开发：中心模型连着四个绕行的工具节点
float shapeAgent(vec2 p, float t) {
  float d = sdCircle(p, 0.17);
  for (int i = 0; i < 4; i++) {
    float a = t * 0.25 + float(i) * 1.5708;
    vec2 node = vec2(cos(a), sin(a)) * 0.42;
    d = smin(d, sdSegment(p, vec2(0.0), node, 0.022), 0.03);
    d = smin(d, sdCircle(p - node, 0.075), 0.04);
  }
  return d;
}
// 02 AI 全栈交付：界面、服务、模型三层叠起，中间一根数据线贯穿
float shapeStack(vec2 p, float t) {
  float d = 1e3;
  for (int i = 0; i < 3; i++) {
    float y = 0.27 - float(i) * 0.27;
    float sway = sin(t * 0.6 + float(i) * 1.7) * 0.025;
    d = smin(d, sdBox(p - vec2(sway, y), vec2(0.4 - float(i) * 0.04, 0.075), 0.03), 0.05);
  }
  d = smin(d, sdSegment(p, vec2(0.0, 0.34), vec2(0.0, -0.34), 0.02), 0.04);
  return d;
}
// 03 AI 产品视角：留一道缺口、末端带箭头的迭代回环
float shapeLoop(vec2 p, float t) {
  vec2 q = rot(t * 0.35) * p;
  float ang = atan(q.y, q.x);
  float ring = abs(length(q) - 0.32) - 0.055;
  ring = max(ring, (0.4 - abs(ang)) * 0.32);
  vec2 radial = vec2(cos(0.4), sin(0.4));
  vec2 tangent = vec2(-radial.y, radial.x);
  vec2 tip = radial * 0.32 + tangent * 0.05;
  float head = sdSegment(q, tip, tip - tangent * 0.12 + radial * 0.1, 0.035);
  head = smin(head, sdSegment(q, tip, tip - tangent * 0.12 - radial * 0.1, 0.035), 0.03);
  return smin(ring, head, 0.04);
}
// 04 AI 解决方案：一根主干拆成数据、工具、模型、界面、部署五支
float shapeBranch(vec2 p, float t) {
  vec2 root = vec2(0.0, -0.42);
  vec2 fork = vec2(0.0, -0.06);
  float d = sdSegment(p, root, fork, 0.035);
  for (int i = 0; i < 5; i++) {
    float a = mix(2.45, 0.69, float(i) / 4.0) + sin(t * 0.5 + float(i)) * 0.05;
    vec2 tip = fork + vec2(cos(a), sin(a)) * 0.42;
    d = smin(d, sdSegment(p, fork, tip, 0.018), 0.035);
    d = smin(d, sdCircle(p - tip, 0.06), 0.035);
  }
  return smin(d, sdCircle(p - root, 0.07), 0.04);
}

float shapeAt(int index, vec2 p, float t) {
  if (index == 0) return shapeAgent(p, t);
  if (index == 1) return shapeStack(p, t);
  if (index == 2) return shapeLoop(p, t);
  return shapeBranch(p, t);
}

void main() {
  vec2 frag = vUv * uRes;
  float side = min(uRes.x, uRes.y);
  vec2 p = (frag - 0.5 * uRes) / side;

  // 纸：圆角矩形外撕边，边外透明露出页面底色
  vec2 paperHalf = 0.5 * uRes / side - vec2(0.045);
  float paperEdge = sdBox(p, paperHalf, 0.0);
  float rag = fbm(p * 9.0) * 0.035 + fbm(p * 60.0) * 0.008;
  float paperAlpha = smoothstep(0.006, -0.004, paperEdge + rag);
  float fiber = fbm(p * vec2(140.0, 30.0)) * 0.5 + fbm(p * 40.0) * 0.5;
  vec3 paper = mix(vec3(0.95, 0.93, 0.885), vec3(0.93, 0.91, 0.87), uDark) * (0.94 + 0.08 * fiber);
  paper *= 1.0 - 0.06 * smoothstep(-0.12, 0.0, paperEdge + rag);

  // 鼠标附近的墨被轻轻吸过去
  vec2 toPointer = uPointer.xy - p;
  p += toPointer * 0.16 * uPointer.z * exp(-dot(toPointer, toPointer) * 9.0);

  // 图形整体缩到纸面七成左右，四周留白
  p *= 1.45;
  float t = uTime;
  int a = int(floor(clamp(uMorph, 0.0, 3.0)));
  int b = min(a + 1, 3);
  float f = smoothstep(0.0, 1.0, fract(clamp(uMorph, 0.0, 3.0)));
  if (uMorph >= 3.0) f = 0.0;
  float d = mix(shapeAt(a, p, t), shapeAt(b, p, t), f);

  // 形变途中墨更“湿”：边缘起伏更大，像重新晕开
  float wet = sin(f * 3.14159);
  float n = fbm(p * 5.0 + vec2(t * 0.04, -t * 0.03));
  float n2 = fbm(p * 21.0 - t * 0.05);
  float dd = d + (n - 0.5) * (0.05 + wet * 0.09) + (n2 - 0.5) * 0.018;

  float body = smoothstep(0.008, -0.008, dd);
  float rim = smoothstep(0.022, 0.0, abs(dd + 0.006)) * body;
  float bleed = smoothstep(0.1 + wet * 0.08, 0.0, dd) * (1.0 - body);
  float granule = fbm(p * 95.0) * 0.6 + fbm(p * 30.0) * 0.4;

  vec3 ink = vec3(0.12, 0.11, 0.14);
  vec3 magenta = vec3(0.87, 0.28, 0.70);
  // 墨为主，洋红只在湿边上泛出来
  float edgeTint = smoothstep(-0.07, 0.0, dd);
  vec3 pigment = mix(ink, magenta, clamp(edgeTint * 0.55 + (n - 0.55) * 0.35, 0.0, 1.0));
  pigment *= 0.82 + 0.3 * granule;

  vec3 color = paper;
  color = mix(color, magenta, bleed * (0.08 + 0.14 * n2));
  color = mix(color, pigment, body * (0.82 + 0.18 * granule));
  color = mix(color, ink, rim * 0.35);

  // 一道干笔飞白，从墨团里横扫出去
  float stroke = smoothstep(0.05, 0.0, abs(p.y + 0.36 + sin(p.x * 3.0 + t * 0.2) * 0.02)) * smoothstep(0.42, -0.2, abs(p.x - 0.05));
  float dry = step(0.55, fbm(vec2(p.x * 9.0, p.y * 160.0)));
  color = mix(color, ink, stroke * dry * 0.28 * (1.0 - body));

  fragColor = vec4(color * paperAlpha, paperAlpha);
}`

export function createCapabilityInk(host: HTMLElement, dark: boolean): CapabilityInk | null {
  const canvas = document.createElement('canvas')
  canvas.className = 'capability-ink-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false })
  if (!gl) return null

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'shader')
    return shader
  }
  const program = gl.createProgram()!
  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT))
    gl.bindAttribLocation(program, 0, 'aPosition')
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'program')
  } catch {
    return null
  }
  host.appendChild(canvas)
  gl.useProgram(program)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  const u = (name: string) => gl.getUniformLocation(program, name)
  const uniforms = { res: u('uRes'), time: u('uTime'), morph: u('uMorph'), pointer: u('uPointer'), dark: u('uDark') }

  const state = { morph: 0, targetMorph: 0, pointer: [0, 0, 0], pointerTarget: [0, 0, 0], dark, active: false, raf: 0, last: 0, time: 0 }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    const w = Math.max(1, Math.round(host.clientWidth * dpr))
    const h = Math.max(1, Math.round(host.clientHeight * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    gl.viewport(0, 0, w, h)
  }
  const draw = () => {
    gl.uniform2f(uniforms.res, canvas.width, canvas.height)
    gl.uniform1f(uniforms.time, state.time)
    gl.uniform1f(uniforms.morph, state.morph)
    gl.uniform3f(uniforms.pointer, state.pointer[0], state.pointer[1], state.pointer[2])
    gl.uniform1f(uniforms.dark, state.dark ? 1 : 0)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
  const frame = (now: number) => {
    if (!state.active) return
    const dt = Math.min((now - state.last) / 1000, 0.1)
    state.last = now
    state.time += dt
    const k = 1 - Math.exp(-dt * 4)
    state.morph += (state.targetMorph - state.morph) * k
    for (let i = 0; i < 3; i++) state.pointer[i] += (state.pointerTarget[i] - state.pointer[i]) * (1 - Math.exp(-dt * 6))
    draw()
    state.raf = requestAnimationFrame(frame)
  }

  resize()
  draw()
  const observer = new ResizeObserver(() => {
    resize()
    draw()
  })
  observer.observe(host)

  return {
    setMorph: (value) => {
      state.targetMorph = value
      if (reduced || !state.active) {
        state.morph = value
        draw()
      }
    },
    setPointer: (x, y, active) => {
      state.pointerTarget = [x, y, active ? 1 : 0]
    },
    setActive: (active) => {
      if (reduced || active === state.active) return
      state.active = active
      if (active) {
        state.last = performance.now()
        state.raf = requestAnimationFrame(frame)
      } else {
        cancelAnimationFrame(state.raf)
      }
    },
    setTheme: (next) => {
      state.dark = next
      draw()
    },
    resize,
    dispose: () => {
      state.active = false
      cancelAnimationFrame(state.raf)
      observer.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    },
  }
}
