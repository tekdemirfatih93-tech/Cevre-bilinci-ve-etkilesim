"use client"

interface MobileHeaderProps {
  currentTab: string
}

export function MobileHeader({ currentTab }: MobileHeaderProps) {
  const getHeaderTitle = () => {
    const titles: Record<string, string> = {
      home: "Çevre & Özgürlük",
      map: "Harita",
      share: "Paylaş",
      events: "Etkinlikler",
      profile: "Profilim",
    }
    return titles[currentTab] || "Çevre & Özgürlük"
  }

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border safe-area-top">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg sm:text-xl text-primary-foreground font-bold">🌿</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-balance truncate">{getHeaderTitle()}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="p-2 hover:bg-secondary/50 rounded-full transition-colors active:scale-95 touch-target"
            aria-label="Bildirimler"
          >
            <span className="text-lg sm:text-xl">🔔</span>
          </button>
          <button
            className="p-2 hover:bg-secondary/50 rounded-full transition-colors active:scale-95 touch-target"
            aria-label="Ayarlar"
          >
            <span className="text-lg sm:text-xl">⚙️</span>
          </button>
        </div>
      </div>
    </header>
  )
}
