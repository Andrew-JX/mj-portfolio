import { useEffect, useRef, useState } from 'react'
import { HashRouter, NavLink } from 'react-router-dom'
import AppRoutes from '@/router'
import TorchToggle from '@/components/TorchToggle'
import { useTheme } from '@/composables/useTheme'

const NAV_LINKS = [
  { to: '/', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/lab', label: 'Lab' },
  { to: '/tooluse', label: '工具分享' },
  { to: '/resume', label: 'Resume' },
]

export default function App() {
  const { isDark } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [menuOpen])
  const pageStyle = { background: 'var(--bg)' }

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
          ref={headerRef}
          className={`site-header sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500 ${
            isDark ? 'border-white/8 bg-stone-950/60' : 'border-stone-900/8 bg-white/68'
          }`}
        >
          <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="brand-monogram">MJ</div>
                <div className="leading-tight">
                  <div className={`font-semibold tracking-[0.08em] ${isDark ? 'text-white' : 'text-stone-950'}`}>
                    Minyu Ji / 吉敏宇
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mobile-menu-button lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-panel"
                aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                  {menuOpen ? (
                    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  ) : (
                    <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>

            <nav className="site-nav hidden lg:flex flex-wrap items-center justify-center gap-2 text-sm">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} className="nav-link" to={to}>
                  {label}
                </NavLink>
              ))}
              <a className="nav-link" href="https://github.com/Andrew-JX/" target="_blank" rel="noreferrer">GitHub</a>
            </nav>
          </div>

          {menuOpen && (
            <nav id="mobile-nav-panel" className="mobile-menu-panel lg:hidden" aria-label="站点导航">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} className="nav-link" to={to} onClick={() => setMenuOpen(false)}>
                  {label}
                </NavLink>
              ))}
              <a
                className="nav-link"
                href="https://github.com/Andrew-JX/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                GitHub
              </a>
            </nav>
          )}
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
              <a href="https://jimmyuuu.com" target="_blank" rel="noreferrer">jimmyuuu.com</a>
              <a href="https://mj-portfolio-gray.vercel.app/#/" target="_blank" rel="noreferrer">Mirror · Vercel</a>
              <a href="https://mj-portfolio.jx15996596656.workers.dev" target="_blank" rel="noreferrer">Mirror · Cloudflare</a>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span>版权所有 © {new Date().getFullYear()} 吉敏宇</span>
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
                苏ICP备2026054660号-1
              </a>
            </div>
          </div>
        </footer>

        <TorchToggle />
      </div>
    </HashRouter>
  )
}
