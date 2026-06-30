"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import type { Film } from "@/types"

interface FeaturedFilmsProps {
  films: Film[]
}

function FilmCard({
  film,
  index,
  className,
}: {
  film: Film
  index: number
  className?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [120, -120])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.4, 1, 1, 0.4],
  )

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group ${className ?? ""}`}
    >
      {/* Double-bezel outer wrapper */}
      <div className="h-full w-full rounded-[2rem] border border-white/5 bg-black/20 p-2 transition-all duration-500 group-hover:border-white/15">
        {/* Inner content */}
        <div className="relative h-full w-full overflow-hidden rounded-[calc(2rem-0.375rem)] bg-background">
          {/* Background image */}
          <img
            src={film.stills[0]}
            alt={film.title}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/60" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
            <span className="mb-1 font-sans text-xs tracking-[0.2em] text-white/50">
              {film.year} &middot; {film.type}
            </span>
            <h3 className="font-heading text-2xl text-white leading-[1.1] transition-all duration-500 group-hover:text-3xl md:text-3xl md:group-hover:text-4xl">
              {film.title}
            </h3>
            <p className="mt-2 max-w-md text-sm text-white/60 font-sans line-clamp-2 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {film.synopsis}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturedFilms({ films }: FeaturedFilmsProps) {
  const displayFilms = films.slice(0, 4)

  return (
    <section className="relative overflow-hidden py-32 bg-background">
      {/* Section header */}
      <div className="mx-auto mb-16 max-w-7xl px-6 md:px-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="block font-sans text-xs tracking-[0.3em] text-muted-foreground mb-3"
        >
          SELECTED WORKS
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-heading text-5xl text-foreground leading-[1.05] md:text-7xl"
        >
          Featured Films
        </motion.h2>
      </div>

      {/* Asymmetric grid */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {displayFilms.length === 4 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">
            {/* First film: hero card spanning 2 columns and 2 rows */}
            <div className="min-h-[60dvh] md:col-span-2 md:row-span-2 md:min-h-[70dvh]">
              <FilmCard film={displayFilms[0]} index={0} className="h-full" />
            </div>

            {/* Second film: smaller card on right */}
            <div className="min-h-[30dvh] md:min-h-[34dvh]">
              <FilmCard film={displayFilms[1]} index={1} className="h-full" />
            </div>

            {/* Third film: second row left */}
            <div className="min-h-[30dvh] md:min-h-[34dvh]">
              <FilmCard film={displayFilms[2]} index={2} className="h-full" />
            </div>

            {/* Fourth film: second row right */}
            <div className="min-h-[30dvh] md:min-h-[34dvh]">
              <FilmCard film={displayFilms[3]} index={3} className="h-full" />
            </div>
          </div>
        )}

        {/* Fallback if fewer or more films */}
        {displayFilms.length !== 4 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2">
            {displayFilms.map((film, index) => (
              <div
                key={film.id}
                className="min-h-[40dvh]"
              >
                <FilmCard film={film} index={index} className="h-full" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
