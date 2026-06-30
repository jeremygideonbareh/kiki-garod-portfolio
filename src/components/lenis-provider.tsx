"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type LenisContextType = Lenis | null

const LenisContext = createContext<LenisContextType>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    gsap.ticker.lagSmoothing(0)

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    setLenis(instance)

    instance.on("scroll", () => ScrollTrigger.update())

    function raf(time: number) {
      instance.raf(time)
    }

    gsap.ticker.add(raf)

    return () => {
      gsap.ticker.remove(raf)
      instance.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
