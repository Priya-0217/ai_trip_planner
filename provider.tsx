"use client"

import React, { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import Header from "./app/_components/header"

type ProviderProps = {
  children: ReactNode
}

function Provider({ children }: ProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <Header />
      {children}
    </ThemeProvider>
  )
}

export default Provider
