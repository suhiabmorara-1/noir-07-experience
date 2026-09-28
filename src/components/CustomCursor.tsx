import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function CustomCursor({ disabled = false }: { disabled?: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled || !dotRef.current || !ringRef.current) return

    const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.16, ease: 'power3.out' })
    const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.16, ease: 'power3.out' })
    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.55, ease: 'power3.out' })
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.55, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      const active = Boolean(target.closest('a, button, [data-cursor="focus"]'))
      gsap.to(ringRef.current, {
        scale: active ? 2.05 : 1,
        opacity: active ? 0.72 : 0.42,
        duration: 0.35,
        ease: 'power3.out',
      })
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
    }
  }, [disabled])

  if (disabled) return null

  return (
    <div className="cursor-layer" aria-hidden="true">
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-dot" ref={dotRef} />
    </div>
  )
}
