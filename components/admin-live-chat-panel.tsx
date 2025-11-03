"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/app/auth/context"
import type { ChatRoom, LiveChatMessage } from "@/types/support"
import { AIResponseEditor } from "@/components/ai-response-editor"
import { TranslateButton } from "@/components/translate-button"

export function AdminLiveChatPanel() {
  const { user } = useAuth()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: "CHAT-001",
      userId: "USR-001",
      userName: "Ahmet Yılmaz",
      userEmail: "ahmet@example.com",
      status: "waiting",
      messages: [
        {
          id: "MSG-001",
          chatRoomId: "CHAT-001",
          sender: "Bot",
          senderEmail: "bot@system.com",
          senderType: "bot",
          message: "Hoşgeldiniz! Size nasıl yardımcı olabilirim?",
          timestamp: new Date(Date.now() - 300000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          read: true,
        },
        {
          id: "MSG-002",
          chatRoomId: "CHAT-001",
          sender: "Ahmet Yılmaz",
          senderEmail: "ahmet@example.com",
          senderType: "user",
          message: "Merhaba, yardım lazım",
          timestamp: new Date(Date.now() - 120000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          read: false,
        },
      ],
      createdAt: "2 dk önce",
      lastActivity: new Date(Date.now() - 120000).toISOString(),
    },
    {
      id: "CHAT-002",
      userId: "USR-002",
      userName: "Ayşe Demir",
      userEmail: "ayse@example.com",
      status: "active",
      assignedAdmin: user?.email,
      messages: [
        {
          id: "MSG-003",
          chatRoomId: "CHAT-002",
          sender: "Bot",
          senderEmail: "bot@system.com",
          senderType: "bot",
          message: "Hoşgeldiniz!",
          timestamp: new Date(Date.now() - 600000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          read: true,
        },
        {
          id: "MSG-004",
          chatRoomId: "CHAT-002",
          sender: "Ayşe Demir",
          senderEmail: "ayse@example.com",
          senderType: "user",
          message: "Şikayet nasıl yapabilirim?",
          timestamp: new Date(Date.now() - 400000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          read: true,
        },
        {
          id: "MSG-005",
          chatRoomId: "CHAT-002",
          sender: user?.name || "Admin",
          senderEmail: user?.email || "admin@cevre.com",
          senderType: "admin",
          message: "Merhaba! Profil sekmesinden şikayet bölümünü kullanabilirsiniz.",
          timestamp: new Date(Date.now() - 300000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          read: true,
        },
        {
          id: "MSG-006",
          chatRoomId: "CHAT-002",
          sender: "Ayşe Demir",
          senderEmail: "ayse@example.com",
          senderType: "user",
          message: "Teşekkürler!",
          timestamp: new Date(Date.now() - 120000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          read: true,
        },
      ],
      createdAt: "5 dk önce",
      lastActivity: new Date(Date.now() - 120000).toISOString(),
    },
    {
      id: "CHAT-003",
      userId: "USR-003",
      userName: "Mehmet Kaya",
      userEmail: "mehmet@example.com",
      status: "waiting",
      messages: [
        {
          id: "MSG-007",
          chatRoomId: "CHAT-003",
          sender: "Bot",
          senderEmail: "bot@system.com",
          senderType: "bot",
          message: "Hoşgeldiniz!",
          timestamp: new Date(Date.now() - 480000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          read: true,
        },
        {
          id: "MSG-008",
          chatRoomId: "CHAT-003",
          sender: "Mehmet Kaya",
          senderEmail: "mehmet@example.com",
          senderType: "user",
          message: "Etkinliklere nasıl katılabilirim?",
          timestamp: new Date(Date.now() - 180000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          read: false,
        },
      ],
      createdAt: "8 dk önce",
      lastActivity: new Date(Date.now() - 180000).toISOString(),
    },
    {
      id: "CHAT-004",
      userId: "USR-004",
      userName: "Emma Johnson",
      userEmail: "emma@example.com",
      status: "waiting",
      messages: [
        {
          id: "MSG-009",
          chatRoomId: "CHAT-004",
          sender: "Bot",
          senderEmail: "bot@system.com",
          senderType: "bot",
          message: "Hoşgeldiniz!",
          timestamp: new Date(Date.now() - 240000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          read: true,
        },
        {
          id: "MSG-010",
          chatRoomId: "CHAT-004",
          sender: "Emma Johnson",
          senderEmail: "emma@example.com",
          senderType: "user",
          message: "Hello, I need help reporting pollution. How can I submit my complaint?",
          timestamp: new Date(Date.now() - 60000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          read: false,
        },
      ],
      createdAt: "4 dk önce",
      lastActivity: new Date(Date.now() - 60000).toISOString(),
    },
  ])

  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({})
  const [quickResponses] = useState([
    "Şikayet için profil > Şikayet kısmını kullanın",
    "Etkinliklere katılmak için Etkinlikler sekmesine gidin",
    "Konum izni vermek için ayarlarınızı kontrol edin",
    "Daha fazla bilgi için bize ulaşın",
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChatRoom?.messages])

  const handleSelectChat = (chatRoom: ChatRoom) => {
    setSelectedChatRoom(chatRoom)
    
    // Admin müdahale etti - durumu active yap
    if (chatRoom.status === "waiting" && user) {
      setChatRooms(
        chatRooms.map((room) =>
          room.id === chatRoom.id
            ? { ...room, status: "active", assignedAdmin: user.email }
            : room
        )
      )
    }

    // Mesajları okundu olarak işaretle
    setChatRooms(
      chatRooms.map((room) =>
        room.id === chatRoom.id
          ? {
              ...room,
              messages: room.messages.map((msg) => ({ ...msg, read: true })),
            }
          : room
      )
    )
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChatRoom || !user) return

    const newMessage: LiveChatMessage = {
      id: `MSG-${Date.now()}`,
      chatRoomId: selectedChatRoom.id,
      sender: user.name,
      senderEmail: user.email,
      senderType: "admin",
      message: messageInput,
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      read: true,
    }

    setChatRooms(
      chatRooms.map((room) =>
        room.id === selectedChatRoom.id
          ? {
              ...room,
              messages: [...room.messages, newMessage],
              lastActivity: new Date().toISOString(),
              status: "active",
            }
          : room
      )
    )

    setSelectedChatRoom({
      ...selectedChatRoom,
      messages: [...selectedChatRoom.messages, newMessage],
    })

    setMessageInput("")
  }

  const handleQuickResponse = (response: string) => {
    setMessageInput(response)
  }

  const handleClosChat = (chatRoomId: string) => {
    setChatRooms(
      chatRooms.map((room) =>
        room.id === chatRoomId ? { ...room, status: "closed" } : room
      )
    )
    if (selectedChatRoom?.id === chatRoomId) {
      setSelectedChatRoom(null)
    }
    alert("Sohbet kapatıldı!")
  }

  const getUnreadCount = (chatRoom: ChatRoom) => {
    return chatRoom.messages.filter((msg) => !msg.read && msg.senderType === "user").length
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Active Chats List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Aktif Sohbetler ({chatRooms.filter(r => r.status !== "closed").length})</h4>
        {chatRooms
          .filter((room) => room.status !== "closed")
          .map((chatRoom) => {
            const unreadCount = getUnreadCount(chatRoom)
            const lastMessage = chatRoom.messages[chatRoom.messages.length - 1]
            
            return (
              <div
                key={chatRoom.id}
                onClick={() => handleSelectChat(chatRoom)}
                className={`bg-card rounded-xl p-3 border transition-colors cursor-pointer ${
                  selectedChatRoom?.id === chatRoom.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{chatRoom.userName}</p>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          chatRoom.status === "waiting"
                            ? "bg-yellow-500 animate-pulse"
                            : chatRoom.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-500"
                        }`}
                      ></span>
                      {unreadCount > 0 && (
                        <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{chatRoom.userEmail}</p>
                    <p className="text-xs text-foreground mt-1 line-clamp-1">
                      {lastMessage.senderType === "admin" ? "Siz: " : ""}
                      {lastMessage.message}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">{chatRoom.createdAt}</span>
                    {chatRoom.status === "waiting" && (
                      <div className="mt-1">
                        <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                          Bekliyor
                        </span>
                      </div>
                    )}
                    {chatRoom.assignedAdmin && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {chatRoom.assignedAdmin === user?.email ? "Siz" : chatRoom.assignedAdmin}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* Chat Window */}
      <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-[600px]">
        {selectedChatRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{selectedChatRoom.userName} ile sohbet</p>
                <p className="text-xs text-muted-foreground">{selectedChatRoom.userEmail}</p>
                <p className="text-xs text-primary font-semibold">ID: {selectedChatRoom.id}</p>
              </div>
              <button
                onClick={() => handleClosChat(selectedChatRoom.id)}
                className="text-xs bg-destructive/10 text-destructive px-3 py-1 rounded hover:bg-destructive/20 font-semibold"
              >
                Kapat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-background/50">
              {selectedChatRoom.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm md:max-w-md rounded-lg px-3 py-2 ${
                      msg.senderType === "admin"
                        ? "bg-primary text-primary-foreground"
                        : msg.senderType === "bot"
                          ? "bg-secondary/50 text-foreground"
                          : "bg-accent/20 text-foreground"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      {msg.senderType !== "admin" && (
                        <p className="text-xs font-semibold">
                          {msg.senderType === "bot" ? "🤖 " : "👤 "}
                          {msg.sender}
                        </p>
                      )}
                      {msg.senderType === "user" && (
                        <TranslateButton 
                          text={msg.message} 
                          compact
                          onTranslate={(translated) => {
                            setTranslatedMessages(prev => ({
                              ...prev,
                              [msg.id]: translated
                            }))
                          }}
                        />
                      )}
                    </div>
                    <p className="text-sm break-words">{translatedMessages[msg.id] || msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.senderType === "admin" ? "opacity-70" : "text-muted-foreground"}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Responses */}
            <div className="p-2 border-t border-border bg-secondary/20">
              <p className="text-xs font-semibold mb-2 px-1">Hızlı Yanıtlar:</p>
              <div className="grid grid-cols-2 gap-1">
                {quickResponses.map((response, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickResponse(response)}
                    className="text-left p-1.5 bg-background hover:bg-secondary/50 rounded text-xs transition-colors line-clamp-2"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-2 border-t border-border">
              <AIResponseEditor
                value={messageInput}
                onChange={setMessageInput}
                onSend={handleSendMessage}
                placeholder="Admin yanıtınızı yazın..."
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">💬</p>
              <p className="text-sm">Bir sohbet seçin</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="lg:col-span-2 bg-accent/10 border border-accent/30 rounded-xl p-4">
        <p className="text-sm font-semibold mb-2">ℹ️ Canlı Destek Bilgisi</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Adminler ve moderatörler kullanıcılarla anlık sohbet edebilir</li>
          <li>• Bot ile konuşan kullanıcılara müdahale edebilirsiniz</li>
          <li>• Sohbete katıldığınızda otomatik olarak size atanır</li>
          <li>• Okunmamış mesajlar kırmızı sayı ile gösterilir</li>
        </ul>
      </div>
    </div>
  )
}
