"use client"

import { useState } from "react"
import { improveText, translateText, detectLanguage } from "@/lib/ai-helper"

interface AIResponseEditorProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
}

export function AIResponseEditor({
  value,
  onChange,
  onSend,
  placeholder = "Yanıtınızı yazın...",
  disabled = false,
}: AIResponseEditorProps) {
  const [isImproving, setIsImproving] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [showTranslateMenu, setShowTranslateMenu] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null)
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const [showTranslationPopup, setShowTranslationPopup] = useState(false)

  // Dil tespiti yap
  const checkLanguage = () => {
    if (value.trim()) {
      const lang = detectLanguage(value)
      setDetectedLanguage(lang)
      return lang
    }
    return null
  }

  // Metni iyileştir
  const handleImprove = async () => {
    if (!value.trim()) return

    setIsImproving(true)
    try {
      const improved = await improveText({
        text: value,
        tone: "professional",
      })
      onChange(improved)
    } catch (error) {
      console.error("İyileştirme hatası:", error)
      alert("Metin iyileştirilemedi")
    } finally {
      setIsImproving(false)
    }
  }

  // Çevir
  const handleTranslate = async (targetLang: string) => {
    if (!value.trim()) return

    setIsTranslating(true)
    setShowTranslateMenu(false)

    try {
      const translated = await translateText({
        text: value,
        targetLanguage: targetLang,
      })
      setTranslatedText(translated)
      setShowTranslationPopup(true)
    } catch (error) {
      console.error("Çeviri hatası:", error)
      alert("Çeviri yapılamadı")
    } finally {
      setIsTranslating(false)
    }
  }

  // Çeviriyi kullan
  const useTranslation = () => {
    if (translatedText) {
      onChange(translatedText)
      setShowTranslationPopup(false)
      setTranslatedText(null)
    }
  }

  const languages = [
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "en", name: "İngilizce", flag: "🇬🇧" },
    { code: "ar", name: "Arapça", flag: "🇸🇦" },
    { code: "de", name: "Almanca", flag: "🇩🇪" },
    { code: "fr", name: "Fransızca", flag: "🇫🇷" },
    { code: "es", name: "İspanyolca", flag: "🇪🇸" },
  ]

  return (
    <div className="space-y-2">
      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          checkLanguage()
        }}
        placeholder={placeholder}
        rows={4}
        disabled={disabled}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
      />

      {/* AI Butonları */}
      <div className="flex flex-wrap gap-2">
        {/* İyileştir */}
        <button
          onClick={handleImprove}
          disabled={!value.trim() || isImproving || disabled}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-700 rounded text-xs font-semibold hover:bg-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isImproving ? "⏳" : "✨"} İyileştir
        </button>

        {/* Çevir Menüsü */}
        <div className="relative">
          <button
            onClick={() => setShowTranslateMenu(!showTranslateMenu)}
            disabled={!value.trim() || isTranslating || disabled}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-700 rounded text-xs font-semibold hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTranslating ? "⏳" : "🌐"} Çevir
          </button>

          {/* Dil Seçimi Dropdown */}
          {showTranslateMenu && (
            <div className="absolute bottom-full left-0 mb-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[150px]">
              <div className="p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleTranslate(lang.code)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-secondary/50 rounded flex items-center gap-2 transition-colors"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dil Tespiti Badge */}
        {detectedLanguage && detectedLanguage !== "tr" && (
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-700 rounded text-xs">
            🔍 Yabancı dil tespit edildi
          </div>
        )}

        {/* Gönder */}
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="ml-auto px-4 py-1.5 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Gönder
        </button>
      </div>

      {/* Çeviri Popup */}
      {showTranslationPopup && translatedText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border max-w-lg w-full p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">🌐 Çeviri Sonucu</h3>
              <button
                onClick={() => {
                  setShowTranslationPopup(false)
                  setTranslatedText(null)
                }}
                className="text-lg hover:text-destructive transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Orijinal */}
            <div className="p-3 bg-background rounded-lg">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Orijinal:</p>
              <p className="text-sm">{value}</p>
            </div>

            {/* Çeviri */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs font-semibold text-primary mb-1">Çeviri:</p>
              <p className="text-sm">{translatedText}</p>
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex gap-2">
              <button
                onClick={useTranslation}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                Çeviriyi Kullan
              </button>
              <button
                onClick={() => {
                  setShowTranslationPopup(false)
                  setTranslatedText(null)
                }}
                className="flex-1 bg-background border border-border rounded-lg py-2 text-xs font-semibold hover:bg-secondary/30 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
