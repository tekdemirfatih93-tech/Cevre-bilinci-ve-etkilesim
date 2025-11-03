export type PerformanceRank = "Başlangıç" | "Orta" | "İleri" | "Uzman" | "Elit"

export interface PerformanceData {
  activeTimeMinutes: number
  repliedComplaints: number
  resolvedComplaints: number
  lastActiveDate: string
  performanceScore: number
  performanceRank: PerformanceRank
}

/**
 * Performans puanını hesaplar (0-100 arası)
 * - Aktiflik süresi: Her 60 dakika = 10 puan (max 30 puan)
 * - Cevaplanan şikayet: Her cevap = 2 puan (max 40 puan)
 * - Çözülen şikayet oranı: %80+ = 30 puan (max 30 puan)
 * - Son aktivite bonusu: 24 saat içinde = +5 puan
 */
export function calculatePerformanceScore(data: Omit<PerformanceData, "performanceScore" | "performanceRank">): number {
  let score = 0

  // Aktiflik süresi puanı (max 30)
  const activeScore = Math.min((data.activeTimeMinutes / 60) * 10, 30)
  score += activeScore

  // Cevaplanan şikayet puanı (max 40)
  const repliedScore = Math.min(data.repliedComplaints * 2, 40)
  score += repliedScore

  // Çözülen şikayet oranı puanı (max 30)
  if (data.repliedComplaints > 0) {
    const resolveRate = data.resolvedComplaints / data.repliedComplaints
    const resolveScore = resolveRate >= 0.8 ? 30 : resolveRate * 30
    score += resolveScore
  }

  // Son aktivite bonusu (+5 puan)
  const lastActive = new Date(data.lastActiveDate)
  const now = new Date()
  const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)
  
  if (hoursSinceActive <= 24) {
    score += 5
  }

  return Math.min(Math.round(score), 100)
}

/**
 * Performans puanına göre derece döndürür
 */
export function getPerformanceRank(score: number): PerformanceRank {
  if (score >= 90) return "Elit"
  if (score >= 75) return "Uzman"
  if (score >= 60) return "İleri"
  if (score >= 40) return "Orta"
  return "Başlangıç"
}

/**
 * Kullanıcı performans verilerini günceller
 */
export function updateUserPerformance(
  currentData: Partial<PerformanceData>,
  updates: Partial<Omit<PerformanceData, "performanceScore" | "performanceRank">>
): PerformanceData {
  const updatedData = {
    activeTimeMinutes: updates.activeTimeMinutes ?? currentData.activeTimeMinutes ?? 0,
    repliedComplaints: updates.repliedComplaints ?? currentData.repliedComplaints ?? 0,
    resolvedComplaints: updates.resolvedComplaints ?? currentData.resolvedComplaints ?? 0,
    lastActiveDate: updates.lastActiveDate ?? currentData.lastActiveDate ?? new Date().toISOString(),
  }

  const score = calculatePerformanceScore(updatedData)
  const rank = getPerformanceRank(score)

  return {
    ...updatedData,
    performanceScore: score,
    performanceRank: rank,
  }
}

/**
 * Yetkililerin performanslarını karşılaştırır
 */
export function getPerformanceComparison(performances: PerformanceData[]): {
  average: number
  highest: PerformanceData | null
  lowest: PerformanceData | null
} {
  if (performances.length === 0) {
    return { average: 0, highest: null, lowest: null }
  }

  const scores = performances.map((p) => p.performanceScore)
  const average = scores.reduce((a, b) => a + b, 0) / scores.length

  const highest = performances.reduce((max, current) =>
    current.performanceScore > max.performanceScore ? current : max
  )

  const lowest = performances.reduce((min, current) =>
    current.performanceScore < min.performanceScore ? current : min
  )

  return {
    average: Math.round(average),
    highest,
    lowest,
  }
}

/**
 * Performans renk kodunu döndürür
 */
export function getPerformanceColor(score: number): string {
  if (score >= 75) return "text-green-600"
  if (score >= 50) return "text-yellow-600"
  return "text-red-600"
}

/**
 * Performans progress bar renk kodunu döndürür
 */
export function getPerformanceBarColor(score: number): string {
  if (score >= 75) return "bg-green-600"
  if (score >= 50) return "bg-yellow-600"
  return "bg-red-600"
}

/**
 * Aktivite süresini formatlar (örn: "2s 30dk")
 */
export function formatActiveTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins}dk`
  if (mins === 0) return `${hours}s`
  return `${hours}s ${mins}dk`
}

/**
 * Performans iyileştirme önerileri döndürür
 */
export function getPerformanceRecommendations(data: PerformanceData): string[] {
  const recommendations: string[] = []

  // Aktiflik süresi kontrolü
  if (data.activeTimeMinutes < 300) {
    recommendations.push("Daha aktif olmayı deneyin! Günlük en az 2 saat online olmanız önerilir.")
  }

  // Cevaplanan şikayet kontrolü
  if (data.repliedComplaints < 20) {
    recommendations.push("Daha fazla şikayete cevap vererek puanınızı artırabilirsiniz.")
  }

  // Çözüm oranı kontrolü
  const resolveRate = data.repliedComplaints > 0 ? data.resolvedComplaints / data.repliedComplaints : 0
  if (resolveRate < 0.8 && data.repliedComplaints > 0) {
    recommendations.push(`Çözüm oranınızı artırın! Şu anki oran: %${Math.round(resolveRate * 100)}`)
  }

  // Son aktivite kontrolü
  const lastActive = new Date(data.lastActiveDate)
  const now = new Date()
  const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)
  
  if (hoursSinceActive > 48) {
    recommendations.push("Uzun süredir aktif değilsiniz. Düzenli aktivite önemli!")
  }

  if (recommendations.length === 0) {
    recommendations.push("Harika iş çıkarıyorsunuz! Böyle devam edin! 🎉")
  }

  return recommendations
}
