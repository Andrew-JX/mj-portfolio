// 站内几个效果之间的轻量联动：盖章溅墨、路边广告牌走同一套转场

const SPLASH_EVENT = 'ink:splash'
const NAVIGATE_EVENT = 'ink:navigate'

type Splash = { x: number; y: number; amount: number }

export function inkSplash(x: number, y: number, amount = 1) {
  window.dispatchEvent(new CustomEvent<Splash>(SPLASH_EVENT, { detail: { x, y, amount } }))
}

export function onInkSplash(handler: (splash: Splash) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<Splash>).detail)
  window.addEventListener(SPLASH_EVENT, listener)
  return () => window.removeEventListener(SPLASH_EVENT, listener)
}

export function inkNavigate(path: string) {
  window.dispatchEvent(new CustomEvent<string>(NAVIGATE_EVENT, { detail: path }))
}

export function onInkNavigate(handler: (path: string) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail)
  window.addEventListener(NAVIGATE_EVENT, listener)
  return () => window.removeEventListener(NAVIGATE_EVENT, listener)
}
