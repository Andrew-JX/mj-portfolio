import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 保留每章的自然高度，只在前章最后一屏与后章第一屏之间翻面。
export function useAboutCube(pageRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const page = pageRef.current
    const header = document.querySelector<HTMLElement>('.site-header')
    if (!page || !header) return
    const sections = Array.from(page.querySelectorAll<HTMLElement>('[data-about-cube-section]'))
    const viewports = sections.map((section) => section.querySelector<HTMLElement>('.about-cube-viewport')!)
    const faces = viewports.map((viewport) => viewport.firstElementChild as HTMLElement)
    const measureHeader = () => {
      page.style.setProperty('--about-header-height', `${header.offsetHeight}px`)
    }
    measureHeader()
    const observer = new ResizeObserver(measureHeader)
    observer.observe(header)

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const reset = (index: number) => {
        viewports[index].classList.remove('about-cube-turning')
        for (const property of ['--cube-height', '--cube-depth', '--cube-retreat', '--cube-angle', '--cube-offset', '--cube-shade', '--cube-origin', '--cube-crop-top', '--cube-crop-bottom']) {
          viewports[index].style.removeProperty(property)
        }
      }
      const renderFace = (index: number, progress: number, incoming: boolean) => {
        const height = Math.max(1, window.innerHeight - header.offsetHeight)
        const cropTop = incoming ? 0 : Math.max(0, faces[index].offsetHeight - height)
        const values = {
          '--cube-height': `${height}px`,
          '--cube-depth': `${height / 2}px`,
          '--cube-retreat': `${Math.sin(progress * Math.PI) * height * 0.18}px`,
          '--cube-angle': `${(progress - (incoming ? 1 : 0)) * 90}deg`,
          '--cube-offset': `${(progress - (incoming ? 1 : 0)) * height}px`,
          '--cube-origin': `${cropTop + height / 2}px`,
          '--cube-crop-top': `${cropTop}px`,
          '--cube-crop-bottom': `${Math.max(0, faces[index].offsetHeight - cropTop - height)}px`,
          '--cube-shade': `${(incoming ? 1 - progress : progress) * 0.55}`,
        }
        Object.entries(values).forEach(([property, value]) => viewports[index].style.setProperty(property, value))
        viewports[index].classList.add('about-cube-turning')
      }
      // 统一渲染，避免相邻两段在边界处互相清除样式。
      const render = () => {
        viewports.forEach((_, index) => reset(index))
        const height = Math.max(1, window.innerHeight - header.offsetHeight)
        for (let index = 0; index < sections.length - 1; index++) {
          const bottom = sections[index].getBoundingClientRect().bottom
          const progress = (window.innerHeight - bottom) / height
          if (progress > 0 && progress < 1) {
            renderFace(index, progress, false)
            renderFace(index + 1, progress, true)
            break
          }
        }
      }
      const trigger = ScrollTrigger.create({
        trigger: page,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: render,
        onRefresh: render,
      })
      render()
      return () => {
        trigger.kill()
        viewports.forEach((_, index) => reset(index))
      }
    })
    return () => {
      media.revert()
      observer.disconnect()
      page.style.removeProperty('--about-header-height')
    }
  }, [pageRef])
}
