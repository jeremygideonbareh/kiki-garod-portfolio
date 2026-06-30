"use client"

import { useEffect, useState } from "react"

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    let frameId: number

    const handleMouse = (e: MouseEvent) => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY })
      })
    }

    window.addEventListener("mousemove", handleMouse, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouse)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return position
}
