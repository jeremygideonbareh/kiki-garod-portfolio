import type { Metadata } from "next"
import { Geist, Geist_Mono, Archivo_Black } from "next/font/google"
import "./globals.css"
import { LenisProvider } from "@/components/lenis-provider"
import { CustomCursor } from "@/components/cursor"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const headingFont = Archivo_Black({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Kiki Garod — Filmmaker",
  description:
    "Kiki Garod is an award-winning filmmaker from Shillong, Meghalaya. A cinematic journey through Khasi stories.",
  openGraph: {
    title: "Kiki Garod — Filmmaker",
    description: "Award-winning filmmaker from Shillong, Meghalaya.",
    type: "website",
    locale: "en_IN",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${headingFont.variable} dark`}>
      <body className="min-h-[100dvh] bg-background text-foreground antialiased">
        <LenisProvider>
          <CustomCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
