"use client"

import { useState } from "react"
import { translateText, detectLanguage } from "@/lib/ai-helper"

interface TranslateButtonProps {
  text: string
  onTranslate?: (translatedText: string) => void
  compact?: boolean
}

export function TranslateButton({ text, onTranslate, compact = false }: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  const [isTranslated, setIsTranslated] = useState(false)

  const handleTranslate = async () => {
    if (isTranslated) {
      // Orijinale dön
      setIsTranslated(false)
      if (onTranslate) {
        onTranslate(text) // Orijinal metni geri gönder
      }
      return
    }

    setIsTranslating(true)
    try {
      const translated = await translateText({
        text,
        targetLanguage: "tr",
      })
      
      console.log("Çeviri başarılı:", { original: text, translated })
      
      if (onTranslate && translated && translated !== text) {
        onTranslate(translated)
        setIsTranslated(true)
      } else {
        console.warn("Çeviri aynı metni döndürdü")
      }
    } catch (error) {
      console.error("Çeviri hatası:", error)
      alert("Çeviri yapılamadı. Lütfen tekrar deneyin.")
    } finally {
      setIsTranslating(false)
    }
  }

  // Eğer zaten Türkçe ise gösterme
  const lang = detectLanguage(text)
  if (lang === "tr") {
    return null
  }

  return (
    <button
      onClick={handleTranslate}
      disabled={isTranslating}
      className={`${
        compact ? "text-xs px-1.5 py-0.5" : "text-xs px-2 py-1"
      } bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full font-medium hover:bg-blue-500/20 transition-colors disabled:opacity-50 flex items-center gap-0.5 flex-shrink-0 whitespace-nowrap`}
      title={isTranslated ? "Orijinali göster" : "Türkçe'ye çevir"}
    >
      {isTranslating ? (
        <>
          <span className="animate-spin">⏳</span>
          <span className="hidden sm:inline">Çevriliyor</span>
        </>
      ) : isTranslated ? (
        <>
          <span>🔄</span>
          <span className="hidden sm:inline">Orijinal</span>
        </>
      ) : (
        <>
          <span>🌐</span>
          <span className="hidden sm:inline">Çevir</span>
        </>
      )}
    </button>
  )
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "İngilizce",
    ar: "Arapça",
    de: "Almanca",
    fr: "Fransızca",
    es: "İspanyolca",
    ru: "Rusça",
    tr: "Türkçe",
  }
  return languages[code] || code.toUpperCase()
}
