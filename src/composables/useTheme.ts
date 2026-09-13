import { useSyncExternalStore } from 'react'

const THEME_STORAGE_KEY = 'theme'

let isDark = true
const listeners = new Set<() => void>()

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return isDark
}

function emit() {
  listeners.forEach((listener) => listener())
}

if (typeof document !== 'undefined') {
  try {
    if (window.localStorage.getItem(THEME_STORAGE_KEY) === 'light') isDark = false
  } catch {
    // Storage can fail in private browsing; the page should still render.
  }
  applyTheme()
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    isDark: dark,
    toggle: () => {
      isDark = !isDark
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light')
      } catch {
        // 写失败只影响记忆，不影响本次切换。
      }
      applyTheme()
      emit()
    },
  }
}
