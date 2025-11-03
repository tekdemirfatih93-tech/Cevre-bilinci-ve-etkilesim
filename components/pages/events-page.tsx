"use client"

import { useState, useEffect } from "react"

interface EventParticipant {
  id: string
  name: string
  lat: number
  lon: number
  distance: number
}

interface Event {
  id: string
  title: string
  date: string
  endDate: string
  location: {
    lat: number
    lon: number
    address: string
  }
  participants: EventParticipant[]
  image: string
  description: string
  isJoined: boolean
  likes: number
  isLiked: boolean
  status: "active" | "closed"
}

interface ChatMessage {
  id: string
  author: string
  text: string
  timestamp: string
  isSystem?: boolean
}

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "🌳 Orman Temizliği",
      date: "2025-11-15T10:00",
      endDate: "2025-11-15T16:00",
      location: { lat: 41.008, lon: 28.978, address: "Yeşil Park, İstanbul" },
      participants: [
        { id: "1", name: "Ahmet Yılmaz", lat: 41.0082, lon: 28.9784, distance: 50 },
        { id: "2", name: "Ayşe Demir", lat: 41.0075, lon: 28.977, distance: 120 },
        { id: "3", name: "Mehmet Kaya", lat: 41.009, lon: 28.979, distance: 200 },
      ],
      image: "/lush-forest-path.png",
      description: "Yeşil Park'ta topluluk tarafından orman temizliği ve ağaçlandırma etkinliği düzenleniyor.",
      isJoined: false,
      likes: 45,
      isLiked: false,
      status: "active",
    },
    {
      id: "2",
      title: "🌍 Çevre Bilinci Semineri",
      date: "2025-11-20T14:00",
      endDate: "2025-11-20T18:00",
      location: { lat: 41.015, lon: 28.985, address: "İstanbul Çevre Merkezi" },
      participants: [
        { id: "4", name: "Fatma Öz", lat: 41.016, lon: 28.986, distance: 80 },
        { id: "5", name: "Ali Tekin", lat: 41.014, lon: 28.984, distance: 150 },
      ],
      image: "/seminar-presentation.png",
      description: "Uzmanlar tarafından verilecek çevre koruma ve sürdürülebilirlik semineri.",
      isJoined: true,
      likes: 78,
      isLiked: true,
      status: "active",
    },
    {
      id: "3",
      title: "🚴 Bisiklet Turu",
      date: "2025-11-22T09:00",
      endDate: "2025-11-22T12:00",
      location: { lat: 41.04, lon: 29.01, address: "Boğaz Sahili" },
      participants: [
        { id: "6", name: "Zeynep Aydın", lat: 41.041, lon: 29.011, distance: 100 },
      ],
      image: "/classic-bicycle.png",
      description: "Boğaz sahili boyunca bisiklet turu yapılacak. Doğayı ve kenti keşfedin!",
      isJoined: false,
      likes: 62,
      isLiked: false,
      status: "active",
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showMapModal, setShowMapModal] = useState<string | null>(null)
  const [showParticipants, setShowParticipants] = useState<string | null>(null)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    endDate: "",
    location: { address: "", lat: 41.0082, lon: 28.9784 },
    description: "",
  })
  const [locationInput, setLocationInput] = useState("")

  // Auto-update event status based on endDate
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          const endDate = new Date(event.endDate)
          if (endDate < now && event.status === "active") {
            return { ...event, status: "closed" }
          }
          return event
        }),
      )
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const [selectedEventChat, setSelectedEventChat] = useState<string | null>(null)
  const [eventChats, setEventChats] = useState<Record<string, ChatMessage[]>>({
    "1": [
      {
        id: "1",
        author: "Admin",
        text: "Hoş geldiniz! Etkinlik sohbet odasına hoşsunuz.",
        timestamp: "10:00",
        isSystem: true,
      },
      { id: "2", author: "Katılımcı 1", text: "Herkese merhaba, heyecanlandım!", timestamp: "10:05" },
      { id: "3", author: "Katılımcı 2", text: "Ben de! Ne zaman başlıyoruz?", timestamp: "10:07" },
    ],
    "2": [
      { id: "1", author: "Admin", text: "Seminere hoşgeldiniz!", timestamp: "09:00", isSystem: true },
      { id: "2", author: "Katılımcı", text: "Fark yaratan bir seminer olacağını düşünüyorum", timestamp: "09:10" },
    ],
    "3": [],
  })
  const [newChatMessage, setNewChatMessage] = useState("")

  const handleJoinEvent = (eventId: string) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId && event.status === "active") {
          return {
            ...event,
            isJoined: !event.isJoined,
          }
        }
        return event
      }),
    )
  }

  const handleLikeEvent = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, isLiked: !event.isLiked, likes: event.isLiked ? event.likes - 1 : event.likes + 1 }
          : event,
      ),
    )
  }

  const handleSelectLocation = (address: string, lat?: number, lon?: number) => {
    setNewEvent({
      ...newEvent,
      location: {
        address,
        lat: lat || 41.0082,
        lon: lon || 28.9784,
      },
    })
    setLocationInput(address)
    setShowLocationPicker(false)
  }

  // Fetch event image from Unsplash based on title
  const fetchEventImage = async (title: string): Promise<string> => {
    try {
      // Extract keywords from title - remove emojis
      const keywords = title
        .toLowerCase()
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
        .trim()
        .split(" ")
        .filter(word => word.length > 2)
        .join(",")

      const searchQuery = keywords || "nature,environment"
      // Using Unsplash Source API (no API key needed)
      const imageUrl = `https://source.unsplash.com/800x600/?${searchQuery},environment`
      return imageUrl
    } catch (error) {
      console.error("Error fetching image:", error)
      return "/placeholder.svg?key=evt"
    }
  }

  const handleCreateEvent = async () => {
    if (newEvent.title && newEvent.date && newEvent.endDate && newEvent.location.address) {
      if (new Date(newEvent.endDate) <= new Date(newEvent.date)) {
        alert("Bitiş tarihi başlangıç tarihinden sonra olmalıdır!")
        return
      }

      // Fetch image based on event title
      const eventImage = await fetchEventImage(newEvent.title)

      const event: Event = {
        id: String(Date.now()),
        title: newEvent.title,
        date: newEvent.date,
        endDate: newEvent.endDate,
        location: newEvent.location,
        participants: [],
        image: eventImage,
        description: newEvent.description,
        isJoined: true,
        likes: 0,
        isLiked: false,
        status: "active",
      }
      setEvents([event, ...events])
      setEventChats({
        ...eventChats,
        [event.id]: [
          {
            id: "1",
            author: "Sistem",
            text: "Yeni etkinlik sohbet odası oluşturuldu!",
            timestamp: "az önce",
            isSystem: true,
          },
        ],
      })
      setNewEvent({
        title: "",
        date: "",
        endDate: "",
        location: { address: "", lat: 41.0082, lon: 28.9784 },
        description: "",
      })
      setLocationInput("")
      setShowCreateForm(false)
      alert("✅ Etkinlik başarıyla oluşturuldu ve otomatik fotoğraf eklendi!")
    } else {
      alert("Lütfen tüm alanları doldurun!")
    }
  }

  const handleSendChatMessage = () => {
    if (newChatMessage.trim() && selectedEventChat) {
      const message: ChatMessage = {
        id: String(Date.now()),
        author: "Siz",
        text: newChatMessage,
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      }
      setEventChats({
        ...eventChats,
        [selectedEventChat]: [...(eventChats[selectedEventChat] || []), message],
      })
      setNewChatMessage("")
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Create Event Button */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        ➕ Etkinlik Oluştur
      </button>

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
          <input
            type="text"
            placeholder="Etkinlik Adı"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Başlangıç</label>
              <input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Bitiş</label>
              <input
                type="datetime-local"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          </div>
          {/* Location Picker */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Konum</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Şehir, Semt, Cadde, Sokak..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onFocus={() => setShowLocationPicker(true)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
              />
              {showLocationPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">📍 Konum Seç</p>

                    {/* Manual Input */}
                    {locationInput && (
                      <button
                        onClick={() => handleSelectLocation(locationInput)}
                        className="w-full text-left px-3 py-2 hover:bg-secondary/30 rounded text-xs transition-colors"
                      >
                        ✏️ {locationInput}
                      </button>
                    )}

                    {/* Predefined Locations */}
                    <div className="space-y-1 mt-2">
                      <p className="text-xs text-muted-foreground px-2">Yakındaki Yerler:</p>
                      {[
                        { name: "Yeşil Park, İstanbul", lat: 41.008, lon: 28.978 },
                        { name: "İstanbul Çevre Merkezi", lat: 41.015, lon: 28.985 },
                        { name: "Boğaz Sahili", lat: 41.04, lon: 29.01 },
                        { name: "Marmara Neh ri, İstanbul", lat: 41.0, lon: 28.97 },
                      ].map((loc) => (
                        <button
                          key={loc.name}
                          onClick={() => handleSelectLocation(loc.name, loc.lat, loc.lon)}
                          className="w-full text-left px-3 py-2 hover:bg-secondary/30 rounded text-xs transition-colors"
                        >
                          📍 {loc.name}
                        </button>
                      ))}
                    </div>

                    {/* Map Option */}
                    <button
                      onClick={() => {
                        handleSelectLocation(locationInput || "Haritadan seçildi")
                      }}
                      className="w-full mt-2 bg-primary/10 text-primary px-3 py-2 rounded text-xs font-semibold hover:bg-primary/20 transition-colors"
                    >
                      🗺️ Haritadan Seç
                    </button>
                  </div>
                </div>
              )}
            </div>
            {newEvent.location.address && (
              <p className="text-xs text-muted-foreground mt-1">
                Seçili: <span className="text-primary font-medium">{newEvent.location.address}</span>
              </p>
            )}
          </div>
          <textarea
            placeholder="Açıklama"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateEvent}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Oluştur
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 bg-background border border-border rounded-lg py-2 text-xs font-semibold hover:bg-secondary/30 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm px-1">📅 Etkinlikler</h3>
        {events.map((event) => {
          const startDate = new Date(event.date)
          const endDate = new Date(event.endDate)
          const now = new Date()
          const isActive = event.status === "active"
          const timeRemaining = endDate.getTime() - now.getTime()
          const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))

          return (
            <div
              key={event.id}
              className={`bg-card rounded-2xl overflow-hidden border ${
                isActive ? "border-border hover:border-primary/50" : "border-destructive/30"
              } transition-colors`}
            >
              {/* Status Badge */}
              <div className="relative">
                <div className="aspect-video overflow-hidden bg-secondary/20">
                  <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      isActive ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                    }`}
                  >
                    {isActive ? "✅ Aktif" : "❌ Kapatıldı"}
                  </span>
                </div>
              </div>

              <div className="p-3">
                {/* Title and Description */}
                <h4 className="font-semibold text-sm mb-2">{event.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{event.description}</p>

                {/* Date and Time Info */}
                <div className="space-y-1 mb-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">📅 Başlangıç:</span>
                    <span className="font-medium">{startDate.toLocaleString("tr-TR")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">⏰ Bitiş:</span>
                    <span className="font-medium">{endDate.toLocaleString("tr-TR")}</span>
                  </div>
                  {isActive && hoursRemaining > 0 && (
                    <div className="flex items-center justify-between text-primary font-semibold">
                      <span>⏳ Kalan Süre:</span>
                      <span>
                        {hoursRemaining > 24
                          ? `${Math.floor(hoursRemaining / 24)} gün`
                          : `${hoursRemaining} saat`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">📍</span>
                    <span className="text-xs">{event.location.address}</span>
                  </div>
                </div>

                {/* Compact Map Preview */}
                {event.participants.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">🗺️ Etkinlik Konumu</span>
                      <button
                        onClick={() => setShowMapModal(showMapModal === event.id ? null : event.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        {showMapModal === event.id ? "Gizle" : "Haritayı Göster"}
                      </button>
                    </div>

                    {showMapModal !== event.id ? (
                      <div
                        onClick={() => setShowMapModal(event.id)}
                        className="relative h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-3xl">🗺️</span>
                            <p className="text-xs text-muted-foreground mt-1">Tıklayarak haritayı büyüt</p>
                          </div>
                        </div>
                        {/* Mini markers */}
                        <div className="absolute bottom-2 right-2 bg-background/90 px-2 py-1 rounded text-xs">
                          📍 {event.participants.length} katılımcı
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border border-primary overflow-hidden">
                        {/* Simulated Map with Participants */}
                        <div className="absolute inset-0 p-4">
                          <div className="relative w-full h-full">
                            {/* Event Center Marker */}
                            <div
                              className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2"
                              style={{ left: "50%", top: "50%" }}
                            >
                              <span className="text-3xl">⭐</span>
                            </div>
                            {/* Participant Markers */}
                            {event.participants.slice(0, 5).map((participant, idx) => (
                              <div
                                key={participant.id}
                                className="absolute w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground cursor-pointer hover:scale-110 transition-transform -translate-x-1/2 -translate-y-1/2"
                                style={{
                                  left: `${45 + (idx * 10) % 30}%`,
                                  top: `${40 + (idx * 15) % 40}%`,
                                }}
                                title={`${participant.name} - ${participant.distance}m uzakta`}
                              >
                                {participant.name[0]}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Participants List */}
                {event.participants.length > 0 && (
                  <div className="mb-3">
                    <button
                      onClick={() => setShowParticipants(showParticipants === event.id ? null : event.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold mb-2 hover:text-primary transition-colors"
                    >
                      <span>👥 Katılımcılar ({event.participants.length})</span>
                      <span>{showParticipants === event.id ? "▲" : "▼"}</span>
                    </button>

                    {showParticipants === event.id && (
                      <div className="space-y-2">
                        {event.participants.slice(0, 5).map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center gap-2 p-2 bg-background rounded-lg border border-border"
                          >
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-primary">{participant.name[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{participant.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {participant.distance >= 1000
                                  ? `${(participant.distance / 1000).toFixed(1)} km`
                                  : `${participant.distance} m`}{" "}
                                uzakta
                              </p>
                            </div>
                          </div>
                        ))}
                        {event.participants.length > 5 && (
                          <p className="text-xs text-center text-muted-foreground">
                            +{event.participants.length - 5} kişi daha
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Interactions */}
                <div className="flex gap-2 mb-3 text-xs border-t border-border pt-2">
                  <button
                    onClick={() => handleLikeEvent(event.id)}
                    className={`flex items-center gap-1 font-medium transition-colors ${
                      event.isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {event.isLiked ? "❤️" : "🤍"} {event.likes}
                  </button>
                  <button
                    onClick={() => setSelectedEventChat(selectedEventChat === event.id ? null : event.id)}
                    className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    💬 Sohbet
                  </button>
                  <button className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    📤
                  </button>
                </div>

                {/* Join Button */}
                <button
                  onClick={() => handleJoinEvent(event.id)}
                  disabled={!isActive}
                  className={`w-full rounded-lg py-2 text-xs font-semibold transition-colors ${
                    !isActive
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : event.isJoined
                        ? "bg-accent/10 text-accent border border-accent/30"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {!isActive ? "🚫 Etkinlik Sona Erdi" : event.isJoined ? "✓ Katılıyorum" : "Katıl"}
                </button>

                {/* Chat Room Modal */}
                {selectedEventChat === event.id && (
                  <div className="mt-4 bg-background rounded-lg border border-border overflow-hidden flex flex-col h-64">
                    {/* Chat Header */}
                    <div className="p-3 border-b border-border flex items-center justify-between">
                      <h5 className="font-semibold text-xs">Etkinlik Sohbeti</h5>
                      <button
                        onClick={() => setSelectedEventChat(null)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {eventChats[event.id]?.map((msg) => (
                        <div key={msg.id} className={`flex gap-2 ${msg.isSystem ? "justify-center" : ""}`}>
                          {!msg.isSystem ? (
                            <>
                              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-primary">{msg.author[0]}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold">{msg.author}</span>
                                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                                </div>
                                <p className="text-xs text-foreground">{msg.text}</p>
                              </div>
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground text-center">{msg.text}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-2 border-t border-border flex gap-2">
                      <input
                        type="text"
                        value={newChatMessage}
                        onChange={(e) => setNewChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendChatMessage()}
                        placeholder="Mesaj yazın..."
                        className="flex-1 bg-background border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground"
                      />
                      <button
                        onClick={handleSendChatMessage}
                        className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                      >
                        Gönder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
