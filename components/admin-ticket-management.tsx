"use client"

import { useState } from "react"
import { useAuth } from "@/app/auth/context"
import type { Ticket, TicketResponse } from "@/types/support"
import { AIResponseEditor } from "@/components/ai-response-editor"
import { TranslateButton } from "@/components/translate-button"

export function AdminTicketManagement() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TKT-001",
      userId: "USR-001",
      userName: "Ahmet Yılmaz",
      userEmail: "ahmet@example.com",
      subject: "Hesap Doğrulama Sorunu",
      description: "E-posta doğrulama linki çalışmıyor. Tekrar gönderebilir misiniz?",
      category: "Hesap",
      priority: "Orta",
      status: "İnceleniyor",
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
        {
          id: "RSP-002",
          ticketId: "TKT-001",
          sender: "Ahmet Yılmaz",
          senderType: "user",
          message: "Teşekkürler, spam klasöründe buldum!",
          timestamp: "1 gün önce",
        },
      ],
      assignedTo: "admin@cevre.com",
    },
    {
      id: "TKT-002",
      userId: "USR-002",
      userName: "Ayşe Demir",
      userEmail: "ayse@example.com",
      subject: "Uygulama Çökme Sorunu",
      description: "Harita ekranı açılırken uygulama sürekli çöküyor.",
      category: "Teknik",
      priority: "Yüksek",
      status: "Açık",
      createdAt: "1 saat önce",
      updatedAt: "1 saat önce",
      responses: [],
    },
    {
      id: "TKT-003",
      userId: "USR-003",
      userName: "Mehmet Kaya",
      userEmail: "mehmet@example.com",
      subject: "Etkinlik Oluşturma Hakkında",
      description: "Etkinlik oluştururken konum seçimi nasıl yapılıyor?",
      category: "Genel",
      priority: "Düşük",
      status: "Yanıtlandı",
      createdAt: "5 gün önce",
      updatedAt: "4 gün önce",
      responses: [
        {
          id: "RSP-003",
          ticketId: "TKT-003",
          sender: user?.name || "Admin",
          senderType: "admin",
          message: "Etkinlik oluştururken harita üzerinde istediğiniz noktaya tıklayarak konum seçebilirsiniz. Detaylı rehber için Yardım > Etkinlik Oluşturma bölümüne bakabilirsiniz.",
          timestamp: "4 gün önce",
        },
        {
          id: "RSP-004",
          ticketId: "TKT-003",
          sender: "Mehmet Kaya",
          senderType: "user",
          message: "Anladım, çok teşekkürler!",
          timestamp: "4 gün önce",
        },
      ],
      assignedTo: user?.email,
    },
    {
      id: "TKT-004",
      userId: "USR-004",
      userName: "Sarah Wilson",
      userEmail: "sarah@example.com",
      subject: "Cannot upload photos",
      description: "I am trying to upload photos for my complaint but the app keeps showing an error. Can you please help me fix this issue? I have important evidence to share.",
      category: "Teknik",
      priority: "Yüksek",
      status: "Açık",
      createdAt: "30 dakika önce",
      updatedAt: "30 dakika önce",
      responses: [],
    },
  ])

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | Ticket["status"]>("all")
  const [filterPriority, setFilterPriority] = useState<"all" | Ticket["priority"]>("all")
  const [translatedDescriptions, setTranslatedDescriptions] = useState<Record<string, string>>({})
  const [translatedResponses, setTranslatedResponses] = useState<Record<string, string>>({})

  const handleSendResponse = () => {
    if (!responseMessage.trim() || !selectedTicket || !user) return

    const response: TicketResponse = {
      id: `RSP-${Date.now()}`,
      ticketId: selectedTicket.id,
      sender: user.name,
      senderType: "admin",
      message: responseMessage,
      timestamp: "Az önce",
    }

    setTickets(
      tickets.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              responses: [...ticket.responses, response],
              status: "Yanıtlandı",
              updatedAt: "Az önce",
              assignedTo: user.email,
            }
          : ticket
      )
    )

    setSelectedTicket({
      ...selectedTicket,
      responses: [...selectedTicket.responses, response],
      status: "Yanıtlandı",
    })

    setResponseMessage("")
    alert("✅ Yanıt gönderildi!")
  }

  const handleStatusChange = (ticketId: string, newStatus: Ticket["status"]) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus, updatedAt: "Az önce" } : ticket
      )
    )

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus })
    }
  }

  const handleAssignToMe = (ticketId: string) => {
    if (!user) return

    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, assignedTo: user.email, status: "İnceleniyor", updatedAt: "Az önce" }
          : ticket
      )
    )

    alert("✅ Talep size atandı!")
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

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus !== "all" && ticket.status !== filterStatus) return false
    if (filterPriority !== "all" && ticket.priority !== filterPriority) return false
    return true
  })

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Açık").length,
    inReview: tickets.filter((t) => t.status === "İnceleniyor").length,
    answered: tickets.filter((t) => t.status === "Yanıtlandı").length,
    resolved: tickets.filter((t) => t.status === "Çözüldü").length,
  }

  return (
    <div className="space-y-4">
      {/* Header & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card rounded-xl p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Toplam</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Açık</p>
          <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">İnceleniyor</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.inReview}</p>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Yanıtlandı</p>
          <p className="text-2xl font-bold text-green-600">{stats.answered}</p>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Çözüldü</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Durum Filtresi</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tümü</option>
              <option value="Açık">Açık</option>
              <option value="İnceleniyor">İnceleniyor</option>
              <option value="Yanıtlandı">Yanıtlandı</option>
              <option value="Çözüldü">Çözüldü</option>
              <option value="Kapalı">Kapalı</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Öncelik Filtresi</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tümü</option>
              <option value="Düşük">Düşük</option>
              <option value="Orta">Orta</option>
              <option value="Yüksek">Yüksek</option>
              <option value="Acil">Acil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Talepler ({filteredTickets.length})</h4>
        {filteredTickets.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 border border-border text-center">
            <p className="text-2xl mb-2">🎫</p>
            <p className="text-sm text-muted-foreground">Filtre kriterlerine uygun talep bulunamadı</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
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
                    👤 {ticket.userName} ({ticket.userEmail})
                  </p>
                  <p className="text-xs text-primary font-semibold">
                    {ticket.category} • ID: {ticket.id} • {ticket.createdAt}
                  </p>
                  {ticket.assignedTo && (
                    <p className="text-xs text-muted-foreground mt-1">
                      📌 Atanan: {ticket.assignedTo === user?.email ? "Siz" : ticket.assignedTo}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                    className="text-xs px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 font-semibold"
                  >
                    {selectedTicket?.id === ticket.id ? "Gizle" : "Detay"}
                  </button>
                  {!ticket.assignedTo && (
                    <button
                      onClick={() => handleAssignToMe(ticket.id)}
                      className="text-xs px-3 py-1 bg-green-500/10 text-green-700 rounded hover:bg-green-500/20 font-semibold"
                    >
                      Al
                    </button>
                  )}
                </div>
              </div>

              {/* Ticket Description */}
              <div className="p-3 bg-background rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs font-semibold text-muted-foreground">Açıklama:</p>
                  <TranslateButton 
                    text={ticket.description} 
                    compact
                    onTranslate={(translated) => {
                      setTranslatedDescriptions(prev => ({
                        ...prev,
                        [ticket.id]: translated
                      }))
                    }}
                  />
                </div>
                <p className="text-sm break-words">{translatedDescriptions[ticket.id] || ticket.description}</p>
              </div>

              {/* Details & Responses */}
              {selectedTicket?.id === ticket.id && (
                <div className="space-y-3 pt-3 border-t border-border">
                  {/* Status Controls */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <button
                      onClick={() => handleStatusChange(ticket.id, "İnceleniyor")}
                      className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-700 rounded hover:bg-yellow-500/20 font-semibold"
                    >
                      İnceleniyor
                    </button>
                    <button
                      onClick={() => handleStatusChange(ticket.id, "Yanıtlandı")}
                      className="text-xs px-2 py-1 bg-green-500/10 text-green-700 rounded hover:bg-green-500/20 font-semibold"
                    >
                      Yanıtlandı
                    </button>
                    <button
                      onClick={() => handleStatusChange(ticket.id, "Çözüldü")}
                      className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-700 rounded hover:bg-emerald-500/20 font-semibold"
                    >
                      Çöz
                    </button>
                    <button
                      onClick={() => handleStatusChange(ticket.id, "Kapalı")}
                      className="text-xs px-2 py-1 bg-gray-500/10 text-gray-700 rounded hover:bg-gray-500/20 font-semibold"
                    >
                      Kapat
                    </button>
                    <button
                      onClick={() => handleStatusChange(ticket.id, "Açık")}
                      className="text-xs px-2 py-1 bg-blue-500/10 text-blue-700 rounded hover:bg-blue-500/20 font-semibold"
                    >
                      Yeniden Aç
                    </button>
                  </div>

                  {/* Responses */}
                  <div>
                    <p className="text-xs font-semibold mb-2">Yanıtlar ({ticket.responses.length})</p>
                    {ticket.responses.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-2 bg-background rounded-lg">
                        Henüz yanıt yok
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {ticket.responses.map((response) => (
                          <div
                            key={response.id}
                            className={`p-3 rounded-lg ${
                              response.senderType === "admin"
                                ? "bg-primary/10 border border-primary/30"
                                : "bg-background"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold">
                                  {response.senderType === "admin" ? "👨‍💼" : "👤"} {response.sender}
                                </p>
                                <p className="text-xs text-muted-foreground">{response.timestamp}</p>
                              </div>
                              {response.senderType === "user" && (
                                <TranslateButton 
                                  text={response.message} 
                                  compact
                                  onTranslate={(translated) => {
                                    setTranslatedResponses(prev => ({
                                      ...prev,
                                      [response.id]: translated
                                    }))
                                  }}
                                />
                              )}
                            </div>
                            <p className="text-sm break-words">{translatedResponses[response.id] || response.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply Form */}
                  {ticket.status !== "Çözüldü" && ticket.status !== "Kapalı" && (
                    <div className="space-y-2">
                      <AIResponseEditor
                        value={responseMessage}
                        onChange={setResponseMessage}
                        onSend={handleSendResponse}
                        placeholder="Destek yanıtınızı yazın..."
                      />
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
        <p className="text-sm font-semibold mb-2">ℹ️ Ticket Yönetimi Bilgisi</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Yeni talepler "Açık" durumda gelir</li>
          <li>• "Al" butonuyla talebi kendinize atayabilirsiniz</li>
          <li>• Yanıt verdiğinizde otomatik olarak "Yanıtlandı" durumuna geçer</li>
          <li>• Sorun çözüldüğünde "Çöz" veya "Kapat" butonunu kullanın</li>
        </ul>
      </div>
    </div>
  )
}
