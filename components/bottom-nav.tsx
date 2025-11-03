"use client"

interface BottomNavProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "home", label: "Anasayfa", icon: "🏠" },
  { id: "map", label: "Harita", icon: "🗺️" },
  { id: "events", label: "Etkinlik", icon: "📅" },
  { id: "profile", label: "Profil", icon: "👤" },
]

export function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 safe-area-bottom">
      <div className="flex items-center justify-around max-w-2xl mx-auto w-full">
        {navItems.map((item) => {
          const isActive = currentTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center
                w-full h-20 gap-1
                transition-all duration-200 ease-in-out
                touch-target
                select-none
                active:scale-95
                ${
                  isActive
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground active:bg-secondary/30"
                }
              `}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-xl sm:text-2xl">{item.icon}</span>
              <span className="text-xs sm:text-sm font-semibold leading-tight">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
