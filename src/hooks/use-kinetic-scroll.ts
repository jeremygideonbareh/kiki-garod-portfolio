"use client"

import { useScroll, useTransform, useMotionValue, useSpring } from "motion/react"
import { useRef } from "react"
import type { MotionValue } from "motion/react"

export function useKineticScroll({
  inputRange = [0, 1],
  outputRange = [0, 0],
  damping = 30,
  stiffness = 200,
}: {
  inputRange?: [number, number]
  outputRange?: [number, number]
  damping?: number
  stiffness?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const rawValue = useTransform(scrollYProgress, inputRange, outputRange)
  const smoothValue = useSpring(rawValue, { stiffness, damping })

  return { ref, scrollYProgress, smoothValue, rawValue }
}

export function useParallaxSpeed(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100])
  const smoothY = useSpring(y, { stiffness: 200, damping: 30 })

  return { ref, y: smoothY }
}
