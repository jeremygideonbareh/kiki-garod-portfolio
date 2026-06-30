"use client"

import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react"
import { ChevronDown } from "lucide-react"
import { useParallaxSpeed } from "@/hooks/use-kinetic-scroll"
import { films } from "@/data/films"

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion()

  // Parallax hooks — each element moves at a different speed
  const { ref: headingRef, y: headingY } = useParallaxSpeed(0.25)
  const { ref: subtitleRef, y: subtitleY } = useParallaxSpeed(0.45)
  const { ref: cueRef, y: cueY } = useParallaxSpeed(0.75)
  const { ref: imageRef, y: imageY } = useParallaxSpeed(-0.15)

  // Section-level scroll for opacity fade-out
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  const firstFilm = films[0]
  if (!firstFilm) return null

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center justify-start overflow-hidden bg-[#050505]"
    >
      {/* ---- Hero Image ---- */}
      <div ref={imageRef} className="absolute inset-0 z-0">
        <motion.div
          className="h-full w-full"
          style={{ y: prefersReducedMotion ? 0 : imageY }}
        >
          <motion.img
            src={firstFilm.poster}
            alt=""
            className="h-full w-full object-cover object-[65%_center]"
            initial={{ scale: 1 }}
            animate={prefersReducedMotion ? {} : { scale: 1.08 }}
            transition={{ duration: 15, ease: "easeOut" }}
          />
        </motion.div>
      </div>

      {/* ---- Gradient overlays ---- */}
      {/* Darken the left portion so text remains readable */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
      {/* Vignette at top and bottom */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]/70" />
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ---- Content ---- */}
      <motion.div
        className="relative z-10 flex flex-col items-start px-6 sm:px-12 md:px-16 lg:px-24 max-w-4xl"
        style={{ opacity: prefersReducedMotion ? 1 : sectionOpacity }}
      >
        {/* Heading */}
        <div ref={headingRef} className="overflow-hidden">
          <motion.h1
            style={{ y: prefersReducedMotion ? 0 : headingY }}
            className="font-heading text-[clamp(3rem,10vw,9rem)] leading-none tracking-tight text-foreground"
          >
            KIKI
            <br />
            GAROD
          </motion.h1>
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className="overflow-hidden mt-5 md:mt-6">
          <motion.p
            style={{ y: prefersReducedMotion ? 0 : subtitleY }}
            className="text-base tracking-[0.3em] text-muted-foreground md:text-lg"
          >
            Filmmaker · Storyteller · Shillong
          </motion.p>
        </div>
      </motion.div>

      {/* ---- Scroll Cue ---- */}
      <div
        ref={cueRef}
        className="absolute bottom-10 z-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          style={{ y: prefersReducedMotion ? 0 : cueY }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[0.625rem] tracking-[0.3em] text-muted-foreground uppercase">
            Scroll to explore
          </span>
          {prefersReducedMotion ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
