"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AppSidebar } from "./app-sidebar"
import { AppTopbar } from "./app-topbar"
import { NotificationSystem } from "./notification-system"
import { GlobalLoader } from "./global-loader"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Durante SSR, renderizar um skeleton para evitar mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-200">
        <div className="flex">
          <div className="sticky top-0 hidden lg:block">
            <div className="h-screen w-64 border-r border-gray-800 bg-black"></div>
          </div>
          <div className="flex-1">
            <div className="hidden lg:block">
              <div className="h-16 border-b border-gray-800 bg-black"></div>
            </div>
            <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
              {/* Skeleton do conteúdo */}
            </main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <div className="lg:hidden">
        <AppTopbar onOpenSidebar={() => setMobileOpen(true)} />
      </div>

      <div className="flex">
        {/* Sidebar Desktop */}
        <div className="sticky top-0 hidden lg:block">
          <AppSidebar initialCollapsed={false} onToggle={() => {}} />
        </div>

        {/* Sidebar Mobile */}
        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <AppSidebar initialCollapsed={false} onToggle={() => {}} />
            </div>
          </>
        )}

        <div className="flex-1">
          {/* Topbar Desktop */}
          <div className="hidden lg:block">
            <AppTopbar />
          </div>

          <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>

      {/* Sistema de Notificações */}
      <NotificationSystem />
      
      {/* Loader Global */}
      <GlobalLoader />
    </div>
  )
}
