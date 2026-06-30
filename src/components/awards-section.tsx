"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"
import { awards } from "@/data/films"

function AwardCard({
  award,
  index,
  prefersReducedMotion,
}: {
  award: (typeof awards)[number]
  index: number
  prefersReducedMotion: boolean | null
}) {
  return (
    <motion.article
      className="w-[350px] min-w-[350px] snap-center"
      initial={
        prefersReducedMotion
          ? undefined
          : { opacity: 0, y: 32 }
      }
      whileInView={
        prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      {/* Double-bezel card */}
      <div className="rounded-[2rem] border border-white/5 bg-black/20 p-2">
        <div className="flex flex-col gap-3 rounded-[calc(2rem-0.375rem)] bg-background p-8">
          <span className="font-sans text-xs font-medium tracking-widest uppercase text-accent">
            {award.year}
          </span>

          <h3 className="font-heading text-2xl leading-tight text-foreground">
            {award.title}
          </h3>

          <p className="font-sans text-sm text-muted-foreground">
            {award.festival}
          </p>

          <div className="mt-auto pt-4 border-t border-white/5">
            <p className="font-sans text-xs text-muted-foreground/60">
              Film:{" "}
              <span className="font-medium text-foreground/80">
                {award.film}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function AwardCardMobile({
  award,
  index,
  prefersReducedMotion,
}: {
  award: (typeof awards)[number]
  index: number
  prefersReducedMotion: boolean | null
}) {
  return (
    <motion.article
      initial={
        prefersReducedMotion ? undefined : { opacity: 0, y: 24 }
      }
      whileInView={
        prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
      }
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
    >
      {/* Double-bezel card */}
      <div className="rounded-[2rem] border border-white/5 bg-black/20 p-2">
        <div className="flex flex-col gap-2 rounded-[calc(2rem-0.375rem)] bg-background p-6">
          <span className="font-sans text-xs font-medium tracking-widest uppercase text-accent">
            {award.year}
          </span>

          <h3 className="font-heading text-xl leading-tight text-foreground">
            {award.title}
          </h3>

          <p className="font-sans text-sm text-muted-foreground">
            {award.festival}
          </p>

          <div className="mt-auto pt-3 border-t border-white/5">
            <p className="font-sans text-xs text-muted-foreground/60">
              Film:{" "}
              <span className="font-medium text-foreground/80">
                {award.film}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export function AwardsSection() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])
  const headingY = useTransform(scrollYProgress, [0, 0.15], [40, 0])

  return (
    <section ref={sectionRef} className="bg-secondary py-24">
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
            Recognition
          </span>
          <h2 className="mt-2 font-heading text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl">
            Awards &amp; Accolades
          </h2>
        </motion.div>

        {/* Desktop: horizontal scroll */}
        <div className="hidden md:block">
          <div
            className="-mx-6 flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {awards.map((award, index) => (
              <AwardCard
                key={award.id}
                award={award}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack */}
        <div className="flex flex-col gap-6 md:hidden">
          {awards.map((award, index) => (
            <AwardCardMobile
              key={award.id}
              award={award}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
