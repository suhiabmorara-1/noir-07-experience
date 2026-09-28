import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'

interface MagneticButtonProps {
  href: string
  children: ReactNode
  className?: string
}

export function MagneticButton({ href, children, className = '' }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  const move = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = ref.current.getBoundingClientRect()
    const x = event.clientX - (box.left + box.width / 2)
    const y = event.clientY - (box.top + box.height / 2)
    gsap.to(ref.current, { x: x * 0.22, y: y * 0.22, duration: 0.45, ease: 'power3.out' })
  }

  const reset = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.36)' })
  }

  return (
    <a
      ref={ref}
      href={href}
      className={`magnetic-button ${className}`}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <span>{children}</span>
      <span className="magnetic-button__line" aria-hidden="true" />
    </a>
  )
}
