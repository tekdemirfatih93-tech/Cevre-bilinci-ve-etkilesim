"use client"

import { useState, useEffect } from "react"


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
  ])
  const [showPostForm, setShowPostForm] = useState(false)
  const [newPost, setNewPost] = useState("")

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
      ],
    })
  }, [])


  const handleCommentSubmit = (postId: string) => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: String(Date.now()),
        author: "Benim Adım",
        text: newComment,
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

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: String(Date.now()),
        author: "Siz",
        content: newPost,
        timestamp: "az önce",
        likes: 0,
        isLiked: false,
        comments: 0,
        location: "İstanbul, Türkiye",
      }
      setPosts([post, ...posts])
      setNewPost("")
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
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Çevre hakkında düşüncelerinizi paylaşın..."
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground resize-none"
            rows={4}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreatePost}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Paylaş
            </button>
            <button
              onClick={() => setShowPostForm(false)}
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
                <p className="text-sm text-foreground mb-2">{post.content}</p>
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
                <p className="text-xs text-foreground mb-2">{comment.text}</p>
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
