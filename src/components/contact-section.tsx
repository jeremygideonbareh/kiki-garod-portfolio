"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"
import { Camera, Video, Clapperboard, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com/kikigarod",
    icon: Camera,
  },
  {
    label: "Vimeo",
    href: "https://vimeo.com/kikigarod",
    icon: Video,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@kikigarod",
    icon: Clapperboard,
  },
  {
    label: "Email",
    href: "mailto:hello@kikigarod.com",
    icon: Mail,
  },
]

export function ContactSection() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Two transforms for the whole content block instead of per-element
  const contentY = useTransform(scrollYProgress, [0, 0.4], [80, 0])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1])

  return (
    <section ref={sectionRef} className="bg-background py-20 md:py-32">
      <motion.div
        ref={contentRef}
        className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
        style={
          prefersReducedMotion
            ? undefined
            : { y: contentY, opacity: contentOpacity }
        }
      >
        {/* Big heading */}
        <h2 className="font-heading text-[clamp(2.5rem,8vw,6rem)] leading-[1.05] tracking-tight text-foreground">
          Let&rsquo;s Create
          <br />
          Something
        </h2>

        {/* Subtext */}
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground md:text-xl">
          Based in Shillong, Meghalaya — available for commissions worldwide.
        </p>

        {/* CTAs */}
        <div className="mt-8 md:mt-10 flex flex-col items-center gap-3 md:flex-row md:gap-4">
          <Button
            variant="default"
            size="lg"
            className="h-11 w-full rounded-xl px-8 text-sm font-medium tracking-wide md:w-auto"
            onClick={() => {
              window.location.href = "mailto:hello@kikigarod.com"
            }}
          >
            Start a Project
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-11 w-full rounded-xl border-white/10 px-8 text-sm font-medium tracking-wide md:w-auto"
            onClick={() => {
              window.location.href = "mailto:hello@kikigarod.com?subject=CV%20Request"
            }}
          >
            Request CV
          </Button>
        </div>

        {/* Social links row */}
        <div className="mt-12 md:mt-16 flex items-center gap-6">
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-all duration-300 hover:border-accent/40 hover:text-accent hover:bg-accent/5"
                aria-label={link.label}
              >
                <Icon className="h-5 w-5" />
              </a>
            )
          })}
        </div>

        {/* Footer */}
        <p className="mt-16 md:mt-20 font-sans text-xs text-muted-foreground/50">
          &copy; 2026 Kiki Garod Studio. Crafted in the Khasi Hills.
        </p>
      </motion.div>
    </section>
  )
}
