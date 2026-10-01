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
  const coverRef     = useRef<HTMLDivElement>(null)
  const headlineRef  = useRef<HTMLDivElement>(null)
  const statRefs     = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const W = window.innerWidth

      // ── Car dimensions ───────────────────────────────────────────────
      // McLaren 720S PNG: height=144px, aspect ratio ≈ 2.1:1 → width ≈ 302px
      const carW = 302

      // ── Car travel: fully off-screen left → fully off-screen right ──
      // car-wrap is at left:0 in CSS (no horizontal CSS transform).
      // GSAP owns x completely — no conflict.
      // x = -carW  → car is entirely off the left edge (right edge at 0px)
      // x =  W     → car is entirely off the right edge (left edge at W px)
      const carStart = -carW      // enter from left
      const carEnd   =  W         // exit to right
      // Total travel = W + carW (same for cover below → perfect sync)

      // ── On-load: headline fades in ───────────────────────────────────
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
      )

      // ── Scroll timeline: car + cover — PERFECTLY SYNCED ─────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1.0,
        },
      })

      // Car drives left → right
      tl.fromTo(carRef.current, { x: carStart }, { x: carEnd, ease: 'none' }, 0)

      // Cover tracks the car's RIGHT EDGE (not centre).
      // Cover is inside .headline-banner (overflow:hidden) with green background.
      // Its left edge = where the car's right side is on screen.
      //
      // car right-edge screen-X = car_x + carW
      //   start: -302 + 302 = 0   → cover at banner left edge, whole banner green, text hidden ✓
      //   end:    W   + 302       → cover clipped past 50vw boundary, all text revealed ✓
      //
      // Both car and cover travel (W + carW) px → zero drift, perfect sync.
      const coverStart = carStart + carW   // = 0
      const coverEnd   = carEnd   + carW   // = W + carW

      tl.fromTo(
        coverRef.current,
        { x: coverStart },
        { x: coverEnd, ease: 'none' },
        0  // same point in timeline = in perfect lock-step with car
      )

      // ── Stat cards: appear when car reaches screen centre ────────────
      // Car reaches screen centre (x = W/2) at scroll fraction:
      //   f = (W/2 - carStart) / (carEnd - carStart) = (W/2 + carW) / (W + carW)
      // On the 400vh container that maps to scroll position:
      //   300vh × f  (300vh = scrollable range)
      // ScrollTrigger `start` = top + (300vh × f)  as % of 400vh:
      //   = (300 × f) / 400 × 100% of container height
      // Approx ≈ 55-60% for typical screens → use '55% top'
      gsap.set(statRefs.current, { opacity: 0, y: 28, scale: 0.9 })

      gsap.to(statRefs.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.13,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: '55% top',
          toggleActions: 'play none none reverse',
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="scroll-root" ref={containerRef}>
      {/* ── Sticky viewport ──────────────────────────────── */}
      <div className="sticky-wrap">
        <div className="bg-dark" />

        {/* Road band */}
        <div className="road-band">

          {/* Green banner — 50%, overflow:hidden clips the cover inside */}
          <div className="headline-banner" ref={headlineRef}>
            <span className="headline-text">W&nbsp;E&nbsp;L&nbsp;C&nbsp;O&nbsp;M&nbsp;E&nbsp;&nbsp;I&nbsp;T&nbsp;Z&nbsp;F&nbsp;I&nbsp;Z&nbsp;Z</span>

            {/* Cover lives INSIDE the banner so overflow:hidden keeps it from
                bleeding onto the road. Its background is the SAME green as the
                banner — so the ribbon always looks green; only the white text
                underneath is hidden. As it slides right and gets clipped away,
                the text is revealed character by character. */}
            <div className="text-cover" ref={coverRef} />
          </div>

          {/* Car — z-index 5, above banner (1) and cover (2 inside banner) */}
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
