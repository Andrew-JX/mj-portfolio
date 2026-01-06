export type ProjectType = 'Case Study' | 'Coursework' | 'Product' | 'Demo'

export type Project = {
  slug: string
  title: string
  subtitle: string
  type: ProjectType
  stack: string[]
  role: string
  status?: 'Live' | 'Private' | 'ComingSoon'
  links: {
    live?: string
    repo?: string
    gitee?: string
    video?: string
  }
  overview: string[]
  highlights: string[]
  whatILearned: string[]
}
