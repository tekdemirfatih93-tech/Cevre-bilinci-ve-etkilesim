"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/app/auth/context"

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!email || !password) {
        throw new Error("Lütfen tüm alanları doldurunuz")
      }
      if (!email.includes("@")) {
        throw new Error("Geçerli bir email girin")
      }

      await login(email, password)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız oldu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-green-700">Çevre & Özgürlük</h1>
            <p className="text-gray-600">Çevre bilinci topluluğuna hoş geldin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hesabın yok mu?{" "}
              <button onClick={() => setEmail("demo@demo.com")} className="text-green-600 hover:underline font-medium">
                Kayıt ol
              </button>
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500 mb-3">Demo kullanıcılar:</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setEmail("user@demo.com")
                  setPassword("demo123")
                }}
                className="w-full px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
              >
                Kullanıcı Demo
              </button>
              <button
                onClick={() => {
                  setEmail("admin@cevre.com")
                  setPassword("admin123")
                }}
                className="w-full px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
