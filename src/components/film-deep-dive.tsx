"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Film } from "@/types"
import { useLenis } from "@/components/lenis-provider"
import { Button } from "@/components/ui/button"

interface FilmDeepDiveProps {
  films: Film[]
}

export function FilmDeepDive({ films }: FilmDeepDiveProps) {
  const prefersReducedMotion = useReducedMotion()
  const lenis = useLenis()
  const [isMobile, setIsMobile] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  const [currentFilm, setCurrentFilm] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const setSlideRef = useCallback((el: HTMLDivElement | null, index: number) => {
    slidesRef.current[index] = el
  }, [])

  const setPanelRef = useCallback((el: HTMLDivElement | null, index: number) => {
    panelRefs.current[index] = el
  }, [])

  // GSAP horizontal scroll
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return

    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || films.length === 0) return

    const totalWidth = track.scrollWidth - window.innerWidth
    if (totalWidth <= 0) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "film-deep-dive",
          trigger: section,
          pin: true,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const rawIndex = self.progress * films.length
            const index = Math.min(Math.round(rawIndex), films.length - 1)
            setCurrentFilm(index)

            // Update counter
            if (counterRef.current) {
              counterRef.current.textContent = `${String(index + 1).padStart(2, "0")}/${String(films.length).padStart(2, "0")}`
            }

            // Update progress bar
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`
            }

            // Animate info panels: each panel slides in as its slide becomes active
            const activeSlideIndex = Math.floor(self.progress * films.length)
            panelRefs.current.forEach((panel, i) => {
              if (!panel) return
              const slideStart = i / films.length
              const slideEnd = (i + 1) / films.length
              const localProgress = gsap.utils.clamp(
                0,
                1,
                ((self.progress - slideStart) / (slideEnd - slideStart) - 0.05) / 0.35,
              )
              panel.style.opacity = String(localProgress)
              panel.style.transform = `translateX(${60 * (1 - localProgress)}px)`
            })
          },
        },
      })

      tl.to(track, {
        x: -totalWidth,
        ease: "none",
      })
    })

    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
    }
  }, [films, prefersReducedMotion])

  const navigateToFilm = useCallback(
    (index: number) => {
      if (!lenis || !sectionRef.current || isAnimating) return
      const targetIndex = gsap.utils.clamp(0, films.length - 1, index)
      if (targetIndex === currentFilm) return

      setIsAnimating(true)

      const st = ScrollTrigger.getById("film-deep-dive")
      if (!st) {
        setIsAnimating(false)
        return
      }

      const scrollStart = sectionRef.current.offsetTop
      const scrollDistance = Number(st.end) - Number(st.start) || 0
      const targetProgress = targetIndex / films.length
      const targetY = scrollStart + scrollDistance * targetProgress

      lenis.scrollTo(targetY, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          setIsAnimating(false)
        },
      })
    },
    [lenis, currentFilm, films.length, isAnimating],
  )

  const handlePrev = useCallback(() => {
    navigateToFilm(currentFilm - 1)
  }, [navigateToFilm, currentFilm])

  const handleNext = useCallback(() => {
    navigateToFilm(currentFilm + 1)
  }, [navigateToFilm, currentFilm])

  const hasPrev = currentFilm > 0
  const hasNext = currentFilm < films.length - 1

  // Reduced motion / Mobile: vertical stack fallback
  if (prefersReducedMotion || isMobile) {
    return (
      <section className="bg-background">
        <div className="flex flex-col">
          {films.map((film, index) => (
            <div
              key={film.id}
              className="relative min-h-[80dvh] overflow-hidden"
            >
              <img
                src={film.stills[0]}
                alt={film.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              <div className="relative z-10 flex h-full min-h-[80dvh] items-center p-6">
                <div className="max-w-lg">
                  <div className="flex items-center gap-3 text-xs tracking-[0.15em] text-white/60 font-sans mb-3">
                    <span>{film.year}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{film.type}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{film.duration}</span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-6xl text-white leading-[1.05] mb-4">
                    {film.title}
                  </h2>
                  <p className="text-sm text-white/70 font-sans leading-relaxed mb-6">
                    {film.synopsis}
                  </p>
                  {film.awards.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {film.awards.map((award, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 tracking-wide"
                        >
                          {award}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" size="lg" className="h-10 rounded-xl text-xs px-6">
                    Watch Trailer
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
      {/* Horizontal track */}
      <div ref={trackRef} className="flex will-change-transform">
        {films.map((film, index) => (
          <div
            key={film.id}
            ref={(el) => setSlideRef(el, index)}
            className="relative w-screen flex-shrink-0 overflow-hidden"
            style={{ minHeight: "100dvh" }}
          >
            {/* Full-bleed background image */}
            <img
              src={film.stills[0]}
              alt={film.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            {/* Info panel */}
            <div
              ref={(el) => setPanelRef(el, index)}
              className="relative z-10 flex h-full min-h-[100dvh] items-center p-6 md:p-16"
              style={{
                opacity: 0,
                transform: "translateX(60px)",
                transition:
                  "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div className="max-w-lg">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-sm tracking-[0.15em] text-white/60 font-sans mb-3">
                  <span>{film.year}</span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>{film.type}</span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>{film.duration}</span>
                </div>

                {/* Title */}
                <h2 className="font-heading text-5xl md:text-6xl text-white leading-[1.05] mb-4">
                  {film.title}
                </h2>

                {/* Synopsis */}
                <p className="text-base text-white/70 font-sans leading-relaxed mb-6">
                  {film.synopsis}
                </p>

                {/* Awards */}
                {film.awards.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {film.awards.map((award, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: 0.3 + i * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 tracking-wide"
                      >
                        {award}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <Button variant="outline" size="lg">
                  Watch Trailer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10">
        <div
          ref={progressBarRef}
          className="h-full origin-left bg-white/60"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-6 rounded-full border border-white/10 bg-black/80 px-4 py-2 backdrop-blur-md">
          {/* Prev button */}
          <button
            onClick={handlePrev}
            disabled={!hasPrev || isAnimating}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-all hover:text-white hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Previous film"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Counter */}
          <span
            ref={counterRef}
            className="font-mono text-xs tracking-[0.15em] text-white/60 min-w-[48px] text-center"
          >
            01/{String(films.length).padStart(2, "0")}
          </span>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={!hasNext || isAnimating}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-all hover:text-white hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Next film"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
