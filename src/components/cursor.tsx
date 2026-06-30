"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const handleMouseEnter = () => cursor.classList.add("active")
    const handleMouseLeave = () => cursor.classList.remove("active")

    const targets = document.querySelectorAll("a, button, [data-cursor-hover]")
    targets.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  return (
    <motion.div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 mix-blend-difference transition-[width,height,background] duration-300 md:block"
      style={{ x: springX, y: springY }}
    />
  )
}
