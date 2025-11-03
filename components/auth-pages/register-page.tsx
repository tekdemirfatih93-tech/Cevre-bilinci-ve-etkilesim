"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/app/auth/context"

export function RegisterPage({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Lütfen tüm alanları doldurunuz")
      }
      if (password !== confirmPassword) {
        throw new Error("Şifreler eşleşmiyor")
      }
      if (password.length < 6) {
        throw new Error("Şifre en az 6 karakter olmalı")
      }

      await register(name, email, password)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız oldu")
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
            <p className="text-gray-600">Çevre bilinci topluluğuna katıl</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Zaten hesabın var mı?{" "}
              <button
                onClick={() => setEmail("existing@demo.com")}
                className="text-green-600 hover:underline font-medium"
              >
                Giriş yap
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
