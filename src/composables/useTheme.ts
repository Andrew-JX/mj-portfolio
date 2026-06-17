import { useSyncExternalStore } from 'react'

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
  applyTheme()
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    isDark: dark,
    toggle: () => {
      isDark = !isDark
      applyTheme()
      emit()
    },
  }
}
