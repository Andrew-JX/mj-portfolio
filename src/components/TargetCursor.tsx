import { useEffect, useState } from 'react'

type CursorState = {
  x: number
  y: number
  width: number
  height: number
  active: boolean
  visible: boolean
}

const idleSize = 34

export default function TargetCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    width: idleSize,
    height: idleSize,
    active: false,
    visible: false,
  })

  useEffect(() => {
    let target: HTMLElement | null = null
    let frame = 0
    let pointer = { x: 0, y: 0 }

    const update = () => {
      frame = 0

      if (target) {
        const rect = target.getBoundingClientRect()
        setCursor({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width + 18,
          height: rect.height + 18,
          active: true,
          visible: true,
        })
        return
      }

      setCursor({
        x: pointer.x,
        y: pointer.y,
        width: idleSize,
        height: idleSize,
        active: false,
        visible: true,
      })
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      const nextTarget = (event.target as Element | null)?.closest<HTMLElement>('[data-target-cursor]') ?? null
      target = nextTarget
      requestUpdate()
    }

    const handlePointerLeave = () => {
      target = null
      setCursor((current) => ({ ...current, active: false, visible: false }))
    }

    const handleScroll = () => {
      if (target) requestUpdate()
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className={`target-cursor ${cursor.visible ? 'target-cursor-visible' : ''} ${cursor.active ? 'target-cursor-active' : ''}`}
      style={{
        transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate(-50%, -50%)`,
        width: cursor.width,
        height: cursor.height,
      }}
    >
      <span className="target-cursor-corner target-cursor-corner-tl" />
      <span className="target-cursor-corner target-cursor-corner-tr" />
      <span className="target-cursor-corner target-cursor-corner-br" />
      <span className="target-cursor-corner target-cursor-corner-bl" />
    </div>
  )
}
