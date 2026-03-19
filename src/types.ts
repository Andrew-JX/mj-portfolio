export type ProjectVisibility = 'public' | 'course' | 'nda'

export type ProjectLinkKey = 'live' | 'repo' | 'doc' | 'video'

export type ProjectLinks = Partial<Record<ProjectLinkKey, string>>

export type Project = {
  /** Stable route key used by the project detail page. */
  slug: string
  /** Project title shown on cards, detail pages, and evidence links. */
  title: string
  /** Time range used in portfolio timeline and recruiter quick scans. */
  period: string
  /** Short badge that communicates the role focus of the project. */
  positionTag: string
  /** Core technologies and keywords used for filters and stack tags. */
  stack: string[]
  /** One-line summary that explains the project value in resume style. */
  oneLiner: string
  /** Public links for demo, repo, docs, or video. */
  links: ProjectLinks
  /** Concrete responsibilities I can explain in interview depth. */
  contributions: string[]
  /** Engineering highlights focused on architecture, security, performance, or delivery. */
  highlights: string[]
  /** Interview-oriented questions or talking points for review and rehearsal. */
  interviewGrill: string[]
  /** AI collaboration note used only when the project involved AI-assisted delivery. */
  aiNote?: string
  /** NDA or context note displayed on the detail page when needed. */
  note?: string
  /** Visibility marker used for presentation and filtering. */
  visibility: ProjectVisibility
}

