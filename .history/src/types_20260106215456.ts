export type ProjectType = 'Case Study' | 'Coursework' | 'Product' | 'Demo'

export type Project = {
  slug: string
  title: string
  subtitle: string
  period?: string
  role: string
  tech: string[]
  summary: string
  bullets: string[]
  links: {
    live?: string
    repo?: string
    gitee?: string
    video?: string
  }
  note?: string
}

