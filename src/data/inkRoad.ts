export type InkRoadChapter = {
  id: string
  title: string
  cn: string
  tagline: string
  // 章节在整段滚动进度里的起点（0–1）
  start: number
}

export const inkRoadChapters: InkRoadChapter[] = [
  { id: 'start', title: 'Start Lane', cn: '起点巷', tagline: 'Minyu Ji · AI application, full-stack & product', start: 0 },
  { id: 'prompt', title: 'Prompt Avenue', cn: '提示词大道', tagline: 'Tool calling, streaming state, answers you can verify', start: 0.16 },
  { id: 'stack', title: 'Stack Bridge', cn: '全栈桥', tagline: 'From interface to database to model provider', start: 0.36 },
  { id: 'loop', title: 'The Product Loop', cn: '产品回环', tagline: 'Scope, ship, measure, and go round again', start: 0.56 },
  { id: 'fold', title: 'The Fold', cn: '折叠天际', tagline: 'Where the road turns into the work', start: 0.78 },
]

export type InkRoadTime = 'dawn' | 'morning' | 'noon' | 'golden' | 'dusk' | 'night'

export const inkRoadTimes: { id: InkRoadTime; label: string; clock: string }[] = [
  { id: 'dawn', label: 'Dawn', clock: '05:40' },
  { id: 'morning', label: 'Morning', clock: '09:30' },
  { id: 'noon', label: 'Noon', clock: '12:10' },
  { id: 'golden', label: 'Golden', clock: '17:20' },
  { id: 'dusk', label: 'Dusk', clock: '18:50' },
  { id: 'night', label: 'Night', clock: '22:30' },
]

export type InkRoadBillboard = {
  slug: string
  name: string
  // 放在整段滚动进度的哪个位置（0–1），side 为 1 在右侧、-1 在左侧
  at: number
  side: 1 | -1
}

export const inkRoadBillboards: InkRoadBillboard[] = [
  { slug: 'cat-note-illustrations', name: 'cat-note', at: 0.05, side: 1 },
  { slug: 'quickdate', name: 'quickDate', at: 0.11, side: -1 },
  { slug: 'fitmind-ai', name: 'FitMind AI', at: 0.21, side: 1 },
  { slug: 'pureip', name: 'PureIP', at: 0.29, side: -1 },
  { slug: 'easemove', name: 'EaseMove', at: 0.43, side: 1 },
  { slug: 'ai-pm-dev', name: 'AI PM Dev Agent', at: 0.52, side: -1 },
]
