export interface Ticket {
  id: string
  userId: string
  userName: string
  userEmail: string
  subject: string
  description: string
  category: "Teknik" | "Hesap" | "Genel" | "Diğer"
  priority: "Düşük" | "Orta" | "Yüksek" | "Acil"
  status: "Açık" | "İnceleniyor" | "Yanıtlandı" | "Çözüldü" | "Kapalı"
  createdAt: string
  updatedAt: string
  responses: TicketResponse[]
  assignedTo?: string
}

export interface TicketResponse {
  id: string
  ticketId: string
  sender: string
  senderType: "user" | "admin" | "system"
  message: string
  timestamp: string
  attachments?: string[]
}

export interface LiveChatMessage {
  id: string
  chatRoomId: string
  sender: string
  senderEmail: string
  senderType: "user" | "admin" | "bot"
  message: string
  timestamp: string
  read: boolean
}

export interface ChatRoom {
  id: string
  userId: string
  userName: string
  userEmail: string
  status: "waiting" | "active" | "closed"
  assignedAdmin?: string
  messages: LiveChatMessage[]
  createdAt: string
  lastActivity: string
}
