"use client"

import { useState } from "react"
import { useAuth } from "@/app/auth/context"
import { improveText } from "@/lib/ai-helper"

interface SupportMessage {
  id: string
  sender: string
  senderType: "user" | "bot" | "admin"
  text: string
  timestamp: string
}

interface ActiveAdmin {
  id: string
  name: string
  email: string
  status: "online" | "busy" | "offline"
}

export function LiveSupportChat() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [activeMode, setActiveMode] = useState<"community" | "support">("community")
  const [communityMessages, setCommunityMessages] = useState<SupportMessage[]>([
    {
      id: "1",
      sender: "Sistem",
      senderType: "bot",
      text: "Canlı Sohbet'e hoşgeldiniz! Diğer kullanıcılarla burada sohbet edebilirsiniz.",
      timestamp: "09:00",
    },
    {
      id: "2",
      sender: "Ahmet",
      senderType: "user",
      text: "Bugün orman temizliği etkinliğine kim geliyor?",
      timestamp: "09:15",
    },
    {
      id: "3",
      sender: "Ayşe",
      senderType: "user",
      text: "Ben gelicem! Saat kaçta başlıyor?",
      timestamp: "09:20",
    },
  ])
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([
    {
      id: "1",
      sender: "Bot",
      senderType: "bot",
      text: "Hoşgeldiniz! Size nasıl yardımcı olabilirim?",
      timestamp: "10:00",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [connectedAdmin, setConnectedAdmin] = useState<ActiveAdmin | null>(null)
  const [showAdminsList, setShowAdminsList] = useState(false)

  const activeAdmins: ActiveAdmin[] = [
    { id: "1", name: "Admin Zeynep", email: "zeynep@admin.com", status: "online" },
    { id: "2", name: "Moderatör Ali", email: "ali@moderator.com", status: "online" },
    { id: "3", name: "Admin Fatih", email: "fatih@admin.com", status: "busy" },
  ]

  const botResponses: Record<string, string> = {
    merhaba: "Merhaba! Sizi nasıl yardımcı olabilirim?",
    etkinlik: "Etkinlik hakkında soru sormak isterseniz, etkinlikler sekmesine göz atabilirsiniz.",
    şikayet: "Çevre sorunlarını raporlamak için profil sekmesinden şikayet bölümünü kullanabilirsiniz.",
    hava: "Harita sekmesinde hava durumu ve hava kalitesi bilgisini görebilirsiniz.",
    konum: "Uygulamanız izin verdiyseniz konumunuz otomatik olarak takip edilir.",
    rozet: "Rozetler aktif katılımınız için sistem tarafından verilir.",
    admin: "Bir adminle konuşmak isterseniz aşağıda aktif adminleri görebilirsiniz.",
  }

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }
    return "Maalesef bu konuda sizi yardımcı olamıyorum. Lütfen bir adminle konuşmak isterseniz yukarıdaki listeden seçim yapın."
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Metni otomatik iyileştir
    const improvedText = await improveText({
      text: inputValue,
      tone: "friendly",
    })

    const userMessage: SupportMessage = {
      id: String(Date.now()),
      sender: user?.name || "Siz",
      senderType: "user",
      text: improvedText,
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    }

    if (activeMode === "community") {
      setCommunityMessages([...communityMessages, userMessage])
      setInputValue("")
      return
    }

    const messages = supportMessages
    setSupportMessages([...messages, userMessage])

    if (connectedAdmin) {
      const adminMessage: SupportMessage = {
        id: String(Date.now() + 1),
        sender: connectedAdmin.name,
        senderType: "admin",
        text: `Teşekkür ederim. Konunuzu anlıyorum. Nasıl yardımcı olabilirim?`,
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      }
      setTimeout(() => {
        setMessages((prev) => [...prev, adminMessage])
      }, 1000)
    } else {
      const botResponse = getBotResponse(inputValue)
      const botMessage: SupportMessage = {
        id: String(Date.now() + 1),
        sender: "Bot",
        senderType: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      }
      setTimeout(() => {
        setSupportMessages((prev) => [...prev, botMessage])
      }, 500)
    }

    setInputValue("")
  }

  const messages = activeMode === "community" ? communityMessages : supportMessages

  const handleConnectAdmin = (admin: ActiveAdmin) => {
    setConnectedAdmin(admin)
    setShowAdminsList(false)
    setActiveMode("support")
    const systemMessage: SupportMessage = {
      id: String(Date.now()),
      sender: "Sistem",
      senderType: "bot",
      text: `${admin.name} ile bağlantı kuruldu.`,
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    }
    setSupportMessages((prev) => [...prev, systemMessage])
  }

  const handleDisconnectAdmin = () => {
    setConnectedAdmin(null)
    setActiveMode("community")
    const systemMessage: SupportMessage = {
      id: String(Date.now()),
      sender: "Sistem",
      senderType: "bot",
      text: "Admin ile bağlantı kesildi. Ortak sohbete döndünüz.",
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    }
    setSupportMessages((prev) => [...prev, systemMessage])
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
        aria-label="Canlı sohbeti aç"
      >
        💬
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-card border border-border rounded-2xl shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-sm">Canlı Sohbet</h3>
            <p className="text-xs text-muted-foreground">
              {activeMode === "community" ? "Ortak Sohbet Alanı" : connectedAdmin ? `${connectedAdmin.name} ile destek` : "Bot Asistanı"}
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-lg hover:text-destructive transition-colors">
            ✕
          </button>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveMode("community")}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              activeMode === "community"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            }`}
          >
            👥 Ortak Sohbet
          </button>
          <button
            onClick={() => setActiveMode("support")}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              activeMode === "support"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            }`}
          >
            🎫 Destek
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs rounded-lg px-3 py-2 text-xs ${
                msg.senderType === "user"
                  ? "bg-primary text-primary-foreground"
                  : msg.senderType === "admin"
                    ? "bg-accent/20 text-accent"
                    : "bg-secondary/50 text-foreground"
              }`}
            >
              {msg.senderType !== "user" && msg.sender !== "Sistem" && (
                <p className="font-semibold text-xs">{msg.sender}</p>
              )}
              <p>{msg.text}</p>
              <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Admin List */}
      {showAdminsList && !connectedAdmin && activeMode === "support" && (
        <div className="p-3 border-t border-border bg-secondary/20 space-y-2">
          <p className="text-xs font-semibold mb-2">Aktif Adminler:</p>
          {activeAdmins.map((admin) => (
            <button
              key={admin.id}
              onClick={() => handleConnectAdmin(admin)}
              className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${
                admin.status === "online"
                  ? "bg-green-500/10 hover:bg-green-500/20 text-green-700"
                  : admin.status === "busy"
                    ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700"
                    : "bg-gray-500/10 text-gray-700 cursor-not-allowed"
              } ${admin.status === "offline" ? "opacity-50" : ""}`}
              disabled={admin.status === "offline"}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    admin.status === "online"
                      ? "bg-green-500"
                      : admin.status === "busy"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                  }`}
                ></span>
                <span className="flex-1">{admin.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-border flex gap-2">
        {!connectedAdmin && activeMode === "support" ? (
          <button
            onClick={() => setShowAdminsList(!showAdminsList)}
            className="px-3 py-2 bg-accent/10 text-accent rounded text-xs font-semibold hover:bg-accent/20 transition-colors flex-shrink-0"
          >
            Admin
          </button>
        ) : connectedAdmin ? (
          <button
            onClick={handleDisconnectAdmin}
            className="px-3 py-2 bg-destructive/10 text-destructive rounded text-xs font-semibold hover:bg-destructive/20 transition-colors flex-shrink-0"
          >
            Kapat
          </button>
        ) : null}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Mesaj yazın..."
          className="flex-1 bg-background border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground"
        />
        <button
          onClick={handleSendMessage}
          className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          Gönder
        </button>
      </div>
    </div>
  )
}
