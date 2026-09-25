// 开场在首次访问、以及在首页刷新时播放；站内跳回首页不播。“重看开场”通过全局事件让首页重新挂上它。

const SEEN_KEY = 'mj-inkroad-seen'
export const INKROAD_REPLAY_EVENT = 'inkroad:replay'

function hasSeenInkRoad() {
  try {
    return window.localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function markInkRoadSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, '1')
  } catch {
    // 无痕模式等场景写不进去时，下次仍会播放，不影响页面
  }
}

export function replayInkRoad() {
  window.dispatchEvent(new Event(INKROAD_REPLAY_EVENT))
}

function isReload() {
  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return entry?.type === 'reload'
}

export function shouldPlayInkRoad() {
  return isReload() || !hasSeenInkRoad()
}
