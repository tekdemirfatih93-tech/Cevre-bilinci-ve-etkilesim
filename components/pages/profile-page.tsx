"use client"

import { useState } from "react"
import { useAuth } from "@/app/auth/context"

interface Complaint {
  id: string
  title: string
  description: string
  category: string
  status: "Pending" | "In Review" | "Resolved"
  date: string
  attachments: number
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success"
  timestamp: string
  read: boolean
}

interface Ticket {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high"
  status: "open" | "answered" | "closed"
  date: string
  responses: {
    id: string
    from: "user" | "admin"
    text: string
    timestamp: string
  }[]
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [showComplaintForm, setShowComplaintForm] = useState(false)
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "1",
      title: "Ormanda İllegal Kesim",
      description: "Yeşil Park'ta yetkisiz ağaç kesimi gözlenmiştir",
      category: "Orman",
      status: "In Review",
      date: "5 gün önce",
      attachments: 2,
    },
    {
      id: "2",
      title: "Su Kaynağı Kirliliği",
      description: "Nehir kenarında atık bırakma işlemi gözlenmiştir",
      category: "Su",
      status: "Resolved",
      date: "10 gün önce",
      attachments: 1,
    },
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Şikayetiniz Alındı",
      message: "Orman Teşkilatı şikayetinizi incelemektedir",
      type: "info",
      timestamp: "2 saat önce",
      read: false,
    },
    {
      id: "2",
      title: "Etkinlik Başladı",
      message: "Çevre Bilinci Semineri başlamak üzere",
      type: "success",
      timestamp: "1 gün önce",
      read: true,
    },
  ])

  const [newComplaint, setNewComplaint] = useState({
    title: "",
    description: "",
    category: "Genel",
  })
  const [mediaFiles, setMediaFiles] = useState<{ photos: File[]; video: File | null }>({
    photos: [],
    video: null,
  })

  // Ticket System
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TKT-001",
      title: "Uygulama kullanımı hakkında soru",
      description: "Şikayet nasıl açabilirim?",
      category: "Genel",
      priority: "low",
      status: "answered",
      date: "3 gün önce",
      responses: [
        {
          id: "1",
          from: "admin",
          text: "Profil > Şikayet / İhlal Bildir sekmesinden şikayet açabilirsiniz.",
          timestamp: "2 gün önce",
        },
      ],
    },
  ])
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "Genel",
    priority: "medium" as "low" | "medium" | "high",
  })
  const [ticketResponse, setTicketResponse] = useState("")

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPhotos = Array.from(files).slice(0, 3 - mediaFiles.photos.length)
      setMediaFiles({ ...mediaFiles, photos: [...mediaFiles.photos, ...newPhotos], video: null })
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
          setMediaFiles({ photos: [], video: file })
        } else {
          alert("Video süresi maksimum 30 saniye olmalıdır!")
        }
      }
      video.src = URL.createObjectURL(file)
    }
  }

  const removePhoto = (index: number) => {
    setMediaFiles({
      ...mediaFiles,
      photos: mediaFiles.photos.filter((_, i) => i !== index),
    })
  }

  const removeVideo = () => {
    setMediaFiles({ ...mediaFiles, video: null })
  }

  const handleSubmitComplaint = () => {
    if (newComplaint.title && newComplaint.description) {
      const totalAttachments = mediaFiles.photos.length + (mediaFiles.video ? 1 : 0)
      const complaint: Complaint = {
        id: String(Date.now()),
        ...newComplaint,
        status: "Pending",
        date: "az önce",
        attachments: totalAttachments,
      }
      setComplaints([complaint, ...complaints])
      setNewComplaint({ title: "", description: "", category: "Genel" })
      setMediaFiles({ photos: [], video: null })
      setShowComplaintForm(false)
      alert("Şikayetiniz başarıyla gönderildi!")
    }
  }

  const getStatusIcon = (status: Complaint["status"]) => {
    switch (status) {
      case "Pending":
        return "⏳"
      case "In Review":
        return "🔍"
      case "Resolved":
        return "✅"
    }
  }

  const getStatusLabel = (status: Complaint["status"]) => {
    const labels: Record<Complaint["status"], string> = {
      Pending: "Bekleniyor",
      "In Review": "İnceleniyor",
      Resolved: "Çözüldü",
    }
    return labels[status]
  }

  const badgeConfig: Record<string, { icon: string; color: string; label: string }> = {
    Üye: { icon: "👤", color: "bg-blue-500/20 text-blue-700", label: "Üye" },
    Aktif: { icon: "⚡", color: "bg-green-500/20 text-green-700", label: "Aktif Destekçi" },
    Moderatör: { icon: "🛡️", color: "bg-purple-500/20 text-purple-700", label: "Moderatör" },
    Admin: { icon: "👑", color: "bg-red-500/20 text-red-700", label: "Admin" },
    "Çevre Savaşçısı": { icon: "🌍", color: "bg-green-500/20 text-green-700", label: "Çevre Savaşçısı" },
    "Aktif Paylaşan": { icon: "📸", color: "bg-orange-500/20 text-orange-700", label: "Aktif Paylaşan" },
  }

  const rankBadges: Record<string, { icon: string; label: string; color: string }> = {
    Kullanıcı: { icon: "👤", label: "Kullanıcı", color: "bg-gray-500/20 text-gray-700" },
    "Aktif Destekçi": { icon: "⚡", label: "Aktif Destekçi", color: "bg-green-500/20 text-green-700" },
    Moderatör: { icon: "🛡️", label: "Moderatör", color: "bg-blue-500/20 text-blue-700" },
    Admin: { icon: "👑", label: "Admin", color: "bg-red-500/20 text-red-700" },
  }

  const handleLogout = () => {
    logout()
  }

  // Ticket handlers
  const handleCreateTicket = () => {
    if (newTicket.title && newTicket.description) {
      const ticket: Ticket = {
        id: `TKT-${String(Date.now()).slice(-3)}`,
        ...newTicket,
        status: "open",
        date: "az önce",
        responses: [],
      }
      setTickets([ticket, ...tickets])
      setNewTicket({ title: "", description: "", category: "Genel", priority: "medium" })
      setShowTicketForm(false)
      alert("✅ Destek talebi oluşturuldu! Tak Tak ip numarası: " + ticket.id)
    }
  }

  const handleTicketResponse = () => {
    if (ticketResponse.trim() && selectedTicket) {
      const newResponse = {
        id: String(Date.now()),
        from: "user" as const,
        text: ticketResponse,
        timestamp: "az önce",
      }
      setTickets(
        tickets.map((ticket) =>
          ticket.id === selectedTicket.id
            ? { ...ticket, responses: [...ticket.responses, newResponse], status: "open" as const }
            : ticket
        )
      )
      setTicketResponse("")
      alert("Yanıt gönderildi!")
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Profile Info */}
      <div className="bg-card rounded-2xl p-4 border border-border text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-gradient-to-br from-green-400 to-blue-500 text-2xl">
          {user?.avatar ? (
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full rounded-full" />
          ) : (
            "👤"
          )}
        </div>
        <p className="font-bold text-sm mb-1">{user?.name || "Kullanıcı"}</p>
        <p className="text-xs text-muted-foreground mb-2">{user?.email || "Email@example.com"}</p>

        {user?.rank && (
          <div className="flex justify-center mb-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${rankBadges[user.rank]?.color || "bg-gray-500/20 text-gray-700"}`}
            >
              {rankBadges[user.rank]?.icon} {rankBadges[user.rank]?.label || user.rank}
            </span>
          </div>
        )}

        {user?.badges && user.badges.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 justify-center">
            {user.badges.map((badge) => (
              <span
                key={badge}
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${badgeConfig[badge]?.color || "bg-gray-500/20 text-gray-700"}`}
              >
                {badgeConfig[badge]?.icon} {badgeConfig[badge]?.label || badge}
              </span>
            ))}
          </div>
        )}

        {user?.contributionPoints !== undefined && (
          <div className="mb-3 text-xs font-semibold text-primary">Katkı Puanı: {user.contributionPoints}</div>
        )}

        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
          <div className="bg-background rounded-lg p-2">
            <p className="font-bold text-primary">8</p>
            <p className="text-muted-foreground">Paylaşım</p>
          </div>
          <div className="bg-background rounded-lg p-2">
            <p className="font-bold text-primary">24</p>
            <p className="text-muted-foreground">Takipçi</p>
          </div>
          <div className="bg-background rounded-lg p-2">
            <p className="font-bold text-primary">12</p>
            <p className="text-muted-foreground">Etkinlik</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "profile" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          👤 Profil
        </button>
        <button
          onClick={() => setActiveTab("complaints")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "complaints" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          🚨 Şikayet / İhlal Bildir
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "notifications" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          🔔 Bildiriler
        </button>
        <button
          onClick={() => setActiveTab("tickets")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "tickets" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          🎫 Destek Talepleri
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-2">
          <button className="w-full bg-background border border-border rounded-xl py-3 font-semibold text-sm hover:bg-secondary/30 transition-colors flex items-center justify-center gap-2">
            💬 Mesajlar
          </button>
          <button className="w-full bg-background border border-border rounded-xl py-3 font-semibold text-sm hover:bg-secondary/30 transition-colors flex items-center justify-center gap-2">
            ⚙️ Ayarlar
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-destructive/10 border border-destructive/30 text-destructive rounded-xl py-3 font-semibold text-sm hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
          >
            🚪 Çıkış Yap
          </button>
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === "complaints" && (
        <div className="space-y-3">
          <button
            onClick={() => setShowComplaintForm(!showComplaintForm)}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            ➕ Yeni Şikayet
          </button>

          {/* Complaint Form */}
          {showComplaintForm && (
            <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Başlık</label>
                <input
                  type="text"
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                  placeholder="Şikayet başlığı"
                  className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Kategorisi</label>
                <select
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                  className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option>Genel</option>
                  <option>Orman</option>
                  <option>Su</option>
                  <option>Hava</option>
                  <option>Atık</option>
                  <option>Hayvan Refahı</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Açıklama</label>
                <textarea
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  placeholder="Detaylı açıklamayı yazın..."
                  className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground resize-none"
                  rows={4}
                />
              </div>

              {/* Media Upload Section */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Fotoğraf veya Video Ekle
                </label>

                {!mediaFiles.video && mediaFiles.photos.length < 3 && (
                  <div className="flex gap-2">
                    <label className="flex-1 bg-background border border-border rounded-lg py-2 px-3 text-xs font-semibold text-center cursor-pointer hover:bg-secondary/30 transition-colors">
                      📷 Fotoğraf ({mediaFiles.photos.length}/3)
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {!mediaFiles.video && mediaFiles.photos.length === 0 && (
                  <label className="mt-2 block bg-background border border-border rounded-lg py-2 px-3 text-xs font-semibold text-center cursor-pointer hover:bg-secondary/30 transition-colors">
                    🎥 Video Ekle (max 30sn)
                    <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  </label>
                )}

                {/* Photo Previews */}
                {mediaFiles.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {mediaFiles.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-border"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/90"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Video Preview */}
                {mediaFiles.video && (
                  <div className="relative mt-2">
                    <video
                      src={URL.createObjectURL(mediaFiles.video)}
                      controls
                      className="w-full rounded-lg border border-border"
                    />
                    <button
                      onClick={removeVideo}
                      className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                    >
                      ×
                    </button>
                    <p className="text-xs text-muted-foreground mt-1">Video yüklendi</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSubmitComplaint}
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  Gönder
                </button>
                <button
                  onClick={() => setShowComplaintForm(false)}
                  className="flex-1 bg-background border border-border rounded-lg py-2 text-xs font-semibold hover:bg-secondary/30 transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          {/* Complaints List */}
          <div className="space-y-2">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="bg-card rounded-2xl p-3 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-lg">{getStatusIcon(complaint.status)}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{complaint.title}</p>
                      <p className="text-xs text-muted-foreground">{complaint.category}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      complaint.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-700"
                        : complaint.status === "In Review"
                          ? "bg-blue-500/20 text-blue-700"
                          : "bg-green-500/20 text-green-700"
                    }`}
                  >
                    {getStatusLabel(complaint.status)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{complaint.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{complaint.date}</span>
                  {complaint.attachments > 0 && <span>📎 {complaint.attachments} dosya ekli</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-2xl p-3 border ${
                notification.type === "info"
                  ? "bg-blue-500/10 border-blue-500/30"
                  : notification.type === "warning"
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-green-500/10 border-green-500/30"
              } ${!notification.read ? "ring-2 ring-primary/50" : ""}`}
            >
              <div className="flex items-start justify-between mb-1">
                <p className="font-semibold text-sm">{notification.title}</p>
                {!notification.read && <span className="w-2 h-2 bg-primary rounded-full"></span>}
              </div>
              <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
              <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
            </div>
          ))}
        </div>
      )}

      {/* Privacy Info */}
      <div className="bg-background rounded-xl p-3 border border-border text-xs text-muted-foreground text-center">
        <p>🔒 Tüm paylaşımlarınız anonimdir. Kişisel bilgileriniz korunmaktadır.</p>
      </div>
    </div>
  )
}
