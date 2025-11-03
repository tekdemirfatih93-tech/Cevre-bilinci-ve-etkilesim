export interface ComplaintReply {
  id: string
  authorId: string
  authorName: string
  authorRole: string
  message: string
  timestamp: string
}

export interface Complaint {
  id: string
  userId: string
  userName: string
  title: string
  category: string
  description: string
  status: "Bekliyor" | "İnceleniyor" | "Çözüldü"
  attachments?: string[]
  createdAt: string
  replies: ComplaintReply[]
  assignedTo?: string
}
