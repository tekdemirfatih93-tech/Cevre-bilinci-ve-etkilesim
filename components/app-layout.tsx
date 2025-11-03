"use client"

import type React from "react"
import { BottomNav } from "./bottom-nav"
import { MobileHeader } from "./mobile-header"
import { LiveSupportChat } from "./live-support-chat"
import { useAuth } from "@/app/auth/context"
import Link from "next/link"

interface AppLayoutProps {
  children: React.ReactNode
  currentTab: string
  onTabChange: (tab: string) => void
}

export function AppLayout({ children, currentTab, onTabChange }: AppLayoutProps) {
  const { user } = useAuth()

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <MobileHeader currentTab={currentTab} />

      {user?.isAdmin && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-blue-700">Admin Paneli: </span>
          <Link href="/admin" className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline">
            Yönetici Paneli
          </Link>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      <LiveSupportChat />

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={onTabChange} />
    </div>
  )
}
