import { useMemo, useState } from 'react'

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`

const resumes = [
  {
    title: 'Resume 1',
    subtitle: 'AI 产品经理 / AI 解决方案方向',
    href: asset('resume1.pdf'),
  },
  {
    title: 'Resume 2',
    subtitle: 'AI 应用开发 / AI 全栈方向',
    href: asset('resume2.pdf'),
  },
]

export default function ResumePage() {
  const [activeResumeHref, setActiveResumeHref] = useState(resumes[0]?.href ?? asset('resume1.pdf'))
  const activeResume = useMemo(
    () => resumes.find((resume) => resume.href === activeResumeHref) ?? resumes[0],
    [activeResumeHref],
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Resume</h1>
          <p className="max-w-3xl text-sm leading-7 text-stone-300/84">
            这里放两份简历：Resume 1 更偏 AI 产品经理 / AI 解决方案，Resume 2 更偏 AI 应用开发 / AI 全栈。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {resumes.map((resume) => (
            <a key={resume.href} className="button-primary" href={resume.href} download>
              Download {resume.title}
            </a>
          ))}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {resumes.map((resume) => (
          <article key={resume.href} className="panel-card space-y-4">
            <div>
              <div className="section-title">{resume.title}</div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">{resume.subtitle}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="button-primary" onClick={() => setActiveResumeHref(resume.href)}>
                Preview
              </button>
              <a className="button-primary" href={resume.href} download>Download</a>
              <a className="button-secondary" href={resume.href} target="_blank" rel="noreferrer">Open PDF</a>
            </div>
          </article>
        ))}
      </section>

      <div className="resume-preview-shell">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
          <div className="text-sm font-semibold text-white">
            Preview: {activeResume?.title} · {activeResume?.subtitle}
          </div>
          <div className="flex flex-wrap gap-2">
            {resumes.map((resume) => (
              <button
                key={`preview-${resume.href}`}
                type="button"
                className={`chip-button ${resume.href === activeResumeHref ? 'chip-button-active' : ''}`}
                onClick={() => setActiveResumeHref(resume.href)}
              >
                {resume.title}
              </button>
            ))}
          </div>
        </div>
        <object data={activeResume?.href} type="application/pdf" className="h-[78vh] w-full">
          <div className="p-6 text-sm text-stone-300/84">
            浏览器不支持预览 PDF。请点击上方按钮下载，或确认简历文件已经放在 <code>public/resume1.pdf</code> 与 <code>public/resume2.pdf</code>。
          </div>
        </object>
      </div>
    </div>
  )
}
