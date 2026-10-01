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

      // Cover: left edge tracks car's screen CENTER at all times.
      // car center screen-X = car-wrap.left(0) + car_x + carW/2
      //   start: -carW + carW/2 = -carW/2
      //   end:    W   + carW/2
      // Both cover and car travel exactly (W + carW) px → zero drift.
      const coverStart = carStart + carW / 2   // = -carW/2  (banner overflow:hidden clips it)
      const coverEnd   = carEnd   + carW / 2   // = W + carW/2

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

          {/* Green banner — now full width so text never clips.
              The .road-right overlay masks the right half with road colour. */}
          <div className="headline-banner" ref={headlineRef}>
            <span className="headline-text">W&nbsp;E&nbsp;L&nbsp;C&nbsp;O&nbsp;M&nbsp;E&nbsp;&nbsp;I&nbsp;T&nbsp;Z&nbsp;F&nbsp;I&nbsp;Z&nbsp;Z</span>
            {/* Moving reveal cover — tracks the car, reveals text left→right */}
            <div className="text-cover" ref={coverRef} />
          </div>

          {/* Black road overlay on right half — sits above the green banner
              but below the car, maintaining the road/banner visual split */}
          <div className="road-right" />

          {/* Car */}
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
