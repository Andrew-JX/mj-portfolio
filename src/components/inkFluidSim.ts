// 全站墨水层：WebGL2 稳定流体（半精度纹理），鼠标划过注入速度和墨量，
// 显示时按水彩处理——边缘积墨、纸纹颗粒，墨量映射到洋红与墨色两种颜料。

export type InkFluid = {
  splat: (x: number, y: number, dx: number, dy: number, magenta: number, ink: number, radius?: number) => void
  setTheme: (dark: boolean) => void
  resize: () => void
  dispose: () => void
}

const SIM_RESOLUTION = 128
const DYE_RESOLUTION = 512
const PRESSURE_ITERATIONS = 18
const CURL = 22
const VELOCITY_DISSIPATION = 0.35
const DYE_DISSIPATION = 0.75
// 最后一次注墨后继续模拟的秒数；墨迹到那时已经淡到看不见，渲染循环随之休眠
const IDLE_AFTER = 7

const BASE_VERTEX = /* glsl */ `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const HEADER = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
`

const SPLAT = HEADER + /* glsl */ `
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  fragColor = vec4(texture(uTarget, vUv).xyz + splat, 1.0);
}`

const ADVECTION = HEADER + /* glsl */ `
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  fragColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`

const DIVERGENCE = HEADER + /* glsl */ `
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`

const CURL_SHADER = HEADER + /* glsl */ `
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`

const VORTICITY = HEADER + /* glsl */ `
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  fragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`

const PRESSURE = HEADER + /* glsl */ `
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`

const GRADIENT_SUBTRACT = HEADER + /* glsl */ `
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}`

const CLEAR = HEADER + /* glsl */ `
uniform sampler2D uTexture;
uniform float value;
void main () {
  fragColor = value * texture(uTexture, vUv);
}`

// 墨量：r = 洋红，g = 墨色。边缘按墨量梯度加深，叠一层纸纹颗粒
const DISPLAY = HEADER + /* glsl */ `
uniform sampler2D uDye;
uniform vec2 dyeTexel;
uniform vec2 resolution;
uniform vec3 magenta;
uniform vec3 inkColor;
uniform float maxAlpha;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float amount(vec2 uv) {
  vec2 d = texture(uDye, uv).rg;
  return d.r + d.g;
}
void main () {
  vec2 dye = max(texture(uDye, vUv).rg, 0.0);
  float total = dye.r + dye.g;
  vec2 o = dyeTexel * 2.0;
  float gx = amount(vUv + vec2(o.x, 0.0)) - amount(vUv - vec2(o.x, 0.0));
  float gy = amount(vUv + vec2(0.0, o.y)) - amount(vUv - vec2(0.0, o.y));
  float rim = clamp(length(vec2(gx, gy)) * 3.0, 0.0, 1.0);
  vec2 px = vUv * resolution;
  float grain = noise(px / 2.2) * 0.6 + noise(px / 11.0) * 0.4;
  vec3 color = (magenta * dye.r + inkColor * dye.g) / max(total, 0.0001);
  float body = smoothstep(0.015, 0.8, total);
  float alpha = (body * (0.72 + 0.28 * grain) + rim * 0.45 * body) * maxAlpha;
  alpha = clamp(alpha, 0.0, maxAlpha);
  fragColor = vec4(color * alpha, alpha);
}`

type Program = { program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null> }
type FBO = { texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number; texelX: number; texelY: number; attach: (unit: number) => number }
type DoubleFBO = { read: FBO; write: FBO; swap: () => void; width: number; height: number; texelX: number; texelY: number }

const THEMES = {
  dark: { magenta: [0.87, 0.28, 0.7], ink: [0.62, 0.58, 0.86], maxAlpha: 0.62 },
  light: { magenta: [0.65, 0.13, 0.5], ink: [0.12, 0.11, 0.16], maxAlpha: 0.42 },
}

export function createInkFluid(container: HTMLElement, dark: boolean): InkFluid | null {
  // 每次创建都用新画布：同一画布上的上下文一旦释放就无法再取回
  const canvas = document.createElement('canvas')
  canvas.className = 'ink-fluid'
  canvas.setAttribute('aria-hidden', 'true')
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false })
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) return null
  container.appendChild(canvas)

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'shader')
    return shader
  }
  const vertex = compile(gl.VERTEX_SHADER, BASE_VERTEX)
  const makeProgram = (fragmentSource: string): Program => {
    const program = gl.createProgram()!
    gl.attachShader(program, vertex)
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource))
    gl.bindAttribLocation(program, 0, 'aPosition')
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'program')
    const uniforms: Program['uniforms'] = {}
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(program, i)!.name
      uniforms[name] = gl.getUniformLocation(program, name)
    }
    return { program, uniforms }
  }

  let programs: Record<string, Program>
  try {
    programs = {
      splat: makeProgram(SPLAT),
      advection: makeProgram(ADVECTION),
      divergence: makeProgram(DIVERGENCE),
      curl: makeProgram(CURL_SHADER),
      vorticity: makeProgram(VORTICITY),
      pressure: makeProgram(PRESSURE),
      gradient: makeProgram(GRADIENT_SUBTRACT),
      clear: makeProgram(CLEAR),
      display: makeProgram(DISPLAY),
    }
  } catch {
    canvas.remove()
    return null
  }

  const quad = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
  const indices = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)

  const blit = (target: FBO | null) => {
    if (target) {
      gl.viewport(0, 0, target.width, target.height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  }

  const createFBO = (w: number, h: number, internalFormat: number, format: number): FBO => {
    gl.activeTexture(gl.TEXTURE0)
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, gl.HALF_FLOAT, null)
    const fbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    gl.viewport(0, 0, w, h)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelX: 1 / w,
      texelY: 1 / h,
      attach: (unit) => {
        gl.activeTexture(gl.TEXTURE0 + unit)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        return unit
      },
    }
  }
  const createDouble = (w: number, h: number, internalFormat: number, format: number): DoubleFBO => {
    let a = createFBO(w, h, internalFormat, format)
    let b = createFBO(w, h, internalFormat, format)
    const pair = {
      get read() { return a },
      get write() { return b },
      swap: () => {
        const t = a
        a = b
        b = t
      },
      width: w,
      height: h,
      texelX: 1 / w,
      texelY: 1 / h,
    }
    return pair as DoubleFBO
  }
  const deleteFBO = (target: FBO) => {
    gl.deleteTexture(target.texture)
    gl.deleteFramebuffer(target.fbo)
  }

  const resolutionFor = (base: number) => {
    const aspect = gl.drawingBufferWidth / Math.max(gl.drawingBufferHeight, 1)
    const min = Math.round(base)
    const max = Math.round(base * Math.max(aspect, 1 / aspect))
    return aspect > 1 ? { w: max, h: min } : { w: min, h: max }
  }

  let velocity: DoubleFBO
  let dye: DoubleFBO
  let pressure: DoubleFBO
  let divergence: FBO
  let curl: FBO
  const allocate = () => {
    const sim = resolutionFor(SIM_RESOLUTION)
    const dyeRes = resolutionFor(DYE_RESOLUTION)
    velocity = createDouble(sim.w, sim.h, gl.RG16F, gl.RG)
    dye = createDouble(dyeRes.w, dyeRes.h, gl.RGBA16F, gl.RGBA)
    pressure = createDouble(sim.w, sim.h, gl.R16F, gl.RED)
    divergence = createFBO(sim.w, sim.h, gl.R16F, gl.RED)
    curl = createFBO(sim.w, sim.h, gl.R16F, gl.RED)
  }
  const release = () => {
    for (const pair of [velocity, dye, pressure]) {
      deleteFBO(pair.read)
      deleteFBO(pair.write)
    }
    deleteFBO(divergence)
    deleteFBO(curl)
  }

  const sizeCanvas = () => {
    const w = Math.max(1, Math.round(window.innerWidth))
    const h = Math.max(1, Math.round(window.innerHeight))
    if (canvas.width === w && canvas.height === h) return false
    canvas.width = w
    canvas.height = h
    return true
  }
  sizeCanvas()
  allocate()

  let theme = dark ? THEMES.dark : THEMES.light
  let raf = 0
  let running = false
  let lastFrame = 0
  let lastSplat = -Infinity
  let disposed = false

  const use = (p: Program) => {
    gl.useProgram(p.program)
    return p.uniforms
  }

  const step = (dt: number) => {
    gl.disable(gl.BLEND)
    let u = use(programs.curl)
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
    gl.uniform1i(u.uVelocity, velocity.read.attach(0))
    blit(curl)

    u = use(programs.vorticity)
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
    gl.uniform1i(u.uVelocity, velocity.read.attach(0))
    gl.uniform1i(u.uCurl, curl.attach(1))
    gl.uniform1f(u.curl, CURL)
    gl.uniform1f(u.dt, dt)
    blit(velocity.write)
    velocity.swap()

    u = use(programs.divergence)
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
    gl.uniform1i(u.uVelocity, velocity.read.attach(0))
    blit(divergence)

    u = use(programs.clear)
    gl.uniform1i(u.uTexture, pressure.read.attach(0))
    gl.uniform1f(u.value, 0.8)
    blit(pressure.write)
    pressure.swap()

    u = use(programs.pressure)
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
    gl.uniform1i(u.uDivergence, divergence.attach(0))
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(u.uPressure, pressure.read.attach(1))
      blit(pressure.write)
      pressure.swap()
    }

    u = use(programs.gradient)
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
    gl.uniform1i(u.uPressure, pressure.read.attach(0))
    gl.uniform1i(u.uVelocity, velocity.read.attach(1))
    blit(velocity.write)
    velocity.swap()

    u = use(programs.advection)
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
    gl.uniform1i(u.uVelocity, velocity.read.attach(0))
    gl.uniform1i(u.uSource, velocity.read.attach(0))
    gl.uniform1f(u.dt, dt)
    gl.uniform1f(u.dissipation, VELOCITY_DISSIPATION)
    blit(velocity.write)
    velocity.swap()

    gl.uniform1i(u.uVelocity, velocity.read.attach(0))
    gl.uniform1i(u.uSource, dye.read.attach(1))
    gl.uniform1f(u.dissipation, DYE_DISSIPATION)
    blit(dye.write)
    dye.swap()
  }

  const render = () => {
    const u = use(programs.display)
    gl.uniform1i(u.uDye, dye.read.attach(0))
    gl.uniform2f(u.dyeTexel, dye.texelX, dye.texelY)
    gl.uniform2f(u.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.uniform3fv(u.magenta, theme.magenta)
    gl.uniform3fv(u.inkColor, theme.ink)
    gl.uniform1f(u.maxAlpha, theme.maxAlpha)
    gl.disable(gl.BLEND)
    blit(null)
  }

  const frame = (now: number) => {
    if (disposed) return
    const dt = Math.min((now - lastFrame) / 1000, 1 / 30)
    lastFrame = now
    step(dt)
    render()
    if (now - lastSplat > IDLE_AFTER * 1000) {
      running = false
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      return
    }
    raf = requestAnimationFrame(frame)
  }

  const wake = () => {
    lastSplat = performance.now()
    if (running || disposed) return
    running = true
    lastFrame = performance.now()
    raf = requestAnimationFrame(frame)
  }

  return {
    splat: (x, y, dx, dy, magenta, ink, radius = 0.0022) => {
      if (disposed) return
      const aspect = canvas.width / canvas.height
      const r = aspect > 1 ? radius * aspect : radius
      let u = use(programs.splat)
      gl.uniform1i(u.uTarget, velocity.read.attach(0))
      gl.uniform1f(u.aspectRatio, aspect)
      gl.uniform2f(u.point, x, y)
      gl.uniform3f(u.color, dx, dy, 0)
      gl.uniform1f(u.radius, r)
      blit(velocity.write)
      velocity.swap()
      u = use(programs.splat)
      gl.uniform1i(u.uTarget, dye.read.attach(0))
      gl.uniform3f(u.color, magenta, ink, 0)
      gl.uniform1f(u.radius, r * 0.9)
      blit(dye.write)
      dye.swap()
      wake()
    },
    setTheme: (next) => {
      theme = next ? THEMES.dark : THEMES.light
    },
    resize: () => {
      if (!sizeCanvas()) return
      release()
      allocate()
    },
    dispose: () => {
      disposed = true
      cancelAnimationFrame(raf)
      release()
      Object.values(programs).forEach((p) => gl.deleteProgram(p.program))
      gl.deleteBuffer(quad)
      gl.deleteBuffer(indices)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    },
  }
}
