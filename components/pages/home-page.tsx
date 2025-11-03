"use client"

import { useState, useEffect, useRef } from "react"
import { improveText } from "@/lib/ai-helper"
import { TranslateButton } from "@/components/translate-button"


interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
  likes: number
}

interface Post {
  id: string
  author: string
  content: string
  image?: string
  timestamp: string
  likes: number
  isLiked: boolean
  comments: number
  location: string
}

export function HomePage() {
  const [nearbyAreas, setNearbyAreas] = useState<any[]>([])
  const [showComments, setShowComments] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [newComment, setNewComment] = useState("")
  const [translatedPostContent, setTranslatedPostContent] = useState<Record<string, string>>({})
  const [translatedCommentText, setTranslatedCommentText] = useState<Record<string, string>>({})
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Çevre Seveni",
      content: "Yeşil Park'ta böyle güzel bir doğa ortamı var! Herkesin görmesi gereken yer.",
      image: "/lush-forest-stream.png",
      timestamp: "2 saat önce",
      likes: 24,
      isLiked: false,
      comments: 5,
      location: "Yeşil Park, İstanbul",
    },
    {
      id: "2",
      author: "Su İçin Savaş",
      content: "Bu hafta ırmak temizliği yaptık. Plastik atık sorunu gerçekten ciddi.",
      image: "/cleanup.jpg",
      timestamp: "5 saat önce",
      likes: 56,
      isLiked: false,
      comments: 12,
      location: "Marmara Nehri, İstanbul",
    },
    {
      id: "3",
      author: "John Green",
      content: "Amazing nature preservation work happening here. We need more people to join the environmental cause!",
      image: "/cleanup.jpg",
      timestamp: "1 saat önce",
      likes: 18,
      isLiked: false,
      comments: 3,
      location: "Green Park, Istanbul",
    },
  ])
  const [showPostForm, setShowPostForm] = useState(false)
  const [newPost, setNewPost] = useState("")
  const [postPhoto, setPostPhoto] = useState<string | null>(null)
  const [isAnonymous, setIsAnonymous] = useState(true)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Mock nearby areas
    setNearbyAreas([
      { id: 1, name: "Yeşil Park", distance: "0.5 km", type: "Park" },
      { id: 2, name: "Orman Yolu", distance: "1.2 km", type: "Doğa Yolu" },
      { id: 3, name: "Su Taşkın Alanı", distance: "2.1 km", type: "Korunan Alan" },
      { id: 4, name: "Kıyı Şeridi", distance: "3.5 km", type: "Koruma Alanı" },
    ])

    // Mock comments
    setComments({
      "1": [
        {
          id: "1",
          author: "Çevre Seveni",
          text: "Harika görünüyor! Ben de gitmek isterdim",
          timestamp: "1 saat önce",
          likes: 5,
        },
        {
          id: "2",
          author: "Yeşil Kalp",
          text: "Tamamı! Bir sonraki temizlik etkinliğine katıl",
          timestamp: "30 dk önce",
          likes: 3,
        },
        {
          id: "3",
          author: "Sarah Wilson",
          text: "This looks absolutely beautiful! What a wonderful place to visit.",
          timestamp: "15 dk önce",
          likes: 7,
        },
      ],
    })
  }, [])


  const handleCommentSubmit = async (postId: string) => {
    if (newComment.trim()) {
      // Yorumu otomatik iyileştir
      const improvedComment = await improveText({
        text: newComment,
        tone: "friendly",
      })

      const newCommentObj: Comment = {
        id: String(Date.now()),
        author: "Benim Adım",
        text: improvedComment,
        timestamp: "az önce",
        likes: 0,
      }
      setComments({
        ...comments,
        [postId]: [...(comments[postId] || []), newCommentObj],
      })
      setNewComment("")
    }
  }

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleSharePost = (postId: string) => {
    alert("Paylaşım başarıyla paylaşıldı!")
  }

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPostPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreatePost = async () => {
    if (newPost.trim()) {
      // Metni otomatik iyileştir
      const improvedContent = await improveText({
        text: newPost,
        tone: "friendly",
      })

      const post: Post = {
        id: String(Date.now()),
        author: isAnonymous ? "Anonim Kullanıcı" : "Siz",
        content: improvedContent,
        image: postPhoto || undefined,
        timestamp: "az önce",
        likes: 0,
        isLiked: false,
        comments: 0,
        location: "İstanbul, Türkiye",
      }
      setPosts([post, ...posts])
      setNewPost("")
      setPostPhoto(null)
      setShowPostForm(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Create Post Section */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <button
          onClick={() => setShowPostForm(!showPostForm)}
          className="w-full text-left p-3 bg-background rounded-xl text-muted-foreground hover:bg-secondary/30 transition-colors text-sm"
        >
          Düşüncelerinizi paylaşın...
        </button>
      </div>

      {/* Post Creation Form */}
      {showPostForm && (
        <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
          <h4 className="font-semibold text-sm">📸 Yeni Paylaşım</h4>

          {/* Photo Preview */}
          {postPhoto ? (
            <div className="relative">
              <img
                src={postPhoto}
                alt="Paylaşılacak fotoğraf"
                className="w-full rounded-xl object-cover max-h-64"
              />
              <button
                onClick={() => setPostPhoto(null)}
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="bg-background rounded-xl p-6 border border-dashed border-border flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">📷</span>
              <p className="text-xs text-muted-foreground text-center">Fotoğraf seçin (opsiyonel)</p>
            </div>
          )}

          {/* Camera/Gallery Buttons */}
          <div className="grid grid-cols-2 gap-2">
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
              onChange={handlePhotoCapture}
              className="hidden"
            />
            <input ref={galleryRef} type="file" accept="image/*" onChange={handlePhotoCapture} className="hidden" />
          </div>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Çevre hakkında düşüncelerinizi paylaşın..."
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground resize-none"
            rows={3}
          />

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between p-2 bg-background rounded-lg">
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

          <div className="flex gap-2">
            <button
              onClick={handleCreatePost}
              disabled={!newPost.trim()}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📤 Paylaş
            </button>
            <button
              onClick={() => {
                setShowPostForm(false)
                setPostPhoto(null)
              }}
              className="flex-1 bg-background border border-border rounded-lg py-2 text-xs font-semibold hover:bg-secondary/30 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Nearby Natural Areas - Compact */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm px-1">🌳 Yakındaki Doğal Alanlar</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {nearbyAreas.map((area) => (
            <div
              key={area.id}
              className="bg-card rounded-lg p-2 border border-border flex-shrink-0 w-36 hover:border-primary/50 transition-colors"
            >
              <p className="font-medium text-xs truncate">{area.name}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{area.type}</p>
              <p className="text-xs font-semibold text-primary mt-1">{area.distance}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Section */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm px-1">📰 Paylaşım Feed'i</h3>
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-card rounded-2xl overflow-hidden border border-border">
              {/* Post Header */}
              <div className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{post.author[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-3">
                <div className="flex items-start gap-2 mb-2">
                  <p className="text-sm text-foreground flex-1">
                    {translatedPostContent[post.id] || post.content}
                  </p>
                  <TranslateButton 
                    text={post.content} 
                    compact={true}
                    onTranslate={(translated) => {
                      setTranslatedPostContent(prev => ({
                        ...prev,
                        [post.id]: translated
                      }))
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-2">📍 {post.location}</p>
              </div>

              {/* Post Image */}
              {post.image && (
                <div className="aspect-video overflow-hidden bg-secondary/20 mt-2 mx-3 rounded-lg">
                  <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Post Interactions */}
              <div className="p-3 flex items-center gap-4 text-xs text-muted-foreground border-t border-border">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-1 transition-colors ${post.isLiked ? "text-red-500" : "hover:text-foreground"}`}
                >
                  {post.isLiked ? "❤️" : "🤍"} {post.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                  💬 {post.comments}
                </button>
                <button
                  onClick={() => handleSharePost(post.id)}
                  className="flex items-center gap-1 hover:text-foreground transition-colors ml-auto"
                >
                  📤 Paylaş
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-2">
        <button
          onClick={() => setShowComments(showComments === "1" ? null : "1")}
          className="flex items-center justify-between w-full px-1 py-2 hover:bg-secondary/20 rounded transition-colors"
        >
          <h3 className="font-semibold text-sm">💬 Topluluk Yorumları</h3>
          <span className="text-xs text-muted-foreground">{comments["1"]?.length || 0} yorum</span>
        </button>

        {showComments === "1" && (
          <div className="bg-card rounded-2xl p-3 border border-border space-y-3">
            {comments["1"]?.map((comment) => (
              <div key={comment.id} className="bg-background rounded-lg p-2">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-semibold text-xs">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <p className="text-xs text-foreground flex-1">
                    {translatedCommentText[comment.id] || comment.text}
                  </p>
                  <TranslateButton 
                    text={comment.text} 
                    compact={true}
                    onTranslate={(translated) => {
                      setTranslatedCommentText(prev => ({
                        ...prev,
                        [comment.id]: translated
                      }))
                    }}
                  />
                </div>
                <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  ❤ {comment.likes}
                </button>
              </div>
            ))}

            {/* Add Comment */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorum yapın..."
                className="flex-1 bg-background border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
              />
              <button
                onClick={() => handleCommentSubmit("1")}
                className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                Gönder
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Environmental Alert */}
      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-start gap-2">
        <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
        <div>
          <p className="font-semibold text-sm">Çevre Uyarısı</p>
          <p className="text-xs text-muted-foreground mt-1">
            Bölgede hava kirliliği artmıştır. Açık hava aktivitelerine dikkat edin.
          </p>
        </div>
      </div>
    </div>
  )
}
