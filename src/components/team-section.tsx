"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"
import { team } from "@/data/films"

function TeamCard({
  member,
  index,
  prefersReducedMotion,
}: {
  member: (typeof team)[number]
  index: number
  prefersReducedMotion: boolean | null
}) {
  return (
    <motion.div
      initial={
        prefersReducedMotion ? undefined : { opacity: 0, y: 40 }
      }
      whileInView={
        prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      {/* Double-bezel card */}
      <div className="group/card rounded-[2rem] border border-white/5 bg-black/20 p-2 transition-colors duration-500 hover:border-accent/30">
        <div className="overflow-hidden rounded-[calc(2rem-0.375rem)] bg-background">
          {/* Portrait */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={member.image}
              alt={member.name}
              className="h-full w-full object-cover transition-all duration-700 ease-out group-hover/card:scale-105 group-hover/card:brightness-110 group-hover/card:saturate-100"
              style={{
                filter:
                  "grayscale(60%) saturate(60%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter =
                  "grayscale(0%) saturate(100%)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter =
                  "grayscale(60%) saturate(60%)"
              }}
              loading="lazy"
            />
            {/* Border glow overlay on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-[calc(2rem-0.375rem)] opacity-0 ring-1 ring-accent/0 transition-all duration-500 group-hover/card:opacity-100 group-hover/card:ring-accent/40" />
          </div>

          {/* Info */}
          <div className="p-5">
            <h3 className="font-heading text-xl leading-tight text-foreground">
              {member.name}
            </h3>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              {member.role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function TeamSection() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const headingOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1])
  const headingY = useTransform(scrollYProgress, [0, 0.12], [40, 0])

  return (
    <section ref={sectionRef} className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <motion.div
          className="mb-16"
          style={
            prefersReducedMotion
              ? undefined
              : { opacity: headingOpacity, y: headingY }
          }
        >
          <span className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
            The People
          </span>
          <h2 className="mt-2 font-heading text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl">
            The Studio
          </h2>
        </motion.div>

        {/* Team grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <TeamCard
              key={member.id}
              member={member}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
