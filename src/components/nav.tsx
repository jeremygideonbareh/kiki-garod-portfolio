"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useScroll, useReducedMotion } from "motion/react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

const menuItemVariants = {
  hidden: { y: 48, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.1 * i,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
  exit: {
    y: 48,
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest > window.innerHeight * 0.85)
    })
    return () => unsubscribe()
  }, [scrollY])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])

  return (
    <>
      {/* Floating glass pill nav */}
      <motion.nav
        initial={false}
        animate={{
          y: isVisible ? 0 : -120,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.5,
          ease: "easeInOut",
        }}
        className={cn(
          "fixed top-4 left-1/2 z-50 -translate-x-1/2",
          "flex items-center justify-between",
          "w-[calc(100%-2rem)] max-w-5xl",
          "rounded-full border border-white/10 bg-black/60 backdrop-blur-xl",
          "px-6 py-3",
          !isVisible && "pointer-events-none",
        )}
      >
        {/* Logo */}
        <a
          href="#"
          className="text-sm font-bold tracking-[0.2em] text-foreground"
        >
          KIKI GAROD
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={toggleMenu}
          className="relative z-50 flex md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </motion.nav>

      {/* Fullscreen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/95 backdrop-blur-2xl"
          >
            <ul className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) =>
                prefersReducedMotion ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      className="font-heading text-5xl text-foreground transition-colors hover:text-amber-400/80 md:text-7xl"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <motion.li
                    key={link.label}
                    custom={i}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      className="font-heading text-5xl text-foreground transition-colors hover:text-amber-400/80 md:text-7xl"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ),
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
