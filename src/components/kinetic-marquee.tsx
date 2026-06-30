"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "motion/react"
import type { Film } from "@/types"

interface KineticMarqueeProps {
  films: Film[]
}

function renderMarqueeContent(films: Film[]) {
  return films.map((film, i) => (
    <span key={film.id} className="inline-flex items-center">
      <a
        href={`#film-${film.id}`}
        className="font-heading text-5xl text-foreground/80 transition-colors hover:text-amber-400/70 whitespace-nowrap md:text-6xl"
      >
        {film.title}
      </a>
      {i < films.length - 1 && (
        <span className="mx-6 select-none text-white/10 text-5xl md:mx-8 md:text-6xl">
          ·
        </span>
      )}
    </span>
  ))
}

export function KineticMarquee({ films }: KineticMarqueeProps) {
  const prefersReducedMotion = useReducedMotion()
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    const row1 = row1Ref.current
    const row2 = row2Ref.current
    const container = containerRef.current
    if (!row1 || !row2 || !container) return

    // Row 1 — scroll left
    const tl1 = gsap.to(row1, {
      xPercent: -50,
      duration: 50,
      ease: "none",
      repeat: -1,
    })

    // Row 2 — scroll right (start at -50% so second copy is visible)
    gsap.set(row2, { xPercent: -50 })
    const tl2 = gsap.to(row2, {
      xPercent: 0,
      duration: 50,
      ease: "none",
      repeat: -1,
    })

    // Pause / resume on hover
    const handleMouseEnter = () => {
      tl1.pause()
      tl2.pause()
    }
    const handleMouseLeave = () => {
      tl1.resume()
      tl2.resume()
    }

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      tl1.kill()
      tl2.kill()
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [prefersReducedMotion, films])

  // Static list when reduced motion is preferred
  if (prefersReducedMotion) {
    return (
      <section className="overflow-hidden py-16">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 px-6">
          {films.map((film) => (
            <a
              key={film.id}
              href={`#film-${film.id}`}
              className="font-heading text-3xl text-foreground/70 transition-colors hover:text-amber-400/70 md:text-4xl"
            >
              {film.title}
            </a>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden py-20 md:py-28 cursor-pointer select-none"
    >
      {/* Row 1 — scrolling left */}
      <div className="mb-6 md:mb-8">
        <div ref={row1Ref} className="flex w-max items-center">
          {renderMarqueeContent(films)}
          {renderMarqueeContent(films)}
        </div>
      </div>

      {/* Row 2 — scrolling right */}
      <div>
        <div ref={row2Ref} className="flex w-max items-center">
          {renderMarqueeContent(films)}
          {renderMarqueeContent(films)}
        </div>
      </div>
    </section>
  )
}
