import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { AppProvider } from "@/app/context/AppContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sistema ERP - Reembolsos",
  description: "Sistema de gestão empresarial com módulo de reembolsos",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
