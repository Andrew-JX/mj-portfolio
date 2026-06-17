import { HashRouter, NavLink } from 'react-router-dom'
import AppRoutes from '@/router'
import TorchToggle from '@/components/TorchToggle'
import { useTheme } from '@/composables/useTheme'

export default function App() {
  const { isDark } = useTheme()
  const pageStyle = {
    background: isDark
      ? 'radial-gradient(circle at 16% 12%, rgba(249, 115, 22, 0.14), transparent 26%), radial-gradient(circle at 84% 20%, rgba(245, 158, 11, 0.1), transparent 24%), radial-gradient(circle at 50% 82%, rgba(217, 119, 6, 0.14), transparent 34%), linear-gradient(180deg, #110d0b 0%, #18110d 36%, #0d0a09 100%)'
      : 'radial-gradient(circle at 18% 10%, rgba(251, 146, 60, 0.2), transparent 26%), radial-gradient(circle at 85% 18%, rgba(245, 158, 11, 0.14), transparent 24%), radial-gradient(circle at 48% 82%, rgba(249, 115, 22, 0.12), transparent 28%), linear-gradient(180deg, #fff8ef 0%, #fff1df 52%, #f7ead8 100%)',
  }

  return (
    <HashRouter>
      <div className="site-shell min-h-screen transition-colors duration-500" style={pageStyle}>
        <div aria-hidden="true" className="atmosphere-layer">
          <div className="atmosphere-orb atmosphere-orb-a" />
          <div className="atmosphere-orb atmosphere-orb-b" />
          <div className="atmosphere-orb atmosphere-orb-c" />
        </div>

        <div aria-hidden="true" className="grain-overlay" />

        <header
          className={`site-header sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500 ${
            isDark ? 'border-white/8 bg-stone-950/60' : 'border-stone-900/8 bg-white/68'
          }`}
        >
          <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="brand-monogram">MJ</div>
              <div className="leading-tight">
                <div className={`font-semibold tracking-[0.08em] ${isDark ? 'text-white' : 'text-stone-950'}`}>
                  Minyu Ji / 吉敏宇
                </div>
                <div className={`text-xs tracking-[0.14em] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  AI 应用开发 / AI 全栈 / AI 产品
                </div>
              </div>
            </div>

            <nav className="site-nav flex flex-wrap items-center gap-2 text-sm">
              <NavLink className="nav-link" to="/">About</NavLink>
              <NavLink className="nav-link" to="/projects">Projects</NavLink>
              <NavLink className="nav-link" to="/lab">Lab</NavLink>
              <NavLink className="nav-link" to="/resume">Resume</NavLink>
              <a className="nav-link" href="https://mj-portfolio-gray.vercel.app/#/" target="_blank" rel="noreferrer">Global</a>
              <a className="nav-link" href="https://mj-portfolio.jx15996596656.workers.dev" target="_blank" rel="noreferrer">国内</a>
              <a className="nav-link" href="https://github.com/Andrew-JX/" target="_blank" rel="noreferrer">GitHub</a>
            </nav>
          </div>
        </header>

        <main className="site-main mx-auto max-w-[1240px] px-5 py-7 sm:px-6 sm:py-10">
          <AppRoutes />
        </main>

        <footer className={`site-footer border-t transition-colors duration-500 ${isDark ? 'border-white/8' : 'border-stone-900/10'}`}>
          <div
            className={`mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-8 text-sm sm:px-6 ${
              isDark ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="dot-live" />
              <span>Portfolio / AI App / AI Full-stack / Product</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://mj-portfolio-gray.vercel.app/#/" target="_blank" rel="noreferrer">Global site</a>
              <a href="https://mj-portfolio.jx15996596656.workers.dev" target="_blank" rel="noreferrer">国内访问</a>
            </div>
            <div>© {new Date().getFullYear()} Minyu Ji</div>
          </div>
        </footer>

        <TorchToggle />
      </div>
    </HashRouter>
  )
}
