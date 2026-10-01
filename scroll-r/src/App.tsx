import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import carImg from './assets/car.png'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '58%', label: 'Increase in pick up point use',       color: '#6b7a1a', position: 'top-left'     },
  { value: '27%', label: 'Increase in pick up point use',       color: '#2e3033', position: 'top-right'    },
  { value: '23%', label: 'Decreased in customer phone calls',   color: '#1a5276', position: 'bottom-left'  },
  { value: '40%', label: 'Decreased in customer phone calls',   color: '#7d3a0e', position: 'bottom-right' },
]

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const carRef       = useRef<HTMLDivElement>(null)
  const ribbonRef    = useRef<HTMLDivElement>(null)
  const statRefs     = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const W    = window.innerWidth
      const carW = 302  // px at height 144px

      // ── The one rule ─────────────────────────────────────────────────
      // Car CENTER  = green ribbon RIGHT EDGE  at all times.
      //
      // Car center starts at x=0 (left screen edge) → ends at x=W (right edge).
      // So ribbon width  starts at 0               → ends at  W.
      //
      // Both animate from 0 → W over the same timeline → perfectly locked.
      //
      // car-wrap.left = 0, so  car center = car_x + carW/2
      //   carStart = -carW/2 → center = 0  ✓
      //   carEnd   = W-carW/2 → center = W ✓

      const carStart = -carW / 2
      const carEnd   =  W - carW / 2

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1.0,
        },
      })

      // Car and ribbon move in exact lockstep — same duration, same position in timeline
      tl.fromTo(carRef.current,    { x: carStart }, { x: carEnd, ease: 'none' }, 0)
      tl.fromTo(ribbonRef.current, { width: 0 },    { width: W,  ease: 'none' }, 0)

      // Stats appear when car is at screen centre (50% progress)
      gsap.set(statRefs.current, { opacity: 0, y: 24, scale: 0.9 })
      gsap.to(statRefs.current, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, stagger: 0.13, ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: '62.5% top',   // 50% car progress ≈ 62.5% of 400vh container
          toggleActions: 'play none none reverse',
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="scroll-root" ref={containerRef}>
      <div className="sticky-wrap">
        <div className="bg-dark" />

        <div className="road-band">

          {/* z-3: text sits in the road, revealed only where the green ribbon covers it */}
          <span className="headline-text">
            W&nbsp;E&nbsp;L&nbsp;C&nbsp;O&nbsp;M&nbsp;E&nbsp;&nbsp;&nbsp;&nbsp;I&nbsp;T&nbsp;Z&nbsp;F&nbsp;I&nbsp;Z&nbsp;Z
          </span>

          {/* z-4: green ribbon — grows from left edge to car centre.
              overflow:hidden clips the text copy inside it to exactly its width. */}
          <div className="green-ribbon" ref={ribbonRef}>
            <span className="headline-text">
              W&nbsp;E&nbsp;L&nbsp;C&nbsp;O&nbsp;M&nbsp;E&nbsp;&nbsp;&nbsp;&nbsp;I&nbsp;T&nbsp;Z&nbsp;F&nbsp;I&nbsp;Z&nbsp;Z
            </span>
          </div>

          {/* z-5: car — left:0, GSAP moves x so center tracks ribbon's right edge */}
          <div className="car-wrap" ref={carRef}>
            <img src={carImg} className="car-img" alt="McLaren 720S top view" />
          </div>

        </div>

        {/* Stat cards */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`stat-card stat-${s.position}`}
              style={{ background: s.color }}
              ref={el => { statRefs.current[i] = el }}
            >
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
