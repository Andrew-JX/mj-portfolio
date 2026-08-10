import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'

const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'))
const SkillsPage = lazy(() => import('@/pages/SkillsPage'))
const ToolusePage = lazy(() => import('@/pages/ToolusePage'))
const ResumePage = lazy(() => import('@/pages/ResumePage'))

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return null
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-[45vh]" aria-label="页面加载中" />}>
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/lab" element={<SkillsPage />} />
          <Route path="/skills" element={<Navigate to="/lab" replace />} />
          <Route path="/tooluse" element={<ToolusePage />} />
          <Route path="/resume" element={<ResumePage />} />
        </Routes>
      </Suspense>
    </>
  )
}
