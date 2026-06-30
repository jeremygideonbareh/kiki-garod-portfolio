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
      lerp: 0.08,
      orientation: "vertical",
      smoothWheel: true,
      syncTouch: true,
      touchInertiaExponent: 1.2,
      wheelMultiplier: 1.5,
      touchMultiplier: 2.5,
      overscroll: false,
    })

    setLenis(instance)

    instance.on("scroll", ScrollTrigger.update)

    const tickerCallback: gsap.TickerCallback = (time) => {
      instance.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)

    return () => {
      gsap.ticker.remove(tickerCallback)
      instance.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
