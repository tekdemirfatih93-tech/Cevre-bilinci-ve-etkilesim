"use client"

import { useState } from "react"
import { useAuth } from "@/app/auth/context"
import { useRouter } from "next/navigation"
import { AdminLiveChatPanel } from "@/components/admin-live-chat-panel"
import { AdminTicketManagement } from "@/components/admin-ticket-management"
import { AIResponseEditor } from "@/components/ai-response-editor"
import { TranslateButton } from "@/components/translate-button"

interface AdminStats {
  totalUsers: number
  activeEvents: number
  pendingComplaints: number
  resolvedComplaints: number
}

interface Report {
  type: string
  count: number
  trend: number
}

interface Post {
  id: string
  author: string
  content: string
  reported: number
  status: "Active" | "Hidden" | "Flagged"
  date: string
}

interface UserManagement {
  id: string
  name: string
  email: string
  rank: "Kullanıcı" | "Aktif Desteği" | "Moderatör" | "Admin"
  badges: string[]
  joinDate: string
  status: "Active" | "Suspended" | "Banned"
  permissionLevel: number
}

interface Complaint {
  id: string
  userId: string
  userName: string
  userEmail: string
  title: string
  description: string
  category: string
  status: "Pending" | "In Review" | "Resolved" | "Rejected"
  date: string
  attachments: number
  attachmentFiles?: { type: "photo" | "video"; url: string; name: string }[]
  response?: string
  respondedBy?: string
  respondedAt?: string
}

interface EventManagement {
  id: string
  title: string
  creator: string
  creatorEmail: string
  date: string
  endDate: string
  location: string
  participants: number
  status: "active" | "closed"
  likes: number
  description: string
}

const PERMISSION_LEVELS = {
  0: { name: "Kullanıcı", permissions: ["view_content"] },
  1: { name: "Aktif Destekçi", permissions: ["view_content", "create_events", "comment"] },
  2: {
    name: "Moderatör",
    permissions: ["view_content", "create_events", "comment", "moderate_content", "manage_complaints"],
  },
  3: {
    name: "Admin",
    permissions: [
      "view_content",
      "create_events",
      "comment",
      "moderate_content",
      "manage_complaints",
      "manage_users",
      "manage_admins",
    ],
  },
}

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const [stats] = useState<AdminStats>({
    totalUsers: 1240,
    activeEvents: 18,
    pendingComplaints: 5,
    resolvedComplaints: 34,
  })

  const [reports] = useState<Report[]>([
    { type: "Orman İhlali", count: 12, trend: 15 },
    { type: "Su Kirliliği", count: 8, trend: -10 },
    { type: "Hava Kirliliği", count: 6, trend: 5 },
    { type: "Atık Sorunu", count: 4, trend: 20 },
  ])

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Anonim Kullanıcı 1",
      content: "Harika bir orman temizliği etkinliği...",
      reported: 0,
      status: "Active",
      date: "2 saat önce",
    },
    {
      id: "2",
      author: "Anonim Kullanıcı 2",
      content: "Kontrollü olmayan ağaç kesimi gözlendi...",
      reported: 2,
      status: "Flagged",
      date: "5 saat önce",
    },
  ])

  const [users, setUsers] = useState<UserManagement[]>([
    {
      id: "USR-001",
      name: "Kullanıcı 1",
      email: "user1@demo.com",
      rank: "Aktif Destekçi",
      badges: ["Üye", "Aktif"],
      joinDate: "15 gün önce",
      status: "Active",
      permissionLevel: 1,
    },
    {
      id: "USR-002",
      name: "Kullanıcı 2",
      email: "user2@demo.com",
      rank: "Moderatör",
      badges: ["Üye", "Moderatör"],
      joinDate: "30 gün önce",
      status: "Active",
      permissionLevel: 2,
    },
    {
      id: "USR-003",
      name: "Admin Kullanıcı",
      email: "admin@cevre.com",
      rank: "Admin",
      badges: ["Admin", "Sistem"],
      joinDate: "60 gün önce",
      status: "Active",
      permissionLevel: 3,
    },
  ])

  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null)
  const [activeAdmins, setActiveAdmins] = useState(["admin@cevre.com"])

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "CMP-001",
      userId: "USR-001",
      userName: "Ahmet Yılmaz",
      userEmail: "ahmet@example.com",
      title: "Ormanda İllegal Kesim",
      description: "Yeşil Park'ta yetkisiz ağaç kesimi gözlenmiştir. Yaklaşık 15 ağacın kesildiğini tespit ettim.",
      category: "Orman",
      status: "Pending",
      date: "5 gün önce",
      attachments: 2,
      attachmentFiles: [
        { type: "photo", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400", name: "orman-kesim-1.jpg" },
        { type: "photo", url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400", name: "orman-kesim-2.jpg" },
      ],
    },
    {
      id: "CMP-002",
      userId: "USR-004",
      userName: "Ayşe Demir",
      userEmail: "ayse@example.com",
      title: "Su Kaynağı Kirliliği",
      description: "Nehir kenarında atık bırakma işlemi gözlenmiştir. Kimyasal atıkların olduğunu düşünüyorum.",
      category: "Su",
      status: "In Review",
      date: "10 gün önce",
      attachments: 1,
      attachmentFiles: [
        { type: "photo", url: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400", name: "su-kirliligi.jpg" },
      ],
      response: "Şikayetiniz inceleniyor. Yarın saha kontrolü yapılacaktır.",
      respondedBy: "admin@cevre.com",
      respondedAt: "8 gün önce",
    },
    {
      id: "CMP-003",
      userId: "USR-005",
      userName: "Mehmet Kaya",
      userEmail: "mehmet@example.com",
      title: "Hava Kirliliği",
      description: "Fabrikadan çıkan dumanlar çok yoğun. Çevre halkı etkileniyor.",
      category: "Hava",
      status: "Resolved",
      date: "20 gün önce",
      attachments: 3,
      attachmentFiles: [
        { type: "photo", url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400", name: "fabrika-duman-1.jpg" },
        { type: "photo", url: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400", name: "fabrika-duman-2.jpg" },
        { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", name: "fabrika-video.mp4" },
      ],
      response: "Fabrika denetlendi ve gerekli yaptırımlar uygulandı. Teşekkürler.",
      respondedBy: "admin@cevre.com",
      respondedAt: "15 gün önce",
    },
    {
      id: "CMP-004",
      userId: "USR-006",
      userName: "John Smith",
      userEmail: "john@example.com",
      title: "Illegal Waste Dumping",
      description: "There is illegal waste dumping happening near the river. Large amounts of plastic and chemical waste are being thrown into the water. This is causing serious environmental damage and affecting local wildlife.",
      category: "Waste",
      status: "Pending",
      date: "2 gün önce",
      attachments: 1,
      attachmentFiles: [
        { type: "photo", url: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400", name: "waste-dump.jpg" },
      ],
    },
  ])

  const [events, setEvents] = useState<EventManagement[]>([
    {
      id: "EVT-001",
      title: "🌳 Orman Temizliği",
      creator: "Kullanıcı 1",
      creatorEmail: "user1@demo.com",
      date: "2025-11-15T10:00",
      endDate: "2025-11-15T16:00",
      location: "Yeşil Park, İstanbul",
      participants: 24,
      status: "active",
      likes: 45,
      description: "Yeşil Park'ta topluluk tarafından orman temizliği ve ağaçlandırma etkinliği.",
    },
    {
      id: "EVT-002",
      title: "🌍 Çevre Bilinci Semineri",
      creator: "Admin Kullanıcı",
      creatorEmail: "admin@cevre.com",
      date: "2025-11-20T14:00",
      endDate: "2025-11-20T18:00",
      location: "İstanbul Çevre Merkezi",
      participants: 45,
      status: "active",
      likes: 78,
      description: "Uzmanlar tarafından verilecek çevre koruma ve sürdürülebilirlik semineri.",
    },
  ])

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [complaintResponse, setComplaintResponse] = useState("")
  const [translatedComplaintDescriptions, setTranslatedComplaintDescriptions] = useState<Record<string, string>>({})

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-destructive">Yetkisiz Erişim</p>
          <p className="text-sm text-muted-foreground">Bu sayfaya erişim izniniz yok</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    )
  }

  const handleHidePost = (id: string) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, status: "Hidden" } : post)))
  }

  const handleApprovePost = (id: string) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, status: "Active", reported: 0 } : post)))
  }

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id))
  }

  const handlePromoteUser = (userId: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const newLevel = Math.min(u.permissionLevel + 1, 3)
          const rankMap = ["Kullanıcı", "Aktif Destekçi", "Moderatör", "Admin"]
          return {
            ...u,
            permissionLevel: newLevel,
            rank: rankMap[newLevel] as any,
          }
        }
        return u
      }),
    )
  }

  const handleDemoteUser = (userId: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const newLevel = Math.max(u.permissionLevel - 1, 0)
          const rankMap = ["Kullanıcı", "Aktif Destekçi", "Moderatör", "Admin"]
          return {
            ...u,
            permissionLevel: newLevel,
            rank: rankMap[newLevel] as any,
          }
        }
        return u
      }),
    )
  }

  const handleAddBadge = (userId: string, badge: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, badges: [...new Set([...u.badges, badge])] } : u)))
    alert(`${badge} rozeti eklendi`)
  }

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: "Suspended" } : u)))
    alert("Kullanıcı askıya alındı")
  }

  const handleToggleAdmin = (email: string) => {
    if (activeAdmins.includes(email)) {
      setActiveAdmins(activeAdmins.filter((e) => e !== email))
    } else {
      setActiveAdmins([...activeAdmins, email])
    }
  }

  // Complaint handlers
  const handleComplaintStatusChange = (id: string, status: Complaint["status"]) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === id ? { ...complaint, status } : complaint
      )
    )
  }

  const handleComplaintResponse = (id: string) => {
    if (complaintResponse.trim() && user) {
      setComplaints(
        complaints.map((complaint) =>
          complaint.id === id
            ? {
                ...complaint,
                response: complaintResponse,
                respondedBy: user.email,
                respondedAt: "az önce",
                status: "In Review",
              }
            : complaint
        )
      )
      setComplaintResponse("")
      setSelectedComplaint(null)
      alert("Şikayete yanıt gönderildi!")
    }
  }

  // Event handlers
  const handleEventStatusChange = (id: string, status: "active" | "closed") => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status } : event
      )
    )
  }

  const handleDeleteEvent = (id: string) => {
    if (confirm("Etkinliği silmek istediğinizden emin misiniz?")) {
      setEvents(events.filter((event) => event.id !== id))
      alert("Etkinlik silindi!")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Yönetici Paneli</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.rank}</p>
            </div>
            <button
              onClick={logout}
              className="text-xs bg-destructive/10 text-destructive px-3 py-1 rounded-lg hover:bg-destructive/20"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Toplam Kullanıcı</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.totalUsers}</p>
            <p className="text-xs text-green-600 mt-1">+12% bu ay</p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Aktif Etkinlikler</p>
            <p className="text-3xl font-bold text-accent mt-2">{stats.activeEvents}</p>
            <p className="text-xs text-green-600 mt-1">+3 bu hafta</p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Beklemede Şikayetler</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingComplaints}</p>
            <p className="text-xs text-yellow-600 mt-1">Hızlı işlem gerekli</p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Çözülen Şikayetler</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolvedComplaints}</p>
            <p className="text-xs text-green-600 mt-1">+8 bu ay</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Genel Bakış
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Kullanıcılar
          </button>
          <button
            onClick={() => setActiveTab("moderation")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "moderation"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Moderasyon
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "reports"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Raporlar
          </button>
          <button
            onClick={() => setActiveTab("complaints")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "complaints"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            🚨 Şikayetler
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "events"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            🎉 Etkinlikler
          </button>
          <button
            onClick={() => setActiveTab("livesupport")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "livesupport"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            💬 Canlı Destek
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "tickets"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            🎫 Destek Talepleri
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "admins"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Aktif Adminler
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-4">Bu Ayın Aktivitesi</h3>
              <div className="h-64 bg-background/50 rounded-lg flex items-center justify-center text-muted-foreground">
                Aktivite Grafiği
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-card rounded-2xl p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-2">Çevre Uyarıları</p>
                <p className="text-2xl font-bold text-destructive">18</p>
                <p className="text-xs text-destructive/60">+5 bugün</p>
              </div>
              <div className="bg-card rounded-2xl p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-2">Yeni Üyeler</p>
                <p className="text-2xl font-bold text-accent">42</p>
                <p className="text-xs text-accent/60">+12 bu hafta</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Kullanıcı Yönetimi</h3>
            </div>

            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                      <p className="text-xs text-primary font-semibold mt-1">ID: {u.id}</p>
                      <p className="text-xs text-muted-foreground">Katıldı: {u.joinDate}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          u.status === "Active"
                            ? "bg-green-500/20 text-green-700"
                            : u.status === "Suspended"
                              ? "bg-yellow-500/20 text-yellow-700"
                              : "bg-red-500/20 text-red-700"
                        }`}
                      >
                        {u.status === "Active" ? "Aktif" : u.status === "Suspended" ? "Askıda" : "Yasaklı"}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-purple-500/20 text-purple-700 rounded-full">
                        Seviye {u.permissionLevel}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary rounded-full">
                      Rütbe: {u.rank}
                    </span>
                    {u.badges.map((badge) => (
                      <span
                        key={badge}
                        className="text-xs font-semibold px-2 py-1 bg-accent/20 text-accent rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <button
                      onClick={() => handlePromoteUser(u.id)}
                      disabled={u.permissionLevel >= 3}
                      className={`text-xs px-2 py-1 rounded font-semibold transition-colors ${
                        u.permissionLevel >= 3
                          ? "bg-gray-500/20 text-gray-700 cursor-not-allowed"
                          : "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                      }`}
                    >
                      Yükselt
                    </button>
                    <button
                      onClick={() => handleDemoteUser(u.id)}
                      disabled={u.permissionLevel <= 0}
                      className={`text-xs px-2 py-1 rounded font-semibold transition-colors ${
                        u.permissionLevel <= 0
                          ? "bg-gray-500/20 text-gray-700 cursor-not-allowed"
                          : "bg-orange-500/10 text-orange-700 hover:bg-orange-500/20"
                      }`}
                    >
                      Düşür
                    </button>
                    <button
                      onClick={() => handleAddBadge(u.id, "Çevre Savaşçısı")}
                      className="text-xs bg-blue-500/10 text-blue-700 px-2 py-1 rounded font-semibold hover:bg-blue-500/20"
                    >
                      Rozet
                    </button>
                    <button
                      onClick={() => handleSuspendUser(u.id)}
                      className="text-xs bg-yellow-500/10 text-yellow-700 px-2 py-1 rounded font-semibold hover:bg-yellow-500/20"
                    >
                      Askıya Al
                    </button>
                    <button
                      onClick={() => setSelectedUser(selectedUser?.id === u.id ? null : u)}
                      className="text-xs bg-indigo-500/10 text-indigo-700 px-2 py-1 rounded font-semibold hover:bg-indigo-500/20"
                    >
                      Detay
                    </button>
                  </div>

                  {selectedUser?.id === u.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-semibold mb-2">Yetkiler:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                        {PERMISSION_LEVELS[u.permissionLevel as keyof typeof PERMISSION_LEVELS].permissions.map(
                          (perm) => (
                            <div key={perm} className="flex items-center gap-2">
                              <span className="text-green-600">✓</span>
                              <span className="text-muted-foreground">{perm}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === "moderation" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">İçerik Moderasyonu</h3>
            </div>

            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        post.status === "Active"
                          ? "bg-green-500/20 text-green-700"
                          : post.status === "Flagged"
                            ? "bg-yellow-500/20 text-yellow-700"
                            : "bg-red-500/20 text-red-700"
                      }`}
                    >
                      {post.status === "Active" ? "Aktif" : post.status === "Flagged" ? "İşaretli" : "Gizli"}
                    </span>
                  </div>

                  <p className="text-sm text-foreground mb-3 line-clamp-2">{post.content}</p>

                  <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                    Rapor: {post.reported}
                  </div>

                  {post.reported > 0 && (
                    <div className="flex gap-2">
                      {post.status !== "Active" && (
                        <button
                          onClick={() => handleApprovePost(post.id)}
                          className="flex-1 bg-green-500/10 text-green-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-green-500/20"
                        >
                          Onayla
                        </button>
                      )}
                      <button
                        onClick={() => handleHidePost(post.id)}
                        className="flex-1 bg-yellow-500/10 text-yellow-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-yellow-500/20"
                      >
                        Gizle
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="flex-1 bg-red-500/10 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-500/20"
                      >
                        Sil
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Çevre Raporları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report, idx) => (
                <div key={idx} className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-sm">{report.type}</p>
                      <p className="text-2xl font-bold text-primary mt-1">{report.count}</p>
                    </div>
                    <div
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        report.trend > 0 ? "bg-red-500/20 text-red-700" : "bg-green-500/20 text-green-700"
                      }`}
                    >
                      {report.trend > 0 ? "↑" : "↓"} {Math.abs(report.trend)}%
                    </div>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min((report.count / 15) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Bu ayın trendi</p>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border mt-6">
              <h4 className="font-semibold mb-4">Detaylı İstatistikler</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="text-sm">Toplam Şikayet</span>
                  <span className="font-bold">87</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="text-sm">Çözülen</span>
                  <span className="font-bold text-green-600">34</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="text-sm">Beklemede</span>
                  <span className="font-bold text-yellow-600">5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="text-sm">Reddedilen</span>
                  <span className="font-bold text-red-600">48</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === "complaints" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">🚨 Şikayetler Yönetimi</h3>
              <div className="flex gap-2 text-xs">
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-700 rounded-full font-semibold">
                  Beklemede: {complaints.filter(c => c.status === "Pending").length}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-700 rounded-full font-semibold">
                  İnceleniyor: {complaints.filter(c => c.status === "In Review").length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-semibold">{complaint.title}</p>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            complaint.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-700"
                              : complaint.status === "In Review"
                                ? "bg-blue-500/20 text-blue-700"
                                : complaint.status === "Resolved"
                                  ? "bg-green-500/20 text-green-700"
                                  : "bg-red-500/20 text-red-700"
                          }`}
                        >
                          {complaint.status === "Pending" ? "Beklemede" : complaint.status === "In Review" ? "İnceleniyor" : complaint.status === "Resolved" ? "Çözüldü" : "Reddedildi"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        👤 <strong>{complaint.userName}</strong> ({complaint.userEmail})
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        🏷️ {complaint.category} | 📅 {complaint.date} | 📎 {complaint.attachments} ek
                      </p>
                      <p className="text-xs text-primary font-semibold">ID: {complaint.id}</p>
                    </div>
                  </div>

                  <div className="mb-3 p-3 bg-background rounded-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-semibold text-muted-foreground">Açıklama:</p>
                      <TranslateButton 
                        text={complaint.description} 
                        compact
                        onTranslate={(translated) => {
                          setTranslatedComplaintDescriptions(prev => ({
                            ...prev,
                            [complaint.id]: translated
                          }))
                        }}
                      />
                    </div>
                    <p className="text-sm break-words">{translatedComplaintDescriptions[complaint.id] || complaint.description}</p>
                  </div>

                  {/* Attachments */}
                  {complaint.attachmentFiles && complaint.attachmentFiles.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">📎 Ekler ({complaint.attachmentFiles.length}):</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {complaint.attachmentFiles.map((file, idx) => (
                          <div key={idx} className="relative group">
                            {file.type === "photo" ? (
                              <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white text-xs bg-primary px-2 py-1 rounded"
                                  >
                                    🔍 Büyüt
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                                <video
                                  src={file.url}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {complaint.response && (
                    <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-xs font-semibold text-primary mb-1">
                        💬 Yanıt ({complaint.respondedBy} - {complaint.respondedAt}):
                      </p>
                      <p className="text-sm">{complaint.response}</p>
                    </div>
                  )}

                  {selectedComplaint?.id === complaint.id ? (
                    <div className="space-y-2">
                      <AIResponseEditor
                        value={complaintResponse}
                        onChange={setComplaintResponse}
                        onSend={() => handleComplaintResponse(complaint.id)}
                        placeholder="Şikayet yanıtınızı yazın..."
                      />
                      <button
                        onClick={() => setSelectedComplaint(null)}
                        className="w-full bg-background border border-border text-xs font-semibold px-3 py-2 rounded-lg hover:bg-secondary/30"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="bg-blue-500/10 text-blue-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-blue-500/20"
                      >
                        Yanıtla
                      </button>
                      <button
                        onClick={() => handleComplaintStatusChange(complaint.id, "In Review")}
                        disabled={complaint.status === "In Review"}
                        className={`text-xs font-semibold px-3 py-2 rounded-lg ${
                          complaint.status === "In Review"
                            ? "bg-gray-500/20 text-gray-700 cursor-not-allowed"
                            : "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20"
                        }`}
                      >
                        İnceleniyor
                      </button>
                      <button
                        onClick={() => handleComplaintStatusChange(complaint.id, "Resolved")}
                        className="bg-green-500/10 text-green-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-green-500/20"
                      >
                        Çöz
                      </button>
                      <button
                        onClick={() => handleComplaintStatusChange(complaint.id, "Rejected")}
                        className="bg-red-500/10 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-500/20"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">🎉 Etkinlikler Yönetimi</h3>
              <div className="flex gap-2 text-xs">
                <span className="px-3 py-1 bg-green-500/20 text-green-700 rounded-full font-semibold">
                  Aktif: {events.filter(e => e.status === "active").length}
                </span>
                <span className="px-3 py-1 bg-gray-500/20 text-gray-700 rounded-full font-semibold">
                  Kapatıldı: {events.filter(e => e.status === "closed").length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {events.map((event) => {
                const startDate = new Date(event.date)
                const endDate = new Date(event.endDate)
                return (
                  <div key={event.id} className="bg-card rounded-2xl p-4 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-semibold">{event.title}</p>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              event.status === "active"
                                ? "bg-green-500/20 text-green-700"
                                : "bg-gray-500/20 text-gray-700"
                            }`}
                          >
                            {event.status === "active" ? "✅ Aktif" : "❌ Kapatıldı"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          👤 <strong>{event.creator}</strong> ({event.creatorEmail})
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">
                          📍 {event.location} | 👥 {event.participants} katılımcı | ❤️ {event.likes} beğeni
                        </p>
                        <p className="text-xs text-primary font-semibold">ID: {event.id}</p>
                      </div>
                    </div>

                    <div className="mb-3 grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2 bg-background rounded-lg">
                        <p className="text-muted-foreground mb-1">📅 Başlangıç:</p>
                        <p className="font-semibold">{startDate.toLocaleString("tr-TR")}</p>
                      </div>
                      <div className="p-2 bg-background rounded-lg">
                        <p className="text-muted-foreground mb-1">⏰ Bitiş:</p>
                        <p className="font-semibold">{endDate.toLocaleString("tr-TR")}</p>
                      </div>
                    </div>

                    <div className="mb-3 p-3 bg-background rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Açıklama:</p>
                      <p className="text-sm">{event.description}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {event.status === "active" ? (
                        <button
                          onClick={() => handleEventStatusChange(event.id, "closed")}
                          className="bg-yellow-500/10 text-yellow-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-yellow-500/20"
                        >
                          Kapat
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEventStatusChange(event.id, "active")}
                          className="bg-green-500/10 text-green-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-green-500/20"
                        >
                          Aktif Et
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Etkinlik detayları: ${event.id}`)}
                        className="bg-blue-500/10 text-blue-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-blue-500/20"
                      >
                        Detaylar
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-500/10 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-500/20"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Live Support Tab */}
        {activeTab === "livesupport" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">💬 Canlı Destek Sohbetleri</h3>
              <div className="flex gap-2 text-xs">
                <span className="px-3 py-1 bg-green-500/20 text-green-700 rounded-full font-semibold">
                  🟢 Çevrimiçi
                </span>
              </div>
            </div>

            <AdminLiveChatPanel />
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">🎫 Destek Talebi Yönetimi</h3>
            </div>

            <AdminTicketManagement />
          </div>
        )}

        {/* Active Admins Tab */}
        {activeTab === "admins" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Aktif Adminler ve Moderatörler</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {users
                .filter((u) => u.permissionLevel >= 2)
                .map((admin) => (
                  <div key={admin.id} className="bg-card rounded-2xl p-4 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">{admin.email}</p>
                        <p className="text-xs text-primary font-semibold mt-1">ID: {admin.id}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          activeAdmins.includes(admin.email)
                            ? "bg-green-500/20 text-green-700"
                            : "bg-gray-500/20 text-gray-700"
                        }`}
                      >
                        {activeAdmins.includes(admin.email) ? "Çevrimiçi" : "Çevrimdışı"}
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary rounded-full">
                        {admin.rank}
                      </span>
                      <span className="text-xs font-bold px-2 py-1 bg-purple-500/20 text-purple-700 rounded-full">
                        Seviye {admin.permissionLevel}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3 text-xs">
                      <p className="font-semibold text-muted-foreground mb-2">Yetkiler:</p>
                      {PERMISSION_LEVELS[admin.permissionLevel as keyof typeof PERMISSION_LEVELS].permissions
                        .slice(0, 3)
                        .map((perm) => (
                          <div key={perm} className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>{perm}</span>
                          </div>
                        ))}
                      {PERMISSION_LEVELS[admin.permissionLevel as keyof typeof PERMISSION_LEVELS].permissions.length >
                        3 && (
                        <p className="text-muted-foreground">
                          +
                          {PERMISSION_LEVELS[admin.permissionLevel as keyof typeof PERMISSION_LEVELS].permissions
                            .length - 3}{" "}
                          daha
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleAdmin(admin.email)}
                      className={`w-full text-xs font-semibold py-2 rounded-lg transition-colors ${
                        activeAdmins.includes(admin.email)
                          ? "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20"
                          : "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                      }`}
                    >
                      {activeAdmins.includes(admin.email) ? "Çevrimdışı Yap" : "Çevrimiçi Yap"}
                    </button>
                  </div>
                ))}
            </div>

            <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 mt-6">
              <p className="text-sm font-semibold mb-2">Sistem Bilgisi</p>
              <p className="text-xs text-muted-foreground">
                Aktif adminler ve moderatörler 7/24 sistem izlemesi yapabilir ve destek chat'te yer alabilirler.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
