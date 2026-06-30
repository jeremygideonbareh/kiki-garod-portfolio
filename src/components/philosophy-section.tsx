"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"

const MOOD_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1446034295857-c39f8844fad4?w=800&q=85",
    alt: "Mist-covered forest path at dawn in Meghalaya",
  },
  {
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=85",
    alt: "Golden sunlight breaking through clouds over hills",
  },
]

const HEADING_TEXT = "Every Frame Is a Story Waiting to Be Told"
const BODY_TEXT =
  "In the hills of Meghalaya, every mist-soaked dawn holds a narrative waiting to be captured. My lens seeks the poetry hidden in the everyday — the quiet rebellions, the ancient rituals, the untold stories of a land suspended between tradition and tomorrow."

export function PhilosophySection() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const words = HEADING_TEXT.split(" ")

  // Single transform for the whole heading instead of per-word
  const headingY = useTransform(scrollYProgress, [0, 1], [40, -40])

  // Parallax for mood images
  const image1Y = useTransform(scrollYProgress, [0, 1], [80, -80])
  const image2Y = useTransform(scrollYProgress, [0, 1], [-60, 60])

  // Quote fade-in
  const quoteOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1])
  const quoteY = useTransform(scrollYProgress, [0.6, 0.85], [40, 0])

  const disableMotion = prefersReducedMotion

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Split layout */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Left — Heading + Body */}
          <div className="space-y-8">
            <h2 className="font-heading text-[clamp(2.5rem,6vw,6rem)] leading-[1.08] tracking-tight text-foreground md:text-7xl lg:text-8xl">
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="mr-[0.2em] inline-block"
                >
                  {word}
                </span>
              ))}
            </h2>

            <motion.p
              className="max-w-lg font-sans text-base leading-relaxed text-muted-foreground md:text-xl"
              initial={disableMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={disableMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              {BODY_TEXT}
            </motion.p>
          </div>

          {/* Right — Mood Images */}
          <div className="relative space-y-4 md:space-y-6">
            <motion.div
              className="overflow-hidden rounded-2xl"
              style={disableMotion ? undefined : { y: image1Y }}
            >
              <img
                src={MOOD_IMAGES[0].src}
                alt={MOOD_IMAGES[0].alt}
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              className="overflow-hidden rounded-2xl"
              style={disableMotion ? undefined : { y: image2Y }}
            >
              <img
                src={MOOD_IMAGES[1].src}
                alt={MOOD_IMAGES[1].alt}
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>

        {/* Quote block */}
        <motion.div
          className="mt-16 md:mt-32 text-center"
          style={
            disableMotion
              ? undefined
              : { opacity: quoteOpacity, y: quoteY }
          }
        >
          <blockquote className="font-heading text-2xl italic leading-snug text-foreground/80 md:text-4xl">
            &ldquo;Every frame is a story waiting to be told.&rdquo;
          </blockquote>
          <p className="mt-4 font-sans text-sm text-muted-foreground md:text-base">
            — Kiki Garod
          </p>
        </motion.div>
      </div>
    </section>
  )
}
