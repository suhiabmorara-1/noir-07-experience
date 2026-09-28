import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import type { ProductInteractionState } from '../three/ProductControls'

interface CustomCursorProps {
  disabled?: boolean
  productState?: ProductInteractionState
}

export function CustomCursor({ disabled = false, productState = 'idle' }: CustomCursorProps) {
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

  useEffect(() => {
    if (disabled || !ringRef.current || !dotRef.current) return
    const productActive = productState !== 'idle'
    gsap.to(ringRef.current, {
      opacity: productActive ? 0.9 : 0.42,
      scale: 1,
      duration: 0.35,
      ease: 'power3.out',
    })
    gsap.to(dotRef.current, {
      opacity: productActive ? 0 : 1,
      duration: 0.24,
      ease: 'power2.out',
    })
  }, [disabled, productState])

  if (disabled) return null

  return (
    <div
      className={`cursor-layer ${productState !== 'idle' ? 'cursor-layer--product' : ''}`}
      aria-hidden="true"
    >
      <div
        className={`cursor-ring ${productState !== 'idle' ? 'cursor-ring--product' : ''} ${productState === 'dragging' ? 'cursor-ring--dragging' : ''}`}
        ref={ringRef}
      >
        {productState !== 'idle' && (
          <span className="cursor-ring__label">
            {productState === 'dragging' ? 'حرّك' : 'اسحب'}
          </span>
        )}
      </div>
      <div className="cursor-dot" ref={dotRef} />
    </div>
  )
}
