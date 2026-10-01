import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import carImg from './assets/car.png'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '58%', label: 'Increase in pick up point use', color: '#6b7a1a', position: 'top-left' },
  { value: '27%', label: 'Increase in pick up point use', color: '#2e3033', position: 'top-right' },
  { value: '23%', label: 'Decreased in customer phone calls', color: '#1a5276', position: 'bottom-left' },
  { value: '40%', label: 'Decreased in customer phone calls', color: '#7d3a0e', position: 'bottom-right' },
]

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const carRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const statRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- On-load animations ---
      // Headline fade+slide in
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
      )

      // Stats stagger in
      gsap.fromTo(
        statRefs.current,
        { opacity: 0, y: 30, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.6,
        }
      )

      // --- Scroll-driven car animation ---
      // Car starts off-screen left (translateX = -110vw)
      // and ends off-screen right (translateX = +110vw)
      gsap.fromTo(
        carRef.current,
        { x: '-110vw' },
        {
          x: '110vw',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="scroll-root" ref={containerRef}>
      {/* ── Sticky viewport ─────────────────────────────── */}
      <div className="sticky-wrap">
        {/* Background */}
        <div className="bg-dark" />

        {/* Road band */}
        <div className="road-band">
          {/* Green headline banner (left half) */}
          <div className="headline-banner" ref={headlineRef}>
            <span className="headline-text">W E L C O M E &nbsp; I T Z F I Z Z</span>
          </div>

          {/* Car riding along the road */}
          <div className="car-wrap" ref={carRef}>
            <img src={carImg} className="car-img" alt="McLaren 720S top view" />
          </div>
        </div>

        {/* Stats grid */}
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
