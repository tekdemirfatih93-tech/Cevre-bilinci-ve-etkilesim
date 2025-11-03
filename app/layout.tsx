import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./auth/context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Çevre & Özgürlük - Çevre Bilinci Uygulaması",
  description: "Doğa ve çevre bilincine uygun sosyal ağ uygulaması",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={`font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
