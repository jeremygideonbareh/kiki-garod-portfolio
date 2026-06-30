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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Kinetic scroll — heading moves faster than the subtext
  const headingY = useTransform(scrollYProgress, [0, 0.3], [120, 0])
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const subtextY = useTransform(scrollYProgress, [0, 0.3], [60, 0])
  const subtextOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const ctaOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.2, 0.4], [40, 0])
  const socialOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const socialY = useTransform(scrollYProgress, [0.3, 0.5], [30, 0])
  const footerOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1])

  return (
    <section ref={sectionRef} className="bg-background py-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        {/* Big heading — kinetic scroll */}
        <motion.h2
          className="font-heading text-[clamp(3rem,8vw,6rem)] leading-[1.05] tracking-tight text-foreground"
          style={
            prefersReducedMotion
              ? undefined
              : {
                  y: headingY,
                  opacity: headingOpacity,
                }
          }
        >
          Let&rsquo;s Create
          <br />
          Something
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-muted-foreground md:text-xl"
          style={
            prefersReducedMotion
              ? undefined
              : {
                  y: subtextY,
                  opacity: subtextOpacity,
                }
          }
        >
          Based in Shillong, Meghalaya — available for commissions worldwide.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          style={
            prefersReducedMotion
              ? undefined
              : {
                  y: ctaY,
                  opacity: ctaOpacity,
                }
          }
        >
          <Button
            variant="default"
            size="lg"
            className="h-11 rounded-xl px-8 text-sm font-medium tracking-wide"
            onClick={() => {
              window.location.href = "mailto:hello@kikigarod.com"
            }}
          >
            Start a Project
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-11 rounded-xl border-white/10 px-8 text-sm font-medium tracking-wide"
            onClick={() => {
              window.location.href = "mailto:hello@kikigarod.com?subject=CV%20Request"
            }}
          >
            Request CV
          </Button>
        </motion.div>

        {/* Social links row */}
        <motion.div
          className="mt-16 flex items-center gap-6"
          style={
            prefersReducedMotion
              ? undefined
              : {
                  y: socialY,
                  opacity: socialOpacity,
                }
          }
        >
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
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-20 font-sans text-xs text-muted-foreground/50"
          style={prefersReducedMotion ? undefined : { opacity: footerOpacity }}
        >
          &copy; 2026 Kiki Garod Studio. Crafted in the Khasi Hills.
        </motion.p>
      </div>
    </section>
  )
}
