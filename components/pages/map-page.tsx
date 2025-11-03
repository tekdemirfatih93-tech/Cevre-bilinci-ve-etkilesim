"use client"

import { useState, useEffect } from "react"

interface EnvironmentalData {
  aqi: number
  pm25: number
  pm10: number
  no2: number
  o3: number
  co: number
  so2: number
}

interface TransportInfo {
  type: string
  distance: number
  duration: number
  trafficLevel: "Hafif" | "Orta" | "Yoğun"
}


export function MapPage() {
  const [location, setLocation] = useState({ lat: 41.0082, lon: 28.9784, name: "İstanbul" })
  const [weather, setWeather] = useState<any>(null)
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null)
  const [transport, setTransport] = useState<TransportInfo[]>([])
  const [activeTab, setActiveTab] = useState("overview")


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: "Şu Anki Konum",
        })
      })
    }

    // Mock weather data
    setWeather({
      temp: 22,
      feelsLike: 20,
      condition: "Bulutlu",
      humidity: 65,
      windSpeed: 12,
      windDirection: "KB",
      uvIndex: 4,
      visibility: 10,
      pressure: 1013,
    })

    // Mock environmental data
    setEnvironmentalData({
      aqi: 68,
      pm25: 25,
      pm10: 45,
      no2: 35,
      o3: 55,
      co: 0.8,
      so2: 5,
    })

    // Mock transport data
    setTransport([
      { type: "🚇 Metro", distance: 0.5, duration: 15, trafficLevel: "Hafif" },
      { type: "🚌 Otobüs", distance: 1.2, duration: 25, trafficLevel: "Orta" },
      { type: "🚴 Bisiklet", distance: 2.5, duration: 20, trafficLevel: "Hafif" },
    ])
  }, [])

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-600"
    if (aqi <= 100) return "text-yellow-600"
    if (aqi <= 150) return "text-orange-600"
    if (aqi <= 200) return "text-red-600"
    if (aqi <= 300) return "text-purple-600"
    return "text-red-800"
  }

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return "İyi"
    if (aqi <= 100) return "Uygun"
    if (aqi <= 150) return "Hassas Gruplar İçin Olumsuz"
    if (aqi <= 200) return "Sağlıksız"
    if (aqi <= 300) return "Çok Sağlıksız"
    return "Tehlikeli"
  }

  return (
    <div className="space-y-4 p-4">
      {/* Location Card */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 border border-primary/30">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">📍 Şu Anki Konum</p>
            <h2 className="text-lg font-bold">{location.name}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E
            </p>
          </div>
          <button className="p-2 bg-background rounded-full hover:bg-secondary/50 transition-colors">🧭</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          Genel Bakış
        </button>
        <button
          onClick={() => setActiveTab("environment")}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "environment" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          Çevre
        </button>
        <button
          onClick={() => setActiveTab("transport")}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "transport" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          Ulaşım
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && weather && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">⛅ Hava Durumu</h3>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-5xl font-bold text-primary mb-1">{weather.temp}°</p>
                <p className="text-sm text-muted-foreground">{weather.condition}</p>
                <p className="text-xs text-muted-foreground">Hissedilen: {weather.feelsLike}°</p>
              </div>
              <span className="text-4xl">☁️</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-background rounded-lg p-2">
                <p className="text-2xl mb-1">💧</p>
                <p className="text-xs font-semibold">{weather.humidity}%</p>
                <p className="text-xs text-muted-foreground">Nem</p>
              </div>
              <div className="bg-background rounded-lg p-2">
                <p className="text-2xl mb-1">💨</p>
                <p className="text-xs font-semibold">{weather.windSpeed}km/s</p>
                <p className="text-xs text-muted-foreground">{weather.windDirection}</p>
              </div>
              <div className="bg-background rounded-lg p-2">
                <p className="text-2xl mb-1">☀️</p>
                <p className="text-xs font-semibold">UV {weather.uvIndex}</p>
                <p className="text-xs text-muted-foreground">İndeks</p>
              </div>
            </div>
          </div>

          {/* Air Quality Index */}
          {environmentalData && (
            <div className="bg-card rounded-2xl p-4 border border-border">
              <h4 className="font-semibold text-sm mb-3">🌿 Hava Kalitesi İndeksi</h4>
              <div className="text-center mb-3">
                <p className={`text-4xl font-bold ${getAQIColor(environmentalData.aqi)}`}>{environmentalData.aqi}</p>
                <p className="text-sm font-semibold mt-1">{getAQILabel(environmentalData.aqi)}</p>
              </div>
              <div className="w-full bg-background rounded-full h-2 mb-3">
                <div
                  className={`h-full rounded-full ${
                    environmentalData.aqi <= 50
                      ? "bg-green-500"
                      : environmentalData.aqi <= 100
                        ? "bg-yellow-500"
                        : environmentalData.aqi <= 150
                          ? "bg-orange-500"
                          : environmentalData.aqi <= 200
                            ? "bg-red-500"
                            : "bg-purple-600"
                  }`}
                  style={{ width: `${Math.min((environmentalData.aqi / 500) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground text-center">0 (İyi) ← → 500 (Tehlikeli)</p>
            </div>
          )}
        </div>
      )}

      {/* Environment Tab */}
      {activeTab === "environment" && environmentalData && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">📊 Çevre Verileri</h3>
          <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
            {[
              { label: "PM2.5 (ince partikül)", value: environmentalData.pm25, unit: "µg/m³" },
              { label: "PM10 (kaba partikül)", value: environmentalData.pm10, unit: "µg/m³" },
              { label: "Azot Dioksit (NO₂)", value: environmentalData.no2, unit: "ppb" },
              { label: "Ozon (O₃)", value: environmentalData.o3, unit: "ppb" },
              { label: "Karbon Monoksit (CO)", value: environmentalData.co, unit: "ppm" },
              { label: "Kükürt Dioksit (SO₂)", value: environmentalData.so2, unit: "ppb" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-semibold text-sm">
                  {item.value} <span className="text-xs text-muted-foreground">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* City Environmental Info */}
          <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-4 border border-border">
            <h4 className="font-semibold text-sm mb-3">🏙️ İstanbul Çevre İstatistikleri</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yeşil Alan Oranı</span>
                <span className="font-semibold">18.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ormanlık Alan</span>
                <span className="font-semibold">22,500 ha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Su Kaynakları</span>
                <span className="font-semibold">Korunmalı</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nüfus</span>
                <span className="font-semibold">15.5M</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transport Tab */}
      {activeTab === "transport" && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">🚉 Ulaşım ve Trafik Bilgileri</h3>
          {transport.map((item, idx) => (
            <div key={idx} className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm">{item.type}</p>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    item.trafficLevel === "Hafif"
                      ? "bg-green-500/20 text-green-700"
                      : item.trafficLevel === "Orta"
                        ? "bg-yellow-500/20 text-yellow-700"
                        : "bg-red-500/20 text-red-700"
                  }`}
                >
                  {item.trafficLevel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <p className="text-muted-foreground">Mesafe</p>
                  <p className="font-semibold text-foreground">{item.distance} km</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Süre</p>
                  <p className="font-semibold text-foreground">~{item.duration} dk</p>
                </div>
              </div>
            </div>
          ))}

          {/* Traffic Alert */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-3">
            <p className="text-xs font-semibold text-yellow-700 mb-1">⚠️ Trafik Uyarısı</p>
            <p className="text-xs text-muted-foreground">Ana caddede hafif trafik yoğunluğu. Metro önerilir.</p>
          </div>
        </div>
      )}

    </div>
  )
}
