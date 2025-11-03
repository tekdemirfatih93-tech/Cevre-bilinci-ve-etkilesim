# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Proje Özeti

"Çevre ve Özgürlük" çevre bilinci ve sosyal etkileşim odaklı bir Next.js uygulamasıdır. v0.app ile otomatik senkronize edilen ve Vercel'da dağıtılan bir sosyal ağ platformudur. Kullanıcılar çevre sorunlarını paylaşabilir, etkinliklere katılabilir, şikayet oluşturabilir ve doğal alanları keşfedebilir.

## Geliştirme Komutları

### Temel Komutlar
- **Geliştirme sunucusu**: `npm run dev`
- **Üretim build**: `npm run build`
- **Üretim sunucusu**: `npm start`
- **Linting**: `npm run lint`

### Önemli Notlar
- Build sırasında TypeScript ve ESLint hataları görmezden gelinir (`next.config.mjs`'da yapılandırılmış)
- Görsel optimizasyonu kapalı (`unoptimized: true`)

## Mimari Yapı

### Ana Klasör Yapısı

```
app/                 # Next.js App Router sayfaları
├── auth/           # Authentication context ve logic
├── admin/          # Admin panel sayfası
├── layout.tsx      # Root layout
└── page.tsx        # Ana sayfa (tab routing logic burada)

components/          # React componentleri
├── auth-pages/     # Login ve Register sayfaları
├── pages/          # Ana sayfa bileşenleri (HomePage, MapPage, EventsPage, vb.)
├── ui/             # Radix UI tabanlı yeniden kullanılabilir bileşenler
├── app-layout.tsx  # Ana layout wrapper (header, footer, navigation)
├── bottom-nav.tsx  # Mobil alt navigasyon
├── mobile-header.tsx
└── live-support-chat.tsx

lib/                # Utility fonksiyonları
├── utils.ts        # cn() - Tailwind sınıf birleştirme
└── performance-utils.ts  # Performans hesaplama fonksiyonları

types/              # TypeScript type tanımları
└── complaint.ts    # Şikayet ve reply tipleri

hooks/              # Custom React hooks
├── use-mobile.ts
└── use-toast.ts
```

### Routing Mimarisi

Bu proje **tek sayfa SPA** yapısındadır:
- `app/page.tsx` tüm tab routing'i client-side olarak yönetir
- 5 ana tab: `home`, `map`, `share`, `events`, `profile`
- Her tab `components/pages/` altında ayrı component olarak tanımlı
- Tab değişimleri `AppLayout` componentine prop olarak geçilir

### Authentication Sistemi

- `app/auth/context.tsx`: AuthContext ve AuthProvider
- LocalStorage tabanlı mock authentication (üretimde backend ile değiştirilmeli)
- Kullanıcı tipleri: `User` interface'i rank, badges, contributionPoints içerir
- Admin kontrolü: `user.isAdmin` boolean flag
- Admin özel giriş: `admin@cevre.com` veya `mod@cevre.com`

### Admin Panel

- `/admin` route'unda erişilebilir
- Yetki seviyeleri: Kullanıcı (0), Aktif Destekçi (1), Moderatör (2), Admin (3)
- Özellikler:
  - Kullanıcı yönetimi (durum, yetki, badge yönetimi)
  - Şikayet yönetimi (yanıtlama, durum güncelleme)
  - İçerik moderasyonu
  - Etkinlik yönetimi
  - İstatistikler ve raporlama

### Performans Sistemi

`lib/performance-utils.ts` admin/moderatör performansını ölçer:
- **Puanlama Sistemi**: 
  - Aktiflik süresi (max 30 puan)
  - Cevaplanmış şikayetler (max 40 puan)
  - Çözüm oranı (max 30 puan)
  - Son aktivite bonusu (+5 puan)
- **Dereceler**: Başlangıç → Orta → İleri → Uzman → Elit
- Fonksiyonlar: `calculatePerformanceScore()`, `getPerformanceRank()`, `updateUserPerformance()`

### Şikayet Sistemi

- Tipler: `types/complaint.ts`
- Kategoriler: Orman, Su, Hava, Atık
- Durumlar: Bekliyor, İnceleniyor, Çözüldü
- Reply sistemi ile admin/moderatör cevap verebilir
- Şikayetlere dosya ekleme desteği (`attachments` array)

### Ana Sayfalar

**HomePage**: 
- Sosyal feed (post, like, comment)
- Yakındaki doğal alanlar listesi
- Post oluşturma formu

**MapPage**:
- Konum bilgisi (latitude/longitude)
- Hava durumu bilgileri
- Hava Kalitesi İndeksi (AQI) ve çevre verileri (PM2.5, PM10, NO2, O3, CO, SO2)
- Ulaşım seçenekleri (metro, otobüs, bisiklet)

**SharePage**: Gönderi paylaşma ve içerik oluşturma

**EventsPage**: Çevre etkinliklerini listeleme ve katılım

**ProfilePage**: Kullanıcı profili, rozetler, katkı puanları

## Stil ve UI

- **Framework**: Tailwind CSS v4.1.9
- **Component Library**: Radix UI
- **Utilities**: `class-variance-authority`, `tailwind-merge`
- **Dark Mode**: `next-themes` ile tema desteği
- Path alias: `@/*` kök dizini işaret eder

## TypeScript Yapılandırması

- Target: ES6
- Strict mode aktif
- Path alias: `@/*` tüm dosyalar için kök dizini temsil eder
- JSX: `react-jsx` (Next.js 16 ile React 19 kullanılıyor)

## Vercel Deployment

- Otomatik deployment: v0.app'ten push → Vercel build
- Live URL: [Vercel deployment](https://vercel.com/tekdemirfatih93-5729s-projects/v0-cevre-and-oezguerluek)
- v0.app chat URL: https://v0.app/chat/sPw8uag4OhU

## Geliştirme Notları

- **Mock Data**: Tüm authentication, posts, complaints, events şu anda mock data kullanıyor
- **Production TODO**: Backend API entegrasyonu gerekli
- **Lokalizasyon**: Tüm UI Türkçe
- **Responsive**: Mobil-first tasarım, bottom navigation mobil cihazlar için optimize edilmiş
