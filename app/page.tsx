"use client"

import { AppLayout } from "@/components/app-layout"
import { HomePage } from "@/components/pages/home-page"
import { MapPage } from "@/components/pages/map-page"
import { EventsPage } from "@/components/pages/events-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { LoginPage } from "@/components/auth-pages/login-page"
import { RegisterPage } from "@/components/auth-pages/register-page"
import { useAuth } from "@/app/auth/context"
import { useState } from "react"

export default function Home() {
  const [currentTab, setCurrentTab] = useState("home")
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null)
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return authMode === "register" ? (
      <RegisterPage onSuccess={() => setAuthMode(null)} />
    ) : (
      <LoginPage onSuccess={() => setAuthMode(null)} />
    )
  }

  const renderPage = () => {
    switch (currentTab) {
      case "home":
        return <HomePage />
      case "map":
        return <MapPage />
      case "events":
        return <EventsPage />
      case "profile":
        return <ProfilePage />
      default:
        return <HomePage />
    }
  }

  return (
    <AppLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderPage()}
    </AppLayout>
  )
}
