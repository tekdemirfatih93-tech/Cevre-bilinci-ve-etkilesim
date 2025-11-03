"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { PerformanceData } from "@/lib/performance-utils"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isAdmin?: boolean
  badges: string[]
  rank: "Kullanıcı" | "Aktif Destekçi" | "Moderatör" | "Admin"
  contributionPoints: number
  joinDate: string
  performance?: PerformanceData
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulated authentication - in production use real backend
  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Simulated login
    await new Promise((resolve) => setTimeout(resolve, 500))
    const isAdmin = email === "admin@cevre.com"
    const isModerator = email === "mod@cevre.com"
    const newUser: User = {
      id: Math.random().toString(),
      name: email.split("@")[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isAdmin,
      badges: isAdmin ? ["Admin", "Aktif", "Çevre Savaşçısı"] : isModerator ? ["Moderatör", "Aktif"] : ["Üye", "Aktif"],
      rank: isAdmin ? "Admin" : isModerator ? "Moderatör" : "Kullanıcı",
      contributionPoints: isAdmin ? 95 : isModerator ? 65 : 45,
      joinDate: new Date().toLocaleDateString("tr-TR"),
      performance: (isAdmin || isModerator) ? {
        activeTimeMinutes: isAdmin ? 2400 : 1200,
        repliedComplaints: isAdmin ? 45 : 22,
        resolvedComplaints: isAdmin ? 40 : 18,
        lastActiveDate: new Date().toISOString(),
        performanceScore: isAdmin ? 95 : 72,
        performanceRank: isAdmin ? "Elit" : "Uzman",
      } : undefined,
    }
    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
    setIsLoading(false)
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newUser: User = {
      id: Math.random().toString(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isAdmin: false,
      badges: ["Yeni Üye"],
      rank: "Kullanıcı",
      contributionPoints: 0,
      joinDate: new Date().toLocaleDateString("tr-TR"),
    }
    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
    setIsLoading(false)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
