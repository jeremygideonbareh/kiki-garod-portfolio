"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "motion/react"
import type { Film } from "@/types"
import { useLenis } from "@/components/lenis-provider"

interface HorizontalGalleryProps {
  films: Film[]
}

export function HorizontalGallery({ films }: HorizontalGalleryProps) {
  const prefersReducedMotion = useReducedMotion()
  const lenis = useLenis()

  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const setCardRef = useCallback((el: HTMLDivElement | null, index: number) => {
    cardsRef.current[index] = el
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || films.length === 0) return

    const totalWidth = track.scrollWidth - window.innerWidth
    if (totalWidth <= 0) return

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const rawIndex = self.progress * films.length
            const currentIndex = Math.min(Math.round(rawIndex), films.length - 1)
            setActiveIndex(currentIndex)

            if (indicatorRef.current) {
              indicatorRef.current.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(films.length).padStart(2, "0")}`
            }

            cardsRef.current.forEach((card, i) => {
              if (!card) return
              const distance = Math.abs(i - rawIndex)
              const blur = Math.min(distance * 5, 12)
              const scale = 1 - Math.min(distance * 0.05, 0.1)
              card.style.filter = `blur(${blur}px)`
              card.style.transform = `scale(${scale})`
            })
          },
        },
      })
    })

    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
    }
  }, [films, prefersReducedMotion])

  const handleCTAClick = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [lenis])

  if (prefersReducedMotion) {
    return (
      <section className="overflow-x-auto bg-background">
        <div className="flex">
          {films.map((film, index) => (
          <div
            key={film.id}
            id={`film-${film.id}`}
            className="relative w-screen min-h-[100dvh] flex-shrink-0 overflow-hidden"
          >
            <img
              src={film.stills[0]}
              alt={film.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="relative z-10 flex h-full min-h-[100dvh] flex-col justify-end p-8 md:p-16 pb-24">
              <p className="text-sm tracking-[0.2em] text-white/60 mb-2 font-sans">
                {film.year} &middot; {film.type}
              </p>
              <h2 className="font-heading text-5xl md:text-8xl text-white leading-[0.95]">
                {film.title}
              </h2>
            </div>
          </div>
        ))}
        <div className="flex w-screen min-h-[100dvh] flex-shrink-0 items-center justify-center bg-background p-8">
            <div className="text-center max-w-lg">
              <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-4 leading-[1.1]">
                View Selected Work
              </h2>
              <p className="text-muted-foreground mb-8 font-sans text-lg">
                Explore the complete filmography of Kiki Garod
              </p>
              <button
                onClick={handleCTAClick}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-medium text-foreground tracking-wider transition-all hover:bg-white/10 hover:border-white/40"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-background"
      style={{ minHeight: "100dvh" }}
    >
      <div ref={trackRef} className="flex will-change-transform">
        {films.map((film, index) => (
          <div
            key={film.id}
            id={`film-${film.id}`}
            ref={(el) => setCardRef(el, index)}
            className="relative w-screen flex-shrink-0 overflow-hidden"
            style={{
              minHeight: "100dvh",
              filter: "blur(0px)",
              transform: "scale(1)",
              transition:
                "filter 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <img
              src={film.stills[0]}
              alt={film.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="relative z-10 flex h-full min-h-[100dvh] flex-col justify-end p-8 md:p-16 pb-24">
              <p className="text-sm tracking-[0.2em] text-white/60 mb-2 font-sans">
                {film.year} &middot; {film.type}
              </p>
              <h2 className="font-heading text-5xl md:text-8xl text-white leading-[0.95]">
                {film.title}
              </h2>
            </div>
          </div>
        ))}
        <div className="flex w-screen min-h-[100dvh] flex-shrink-0 items-center justify-center bg-background p-8">
          <div className="text-center max-w-lg">
            <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-4 leading-[1.1]">
              View Selected Work
            </h2>
            <p className="text-muted-foreground mb-8 font-sans text-lg">
              Explore the complete filmography of Kiki Garod
            </p>
            <button
              onClick={handleCTAClick}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-medium text-foreground tracking-wider transition-all hover:bg-white/10 hover:border-white/40"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-8 right-8 z-20">
        <span
          ref={indicatorRef}
          className="font-mono text-sm tracking-[0.15em] text-white/60"
        >
          01 / {String(films.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  )
}
