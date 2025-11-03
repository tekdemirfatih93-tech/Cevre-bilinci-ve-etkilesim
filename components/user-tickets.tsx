"use client"

import { useState } from "react"
import { useAuth } from "@/app/auth/context"
import type { Ticket, TicketResponse } from "@/types/support"
import { improveText } from "@/lib/ai-helper"

export function UserTickets() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TKT-001",
      userId: user?.id || "USR-001",
      userName: user?.name || "Demo Kullanıcı",
      userEmail: user?.email || "demo@example.com",
      subject: "Hesap Doğrulama Sorunu",
      description: "E-posta doğrulama linki çalışmıyor. Tekrar gönderebilir misiniz?",
      category: "Hesap",
      priority: "Orta",
      status: "Yanıtlandı",
      createdAt: "3 gün önce",
      updatedAt: "2 gün önce",
      responses: [
        {
          id: "RSP-001",
          ticketId: "TKT-001",
          sender: "Admin Zeynep",
          senderType: "admin",
          message: "Merhaba! Yeni doğrulama linki e-posta adresinize gönderildi. Spam klasörünü kontrol etmeyi unutmayın.",
          timestamp: "2 gün önce",
        },
      ],
      assignedTo: "admin@cevre.com",
    },
  ])

  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "Genel" as Ticket["category"],
    priority: "Orta" as Ticket["priority"],
  })
  const [ticketFiles, setTicketFiles] = useState<{ photos: File[]; video: File | null }>({
    photos: [],
    video: null,
  })
  const [replyMessage, setReplyMessage] = useState("")

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim() || !user) return

    // Konu ve açıklamayı otomatik iyileştir
    const improvedSubject = await improveText({
      text: newTicket.subject,
      tone: "professional",
    })

    const improvedDescription = await improveText({
      text: newTicket.description,
      tone: "professional",
    })

    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      userId: user.id || "USR-001",
      userName: user.name,
      userEmail: user.email,
      subject: improvedSubject,
      description: improvedDescription,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "Açık",
      createdAt: "Az önce",
      updatedAt: "Az önce",
      responses: [],
    }

    setTickets([ticket, ...tickets])
    setNewTicket({
      subject: "",
      description: "",
      category: "Genel",
      priority: "Orta",
    })
    setTicketFiles({ photos: [], video: null })
    setShowNewTicketForm(false)
    alert("✅ Destek talebiniz oluşturuldu! En kısa sürede yanıt alacaksınız.")
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPhotos = Array.from(files).slice(0, 3 - ticketFiles.photos.length)
      setTicketFiles({ ...ticketFiles, photos: [...ticketFiles.photos, ...newPhotos], video: null })
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const video = document.createElement("video")
      video.preload = "metadata"
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        if (video.duration <= 30) {
          setTicketFiles({ photos: [], video: file })
        } else {
          alert("Video süresi maksimum 30 saniye olmalıdır!")
        }
      }
      video.src = URL.createObjectURL(file)
    }
  }

  const removePhoto = (index: number) => {
    setTicketFiles({
      ...ticketFiles,
      photos: ticketFiles.photos.filter((_, i) => i !== index),
    })
  }

  const removeVideo = () => {
    setTicketFiles({ ...ticketFiles, video: null })
  }

  const handleSendReply = async (ticketId: string) => {
    if (!replyMessage.trim() || !user) return

    // Yanıtı otomatik iyileştir
    const improvedMessage = await improveText({
      text: replyMessage,
      tone: "friendly",
    })

    const response: TicketResponse = {
      id: `RSP-${Date.now()}`,
      ticketId,
      sender: user.name,
      senderType: "user",
      message: improvedMessage,
      timestamp: "Az önce",
    }

    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              responses: [...ticket.responses, response],
              updatedAt: "Az önce",
              status: "İnceleniyor",
            }
          : ticket
      )
    )

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        responses: [...selectedTicket.responses, response],
      })
    }

    setReplyMessage("")
    alert("✅ Yanıtınız gönderildi!")
  }

  const getStatusBadge = (status: Ticket["status"]) => {
    const badges = {
      Açık: "bg-blue-500/20 text-blue-700",
      İnceleniyor: "bg-yellow-500/20 text-yellow-700",
      Yanıtlandı: "bg-green-500/20 text-green-700",
      Çözüldü: "bg-emerald-500/20 text-emerald-700",
      Kapalı: "bg-gray-500/20 text-gray-700",
    }
    return badges[status] || badges.Açık
  }

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    const badges = {
      Düşük: "bg-gray-500/20 text-gray-700",
      Orta: "bg-blue-500/20 text-blue-700",
      Yüksek: "bg-orange-500/20 text-orange-700",
      Acil: "bg-red-500/20 text-red-700",
    }
    return badges[priority] || badges.Orta
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">🎫 Destek Taleplerim</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Sorularınız ve sorunlarınız için destek talebi oluşturun
          </p>
        </div>
        <button
          onClick={() => setShowNewTicketForm(!showNewTicketForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          {showNewTicketForm ? "İptal" : "+ Yeni Talep"}
        </button>
      </div>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
          <h4 className="font-semibold text-sm">Yeni Destek Talebi</h4>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Konu *</label>
            <input
              type="text"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              placeholder="Talebinizin konusunu yazın..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Kategori</label>
              <select
                value={newTicket.category}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value as Ticket["category"] })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Teknik">Teknik</option>
                <option value="Hesap">Hesap</option>
                <option value="Genel">Genel</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Öncelik</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as Ticket["priority"] })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Düşük">Düşük</option>
                <option value="Orta">Orta</option>
                <option value="Yüksek">Yüksek</option>
                <option value="Acil">Acil</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Açıklama *</label>
            <textarea
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              placeholder="Sorununuzu veya talebinizi detaylı bir şekilde açıklayın..."
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
              Ekler (Opsiyonel)
            </label>
            <div className="space-y-2">
              {!ticketFiles.video && ticketFiles.photos.length < 3 && (
                <label className="block bg-background border border-border rounded-lg py-2 px-3 text-xs font-semibold text-center cursor-pointer hover:bg-secondary/30 transition-colors">
                  📷 Fotoğraf Ekle (max 3)
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}

              {!ticketFiles.video && ticketFiles.photos.length === 0 && (
                <label className="block bg-background border border-border rounded-lg py-2 px-3 text-xs font-semibold text-center cursor-pointer hover:bg-secondary/30 transition-colors">
                  🎥 Video Ekle (max 30sn)
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                </label>
              )}

              {/* Photo Previews */}
              {ticketFiles.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {ticketFiles.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-border"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        type="button"
                        className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/90"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Video Preview */}
              {ticketFiles.video && (
                <div className="relative">
                  <video
                    src={URL.createObjectURL(ticketFiles.video)}
                    controls
                    className="w-full rounded-lg border border-border"
                  />
                  <button
                    onClick={removeVideo}
                    type="button"
                    className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCreateTicket}
            disabled={!newTicket.subject.trim() || !newTicket.description.trim()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Talep Oluştur
          </button>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-3">
        {tickets.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 border border-border text-center">
            <p className="text-2xl mb-2">🎫</p>
            <p className="text-sm text-muted-foreground">Henüz destek talebiniz yok</p>
            <p className="text-xs text-muted-foreground mt-1">Yeni bir talep oluşturmak için yukarıdaki butonu kullanın</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-card rounded-2xl p-4 border border-border space-y-3">
              {/* Ticket Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{ticket.subject}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getStatusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ticket.category} • ID: {ticket.id} • Oluşturuldu: {ticket.createdAt}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                  className="text-xs px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 font-semibold"
                >
                  {selectedTicket?.id === ticket.id ? "Gizle" : "Detay"}
                </button>
              </div>

              {/* Ticket Description */}
              <div className="p-3 bg-background rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Açıklama:</p>
                <p className="text-sm">{ticket.description}</p>
              </div>

              {/* Responses */}
              {selectedTicket?.id === ticket.id && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <p className="text-xs font-semibold">Yanıtlar ({ticket.responses.length})</p>

                  {ticket.responses.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      Henüz yanıt yok. Destek ekibimiz en kısa sürede dönüş yapacak.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {ticket.responses.map((response) => (
                        <div
                          key={response.id}
                          className={`p-3 rounded-lg ${
                            response.senderType === "admin"
                              ? "bg-accent/10 border border-accent/30"
                              : "bg-background"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold">
                              {response.senderType === "admin" ? "👨‍💼" : "👤"} {response.sender}
                            </p>
                            <p className="text-xs text-muted-foreground">{response.timestamp}</p>
                          </div>
                          <p className="text-sm">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {ticket.status !== "Çözüldü" && ticket.status !== "Kapalı" && (
                    <div className="space-y-2">
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Yanıtınızı yazın..."
                        rows={3}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                      <button
                        onClick={() => handleSendReply(ticket.id)}
                        disabled={!replyMessage.trim()}
                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Yanıt Gönder
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-sm font-semibold mb-2">ℹ️ Destek Talebi Bilgisi</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Destek ekibimiz genellikle 24 saat içinde yanıt verir</li>
          <li>• Acil durumlar için "Acil" önceliğini seçin</li>
          <li>• Hızlı yardım için canlı destek sohbetini de kullanabilirsiniz</li>
        </ul>
      </div>
    </div>
  )
}
