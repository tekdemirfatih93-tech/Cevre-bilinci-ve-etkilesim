"use client"

import type React from "react"

import { useState, useRef } from "react"

interface SharedPost {
  id: string
  photo: string
  caption: string
  location: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
}

export function SharePage() {
  const [caption, setCaption] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)
  const [location, setLocation] = useState("İstanbul")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [sharedPosts, setSharedPosts] = useState<SharedPost[]>([])

  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleShare = () => {
    if (photo && caption.trim()) {
      const newPost: SharedPost = {
        id: String(Date.now()),
        photo,
        caption,
        location,
        timestamp: "az önce",
        likes: 0,
        comments: 0,
        isLiked: false,
      }
      setSharedPosts([newPost, ...sharedPosts])
      setPhoto(null)
      setCaption("")
      alert("Paylaşım başarıyla yayınlandı!")
    }
  }

  const handleLike = (id: string) => {
    setSharedPosts(
      sharedPosts.map((post) =>
        post.id === id
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleDelete = (id: string) => {
    setSharedPosts(sharedPosts.filter((post) => post.id !== id))
  }

  return (
    <div className="space-y-4 p-4">
      {/* Share Section */}
      <div className="bg-card rounded-2xl p-4 border border-border sticky top-20 z-10">
        <h3 className="font-semibold text-sm mb-3">📸 Yeni Paylaşım</h3>

        {/* Photo Preview */}
        {photo ? (
          <div className="relative mb-3">
            <img
              src={photo || "/placeholder.svg"}
              alt="Paylaşılacak fotoğraf"
              className="w-full rounded-xl object-cover max-h-64"
            />
            <button
              onClick={() => setPhoto(null)}
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="bg-background rounded-xl p-6 border border-dashed border-border flex flex-col items-center justify-center gap-2 mb-3">
            <span className="text-4xl">📷</span>
            <p className="text-xs text-muted-foreground text-center">Fotoğraf seçin</p>
          </div>
        )}

        {/* Camera/Gallery Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => cameraRef.current?.click()}
            className="bg-primary text-primary-foreground rounded-lg py-2 font-semibold text-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
          >
            📷 Kamera
          </button>
          <button
            onClick={() => galleryRef.current?.click()}
            className="bg-secondary text-foreground rounded-lg py-2 font-semibold text-xs hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1"
          >
            🖼️ Galeri
          </button>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />
          <input ref={galleryRef} type="file" accept="image/*" onChange={handleCameraCapture} className="hidden" />
        </div>

        {/* Location */}
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          📍 <span>{location}</span>
        </div>

        {/* Caption Input */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Ne gördünüz? Açıklamayı yazın..."
          className="w-full bg-background rounded-lg p-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground mb-3"
          rows={3}
        />

        {/* Anonymous Toggle */}
        <div className="flex items-center justify-between mb-3 p-2 bg-background rounded-lg">
          <div className="flex items-center gap-2">
            🔒<span className="text-xs font-medium">Anonim Paylaş</span>
          </div>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
        </div>

        {/* Privacy Notice */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-2 mb-3 flex items-start gap-2">
          <span className="text-lg flex-shrink-0">ℹ️</span>
          <p className="text-xs text-muted-foreground">Kimlik bilgileriniz gizli kalır. Konum otomatik eklenir.</p>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          disabled={!photo || !caption.trim()}
          className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📤 Paylaş
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm px-1">📰 Çevre Haberleri</h3>
        {sharedPosts.map((post) => (
          <div key={post.id} className="bg-card rounded-2xl overflow-hidden border border-border">
            {/* Post Image */}
            <img
              src={post.photo || "/placeholder.svg"}
              alt={post.caption}
              className="w-full aspect-video object-cover"
            />

            {/* Post Content */}
            <div className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    🔒<span className="text-xs text-muted-foreground">Anonim</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1 hover:bg-secondary/50 rounded transition-colors"
                >
                  🗑️
                </button>
              </div>

              {/* Caption */}
              <p className="text-sm mb-2">{post.caption}</p>

              {/* Location */}
              <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">📍 {post.location}</div>

              {/* Interactions */}
              <div className="flex items-center gap-3 border-t border-border pt-2">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                    post.isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {post.isLiked ? "❤️" : "🤍"} {post.likes}
                </button>
                <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  💬 {post.comments}
                </button>
                <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto">
                  📤
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
