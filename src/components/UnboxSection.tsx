import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type UnboxCard = {
  kicker: string
  title: string
  paragraphs: string[]
}

const FLAPS = ['front', 'back', 'left', 'right'] as const

// 开盒：滚动带动纸盒掀开，卡片逐张升起，左侧文字随之切换
export default function UnboxSection({ cards }: { cards: UnboxCard[] }) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const items = [...cards.map((card) => ({ kicker: card.kicker, title: card.title })), { kicker: 'Next stop', title: '下一站' }]

  useEffect(() => {
    const section = sectionRef.current
    if (!section || reducedMotion) return undefined

    const context = gsap.context(() => {
      const box = section.querySelector('[data-unbox-box]')
      const panels = gsap.utils.toArray<HTMLElement>('[data-unbox-panel]')
      const cardEls = gsap.utils.toArray<HTMLElement>('[data-unbox-card]')
      const flap = (name: string) => section.querySelector(`[data-unbox-flap="${name}"]`)
      const mobile = () => window.innerWidth < 900
      const spread = () => (mobile() ? 104 : 190)
      const rise = () => (mobile() ? -190 : -320)

      gsap.set(panels.slice(1), { autoAlpha: 0, y: 24 })
      gsap.set(cardEls, { y: 40, scale: 0.45, rotate: 0, autoAlpha: 0, zIndex: 1 })
      FLAPS.forEach((name) => gsap.set(flap(name), { '--flap': '-90deg' }))

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
      })

      tl.fromTo(box, { y: 90, rotateX: -34, rotateY: -46, scale: 0.82 }, { y: 0, rotateX: -22, rotateY: -32, scale: 1, duration: 1.2, ease: 'power2.out' }, 0)
        .to(box, { rotateY: -14, duration: 8.8 }, 1.2)
        .fromTo(section.querySelectorAll('[data-unbox-word]'),
          { transformOrigin: 'top left', yPercent: -10, xPercent: 40, scaleY: 0.1, scaleX: 0.85, rotate: 8, opacity: 0 },
          { yPercent: 0, xPercent: 0, scaleY: 1, scaleX: 1, rotate: 0, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.72)', stagger: 0.12 }, 0)
        .to(flap('front'), { '--flap': '-226deg', duration: 1.1, ease: 'back.out(1.6)' }, 1.0)
        .to(flap('back'), { '--flap': '-226deg', duration: 1.1, ease: 'back.out(1.6)' }, 1.15)
        .to(flap('left'), { '--flap': '-206deg', duration: 1.0, ease: 'back.out(1.6)' }, 1.7)
        .to(flap('right'), { '--flap': '-206deg', duration: 1.0, ease: 'back.out(1.6)' }, 1.8)
        .to(panels[0], { autoAlpha: 0, y: -24, duration: 0.4 }, 2.8)

      cardEls.forEach((card, index) => {
        const at = 3 + index * 2
        const offset = index - (cardEls.length - 1) / 2
        // 先在盒子后面升起，越过盒口后换到盒子前面
        tl.to(card, { autoAlpha: 1, duration: 0.15 }, at)
          .set(card, { zIndex: 3 }, at + 0.55)
          .to(card, {
            x: () => offset * spread(),
            y: () => rise() + Math.abs(offset) * 26,
            rotate: offset * 7,
            scale: mobile() ? 0.8 : 1,
            duration: 1.2,
            ease: 'back.out(1.4)',
          }, at)
        const panel = panels[index + 1]
        if (!panel) return
        tl.to(panel, { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.4)
        if (index < cardEls.length - 1) tl.to(panel, { autoAlpha: 0, y: -24, duration: 0.4 }, at + 1.8)
      })
      tl.to({}, { duration: 1 })
    }, section)

    return () => context.revert()
  }, [reducedMotion])

  return (
    <section ref={sectionRef} className={`unbox ${reducedMotion ? 'unbox-static' : ''}`} aria-label="What's inside">
      <div className="unbox-stage">
        <div className="unbox-copy">
          <div className="section-title">What's inside / 开盒</div>
          <div className="unbox-panels">
            <div className="unbox-panel" data-unbox-panel>
              <h2 className="display-subhead unbox-title" aria-label="Open the box.">
                {'Open the box.'.split(' ').map((word, index) => (
                  <span key={`${word}-${index}`} data-unbox-word aria-hidden="true">{word}</span>
                ))}
              </h2>
              <p className="unbox-lead">往下滚动，拆开我现在手上的事。</p>
            </div>
            {cards.map((card) => (
              <article key={card.title} className="unbox-panel" data-unbox-panel>
                <div className="narrative-kicker">{card.kicker}</div>
                <h3 className="unbox-panel-title">{card.title}</h3>
                {card.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </article>
            ))}
            <div className="unbox-panel" data-unbox-panel>
              <div className="narrative-kicker">Next stop</div>
              <h3 className="unbox-panel-title">下一站</h3>
              <div className="narrative-actions">
                <Link className="button-primary" to="/lab">进入 Lab</Link>
                <Link className="button-secondary" to="/projects">查看项目列表</Link>
                <Link className="button-secondary" to="/tooluse">工具分享</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="unbox-scene" aria-hidden="true">
          <div className="unbox-cards">
            {items.map((item, index) => (
              <div key={item.title} className="unbox-card" data-unbox-card>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.title}</strong>
                <small>{item.kicker}</small>
              </div>
            ))}
          </div>
          <div className="unbox-box-wrap">
            <div className="unbox-box" data-unbox-box>
              <div className="unbox-face unbox-bottom" />
              <div className="unbox-face unbox-inner" />
              <div className="unbox-face unbox-back" />
              <div className="unbox-face unbox-left" />
              <div className="unbox-face unbox-right">
                <span className="unbox-label">Handle with curiosity</span>
                <span className="unbox-barcode" />
              </div>
              <div className="unbox-face unbox-front">
                <span className="unbox-label">MJ / Work in progress</span>
                <span className="unbox-year">2026</span>
                <span className="unbox-stamp">Fragile · ideas</span>
                <span className="unbox-arrows">↑↑ This side up</span>
              </div>
              {FLAPS.map((name) => (
                <div key={name} className={`unbox-flap unbox-flap-${name}`} data-unbox-flap={name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
