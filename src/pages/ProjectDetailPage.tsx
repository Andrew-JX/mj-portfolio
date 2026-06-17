import { Link, useParams } from 'react-router-dom'
import ProjectPreviewFrame from '@/components/ProjectPreviewFrame'
import { projects } from '@/data/projects'
import { getProjectMedia } from '@/data/projectMedia'
import type { ProjectLinkEntry, ProjectLinkKey } from '@/types'

const linkLabels: Record<ProjectLinkKey, string> = {
  live: 'Live',
  repo: 'Repo',
  doc: 'Doc',
  video: 'Video',
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return <div className="text-stone-300">Project not found.</div>
  }

  const projectLinks: ProjectLinkEntry[] = [
    ...Object.entries(project.links).map(([key, url]) => ({ label: linkLabels[key as ProjectLinkKey], url })),
    ...(project.extraLinks ?? []),
  ]
  const projectMedia = getProjectMedia(project.slug)

  return (
    <div className="space-y-8">
      <section className="hero-panel space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="index-badge">{project.positionTag}</span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">{project.period}</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{project.title}</h1>
          <p className="max-w-3xl text-base leading-8 text-stone-300/82">{project.oneLiner}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => <span key={tech} className="chip">{tech}</span>)}
        </div>

        <div className="flex flex-wrap gap-2">
          {projectLinks.map((item) => (
            <a key={`${item.label}-${item.url}`} className="button-secondary" href={item.url} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>

        <ProjectPreviewFrame media={projectMedia} />
      </section>

      {project.visibility === 'nda' && (
        <section className="rounded-3xl border border-amber-400/20 bg-amber-400/8 px-5 py-4 text-sm leading-7 text-amber-100">
          NDA note: this case study avoids client-identifying material and focuses on responsibilities, technical approach,
          and delivery experience that can be discussed publicly.
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="panel-card space-y-4">
          <div className="section-title">Overview</div>
          <p className="text-sm leading-7 text-stone-300/82">{project.oneLiner}</p>
          <div className="space-y-2 text-sm text-stone-300/82">
            {projectLinks.map((item) => (
              <div key={`${item.label}-summary-${item.url}`} className="flex flex-wrap items-center gap-2">
                <span className="min-w-14 text-stone-500">{item.label}</span>
                <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>
              </div>
            ))}
          </div>
        </article>

        {project.note && (
          <article className="panel-card space-y-4">
            <div className="section-title">Context</div>
            <p className="text-sm leading-7 text-stone-300/82">{project.note}</p>
          </article>
        )}
      </section>

      <section className="panel-card space-y-4">
        <div className="section-title">Contributions</div>
        <ul className="space-y-3 text-sm leading-7 text-stone-300/82">
          {project.contributions.map((item) => <li key={item} className="detail-list-item">{item}</li>)}
        </ul>
      </section>

      <section className="panel-card space-y-4">
        <div className="section-title">Highlights</div>
        <ul className="space-y-3 text-sm leading-7 text-stone-300/82">
          {project.highlights.map((item) => <li key={item} className="detail-list-item">{item}</li>)}
        </ul>
      </section>

      {project.aiNote && (
        <section className="panel-card space-y-4">
          <div className="section-title">AI Collaboration</div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
              <div className="text-sm font-semibold text-orange-200">My role</div>
              <p className="mt-3 text-sm leading-7 text-stone-300/82">
                Product framing, scope control, interaction flow, system boundaries, review, integration, and quality
                sign-off remained my responsibility throughout delivery.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
              <div className="text-sm font-semibold text-orange-200">AI role</div>
              <p className="mt-3 text-sm leading-7 text-stone-300/82">
                AI support was used for draft generation, implementation assistance, local exploration, and documentation
                acceleration, with final architecture and production quality decisions made manually.
              </p>
            </div>
          </div>
          <p className="text-sm leading-7 text-stone-300/82">{project.aiNote}</p>
        </section>
      )}

      <div>
        <Link className="text-sm text-stone-300 transition-colors hover:text-white" to="/projects">
          Back to projects
        </Link>
      </div>
    </div>
  )
}
