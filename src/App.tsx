import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SmoothScroll } from './components/SmoothScroll'
import { CustomCursor } from './components/CustomCursor'
import { Navigation } from './components/Navigation'
import { IntroLoader } from './components/IntroLoader'
import { StoryPanels } from './components/StoryPanels'
import { useMediaQuery } from './hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

const PerfumeExperience = lazy(async () => {
  const module = await import('./three/PerfumeExperience')
  return { default: module.PerfumeExperience }
})

export default function App() {
  const journeyRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const mobile = useMediaQuery('(max-width: 760px)')
  const coarsePointer = useMediaQuery('(pointer: coarse)')

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1450)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const move = (event: PointerEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useLayoutEffect(() => {
    if (!journeyRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: journeyRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })
    ScrollTrigger.refresh()
    return () => trigger.kill()
  }, [])

  return (
    <SmoothScroll disabled={reducedMotion}>
      <IntroLoader hidden={loaded} />
      <CustomCursor disabled={mobile || coarsePointer || reducedMotion} />
      <Navigation />
      <main ref={journeyRef} className="story-journey">
        <Suspense fallback={<div className="experience-fallback" aria-hidden="true" />}>
          <PerfumeExperience
            progress={progressRef}
            mouse={mouseRef}
            mobile={mobile}
            reducedMotion={reducedMotion}
          />
        </Suspense>
        <StoryPanels reducedMotion={reducedMotion} />
      </main>
      <div className="cinema-vignette" aria-hidden="true" />
      <div className="cinema-grain" aria-hidden="true" />
    </SmoothScroll>
  )
}
