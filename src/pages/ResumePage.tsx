import { useState } from 'react'
import type { KeyboardEvent } from 'react'

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`

const resumes = [
  {
    title: 'Resume 1',
    subtitle: 'AI 产品经理 / AI 解决方案方向',
    updated: '2026年5月更新',
    href: asset('resume1.pdf'),
  },
  {
    title: 'Resume 2',
    subtitle: 'AI 应用开发 / AI 全栈方向',
    updated: '2026年5月更新',
    href: asset('resume2.pdf'),
  },
]

export default function ResumePage() {
  const [activeResumeIndex, setActiveResumeIndex] = useState(0)
  const activeResume = resumes[activeResumeIndex] ?? resumes[0]

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + direction + resumes.length) % resumes.length
    setActiveResumeIndex(nextIndex)
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    tabs?.[nextIndex]?.focus()
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight text-white">Resume</h1>

      <div className="resume-glass-switch" role="tablist" aria-label="选择简历版本">
        <span
          aria-hidden="true"
          className={`resume-glass-indicator ${activeResumeIndex === 1 ? 'resume-glass-indicator-right' : ''}`}
        />
        {resumes.map((resume, index) => (
          <button
            key={resume.href}
            id={`resume-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={index === activeResumeIndex}
            aria-controls="resume-preview"
            tabIndex={index === activeResumeIndex ? 0 : -1}
            className={`resume-glass-option ${index === activeResumeIndex ? 'resume-glass-option-active' : ''}`}
            onClick={() => setActiveResumeIndex(index)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            <span className="resume-glass-title">{resume.title}</span>
            <span className="resume-glass-subtitle">{resume.subtitle}</span>
            <span className="resume-glass-updated">{resume.updated}</span>
          </button>
        ))}
      </div>

      <div
        id="resume-preview"
        className="resume-preview-shell"
        role="tabpanel"
        aria-labelledby={`resume-tab-${activeResumeIndex}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
          <div className="text-sm font-semibold text-white">
            {activeResume?.title} · {activeResume?.subtitle}
          </div>
          <div className="flex flex-wrap gap-2">
            <a className="button-primary" href={activeResume?.href} download>Download</a>
            <a className="button-secondary" href={activeResume?.href} target="_blank" rel="noreferrer">Open PDF</a>
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
