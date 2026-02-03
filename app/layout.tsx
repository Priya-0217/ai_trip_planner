import type { Metadata } from "next"
import { Outfit, MonteCarlo } from "next/font/google"
import "./globals.css"
import Provider from "@/provider"
import AuthListener from "@/app/_components/AuthListener"
import AuthModal from "./_components/auth/authmodal"


const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
})

const monteCarlo = MonteCarlo({
  variable: "--font-monte-carlo",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
})

export const metadata: Metadata = {
  title: "Trip Planner AI",
  description: "AI-powered trip planning assistant",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${monteCarlo.variable} antialiased`}
      >
        <Provider>
          <AuthListener />
          <AuthModal />
          {children}
        </Provider>
      </body>
    </html>
  )
}