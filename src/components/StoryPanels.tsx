import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MagneticButton } from './MagneticButton'

gsap.registerPlugin(ScrollTrigger)

export function StoryPanels({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return
    const context = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.story-panel')
      panels.forEach((panel, index) => {
        const items = panel.querySelectorAll<HTMLElement>('[data-reveal]')
        if (reducedMotion) {
          gsap.set(items, { opacity: 1, y: 0 })
          return
        }

        gsap.fromTo(
          items,
          { opacity: 0, y: index === 0 ? 24 : 54 },
          {
            opacity: 1,
            y: 0,
            duration: 1.35,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: panel,
              start: index === 0 ? 'top 98%' : 'top 68%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        if (index < panels.length - 1) {
          gsap.to(items, {
            opacity: 0,
            y: -32,
            ease: 'power3.in',
            stagger: 0.025,
            scrollTrigger: {
              trigger: panel,
              start: 'bottom 34%',
              end: 'bottom 5%',
              scrub: 0.8,
            },
          })
        }
      })
    }, rootRef)

    return () => context.revert()
  }, [reducedMotion])

  return (
    <div ref={rootRef} className="story-panels">
      <section className="story-panel hero-panel" id="top" aria-labelledby="hero-title">
        <p className="hero-wordmark" aria-hidden="true">بعد منتصف الليل</p>
        <div className="hero-copy panel-content">
          <div className="eyebrow" data-reveal>إصدار 07 · باريس</div>
          <h1 id="hero-title" className="sr-only">NOIR 07 — بعد منتصف الليل</h1>
          <div className="hero-meta" data-reveal>
            <span>NOIR 07</span>
            <span>EXTRAIT DE PARFUM</span>
            <span>75 ML</span>
          </div>
        </div>
        <div className="scroll-cue" data-reveal>
          <span>مرّر لاكتشاف العطر</span>
          <i aria-hidden="true" />
        </div>
        <div className="chapter-index" data-reveal>01 / 07</div>
      </section>

      <section className="story-panel rotation-panel" aria-labelledby="rotation-title">
        <div className="panel-content statement statement--right">
          <span className="eyebrow" data-reveal>THE FIRST ENCOUNTER</span>
          <h2 id="rotation-title">
            <span data-reveal>ليس كل الليل</span>
            <span data-reveal>ظلامًا.</span>
            <em data-reveal>بعضه يُرتدى.</em>
          </h2>
        </div>
        <div className="chapter-index" data-reveal>02 / 07</div>
      </section>

      <section className="story-panel ingredients-panel" id="the-scent" aria-labelledby="ingredients-title">
        <div className="ingredients-heading panel-content">
          <span className="eyebrow" data-reveal>THE SCENT</span>
          <h2 id="ingredients-title" data-reveal>بُني طبقةً<br />بعد طبقة.</h2>
        </div>
        <div className="notes notes--top panel-content" data-reveal>
          <span>01 · المقدمة</span>
          <strong>الفلفل الأسود</strong>
          <strong>البرغموت</strong>
        </div>
        <div className="notes notes--heart panel-content" data-reveal>
          <span>02 · القلب</span>
          <strong>العود</strong>
          <strong>الجلد · البنفسج</strong>
        </div>
        <div className="notes notes--base panel-content" data-reveal>
          <span>03 · القاعدة</span>
          <strong>العنبر</strong>
          <strong>الأرز · الدخان</strong>
        </div>
        <div className="chapter-index" data-reveal>03 / 07</div>
      </section>

      <section className="story-panel object-panel" id="the-object" aria-labelledby="object-title">
        <div className="object-heading panel-content">
          <span className="eyebrow" data-reveal>THE OBJECT</span>
          <h2 id="object-title" data-reveal>هندسة الصمت.</h2>
          <p data-reveal>أربع مواد. قطعة واحدة. حضور لا يحتاج إلى شرح.</p>
        </div>
        <div className="object-callout object-callout--cap panel-content" data-reveal>
          <i />
          <span>01</span>
          <p>غطاء معدني<br />مغناطيسي</p>
        </div>
        <div className="object-callout object-callout--pump panel-content" data-reveal>
          <i />
          <span>02</span>
          <p>نظام رش<br />فائق الدقة</p>
        </div>
        <div className="object-callout object-callout--glass panel-content" data-reveal>
          <i />
          <span>03</span>
          <p>زجاج مدخن<br />بسماكة 8 مم</p>
        </div>
        <div className="object-callout object-callout--mark panel-content" data-reveal>
          <i />
          <span>04</span>
          <p>شعار محفور<br />بدقة ليزرية</p>
        </div>
        <div className="chapter-index" data-reveal>04 / 07</div>
      </section>

      <section className="story-panel macro-panel" aria-labelledby="macro-title">
        <div className="macro-copy panel-content">
          <span className="eyebrow" data-reveal>0.08 MM · MACRO</span>
          <h2 id="macro-title">
            <span data-reveal>التفاصيل التي لا يلاحظها الجميع،</span>
            <em data-reveal>هي ما يصنع الفرق.</em>
          </h2>
        </div>
        <div className="material-spec panel-content" data-reveal>
          <span>SMOKED GLASS</span>
          <span>BLACK TITANIUM</span>
          <span>HAND FINISHED</span>
        </div>
        <div className="chapter-index" data-reveal>05 / 07</div>
      </section>

      <section className="story-panel story-panel--quiet" id="story" aria-labelledby="story-title">
        <div className="quiet-copy panel-content">
          <span className="eyebrow" data-reveal>THE HOURS BETWEEN</span>
          <h2 id="story-title">
            <span data-reveal>صُمم للساعات</span>
            <span data-reveal>التي لا يتذكرها أحد.</span>
          </h2>
          <div className="quiet-body">
            <p data-reveal>NOIR 07 ليس عطرًا للصباح.</p>
            <p data-reveal>إنه للرجل الذي يبدأ يومه<br />عندما تصبح المدينة أكثر هدوءًا.</p>
            <p data-reveal>للطرقات الفارغة. للأحاديث المتأخرة.<br />وللحظات التي لا تحتاج إلى تفسير.</p>
          </div>
        </div>
        <div className="chapter-index" data-reveal>06 / 07</div>
      </section>

      <section className="story-panel final-panel" id="finale" aria-labelledby="final-title">
        <div className="final-copy panel-content">
          <span className="eyebrow" data-reveal>THE NIGHT, BOTTLED</span>
          <h2 id="final-title" data-reveal>NOIR <b>07</b></h2>
          <div className="final-meta" data-reveal>
            <span>EXTRAIT DE PARFUM</span>
            <span>75 ML</span>
          </div>
          <div data-reveal>
            <MagneticButton href="#the-scent">اكتشف NOIR 07</MagneticButton>
          </div>
        </div>
        <div className="final-footer panel-content" data-reveal>
          <span>© 2026 NOIR 07</span>
          <span>PARIS · AFTER DARK</span>
        </div>
        <div className="chapter-index" data-reveal>07 / 07</div>
      </section>
    </div>
  )
}
