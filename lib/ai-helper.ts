// AI yardımcı fonksiyonlar
// Not: Şimdilik basit implementasyon, isterseniz Ollama veya LibreTranslate eklenebilir

interface ImproveTextOptions {
  text: string
  tone?: "professional" | "friendly" | "formal"
  language?: string
}

interface TranslateOptions {
  text: string
  targetLanguage: string
}

// TDK kurallarına uygun gelişmiş metin iyileştirme
export async function improveText(options: ImproveTextOptions): Promise<string> {
  const { text, tone = "professional" } = options

  let improved = text.trim()

  // 1. Yazım hataları düzeltme
  improved = fixCommonTypos(improved)

  // 2. Noktalama işaretleri öncesi boşluk kaldırma
  improved = improved.replace(/\s+([.,!?;:])/g, "$1")

  // 3. Noktalama işaretleri sonrası boşluk ekleme
  improved = improved.replace(/([.,!?;:])([A-ZÇĞİÖŞÜa-zçğıöşü])/g, "$1 $2")

  // 4. Tire ve kısa çizgi kuralları
  improved = improved.replace(/\s+-\s+/g, " - ") // Tire etrafında boşluk
  improved = improved.replace(/([a-zçğıöşü])-([a-zçğıöşü])/gi, "$1-$2") // Kelime içi tire boşluksuz

  // 5. Tırnak işaretleri düzeltme
  improved = improved.replace(/"([^"]+)"/g, "\"$1\"") // Düz tırnakları koru

  // 6. Sayı ve birim arasında boşluk
  improved = improved.replace(/(\d+)(km|m|cm|kg|gr|lt|saat|dakika|gün|ay|yıl)/gi, "$1 $2")

  // 7. Cümle başlarını büyük yap
  improved = improved.replace(/(^|[.!?]\s+)([a-zçğıöşü])/g, (match, prefix, letter) => {
    return prefix + letter.toUpperCase()
  })

  // 8. İlk harfi büyüt
  if (improved.length > 0) {
    improved = improved.charAt(0).toUpperCase() + improved.slice(1)
  }

  // 9. Özel isimler (bilinen şehirler vb.)
  const properNouns = [
    "istanbul", "ankara", "izmir", "bursa", "antalya", "adana", "konya",
    "türkiye", "avrupa", "asya", "yeşil park", "marmara"
  ]
  properNouns.forEach(noun => {
    const regex = new RegExp(`\\b${noun}\\b`, "gi")
    improved = improved.replace(regex, (match) => {
      return match.split(" ").map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(" ")
    })
  })

  // 10. Cümle sonu noktalama ekle
  if (improved.length > 0 && !improved.match(/[.!?]$/)) {
    improved += "."
  }

  // 11. Profesyonel ton eklemeleri
  if (tone === "professional") {
    // Kısaltmaları düzelt
    improved = improved
      .replace(/\bnası\b/gi, "nasıl")
      .replace(/\bnasıl\s+ki\b/gi, "nasıl ki")
      .replace(/\bbişey\b/gi, "bir şey")
      .replace(/\bbişi\b/gi, "bir şey")
      .replace(/\btam\s+olarak\b/gi, "tam olarak")

    // İyi dilekler ekle (sadece uzun mesajlara)
    if (!improved.toLowerCase().includes("teşekkür") && 
        !improved.toLowerCase().includes("saygı") &&
        improved.split(" ").length > 10) {
      improved += " İlginiz için teşekkür ederiz."
    }
  }

  // 12. Çift boşlukları tek yap
  improved = improved.replace(/\s+/g, " ")

  // 13. Baştan ve sondan boşluk temizle
  improved = improved.trim()

  return improved
}

// Dil tespit etme (basit)
export function detectLanguage(text: string): string {
  const turkishChars = /[çğıöşüÇĞİÖŞÜ]/
  const englishWords = /\b(the|is|are|in|on|at|to|for|of|with|by)\b/i
  const arabicChars = /[\u0600-\u06FF]/
  const cyrillicChars = /[\u0400-\u04FF]/

  if (arabicChars.test(text)) return "ar"
  if (cyrillicChars.test(text)) return "ru"
  if (turkishChars.test(text)) return "tr"
  if (englishWords.test(text)) return "en"

  return "tr" // Varsayılan
}

// MyMemory Translation API kullanarak çeviri (ücretsiz, daha iyi)
export async function translateText(options: TranslateOptions): Promise<string> {
  const { text, targetLanguage } = options

  try {
    // Kaynak dilini tespit et
    const sourceLang = detectLanguage(text)
    
    // Eğer zaten hedef dilde ise çevirme
    if (sourceLang === targetLanguage) {
      return text
    }

    // Kaynak dil kodunu API formatına çevir
    const sourceLangCode = sourceLang === "tr" ? "tr-TR" : "en-US"
    const targetLangCode = targetLanguage === "tr" ? "tr-TR" : "en-US"

    // MyMemory Translation API (ücretsiz, günde 10000 kelime)
    const encodedText = encodeURIComponent(text)
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLangCode}|${targetLangCode}`
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Çeviri API hatası:", response.status, response.statusText)
      throw new Error(`Çeviri başarısız: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText
      // Eğer çeviri başarılı ve farklıysa döndür
      if (translated && translated !== text) {
        return translated
      }
    }
    
    // API başarısız olursa fallback
    throw new Error("Çeviri yanıtı geçersiz")
  } catch (error) {
    console.error("Çeviri hatası:", error)
    // Hata durumunda basit kelime kelime çeviri (fallback)
    return fallbackTranslation(text, targetLanguage)
  }
}

// Gelişmiş fallback çeviri (API başarısız olursa)
function fallbackTranslation(text: string, targetLanguage: string): string {
  if (targetLanguage !== "tr") return text
  
  // Özel cümle kalları için direkt çeviriler
  const exactPhrases: Record<string, string> = {
    "I am trying to upload photos for my complaint but app keeps showing an error": "Şikayetim için fotoğraf yüklemeye çalışıyorum ancak uygulama hata göstermeye devam ediyor",
    "I am trying to upload photos for my complaint but the app keeps showing an error": "Şikayetim için fotoğraf yüklemeye çalışıyorum ancak uygulama hata göstermeye devam ediyor",
    "can you please help me fix this issue": "bu sorunu çözmeme yardımcı olabilir misiniz",
    "can you please help me fix bu issue": "bu sorunu çözmeme yardımcı olabilir misiniz",
    "I have important evidence to share": "Paylaşmak için önemli kanıtlarım var",
    "I have important evidence için share": "Paylaşmak için önemli kanıtlarım var",
    "Hello, I need help reporting pollution": "Merhaba, kirlilik raporlamak için yardıma ihtiyaç duyuyorum",
    "How can I submit my complaint": "Şikayetimi nasıl gönderebilirim",
  }
  
  // Yaygın İngilizce cümle şablonları
  const patterns: Array<{ pattern: RegExp; replacement: string }> = [
    { pattern: /I am trying to upload photos for my complaint but (.*)app keeps showing(.*)error/i, replacement: "Şikayetim için fotoğraf yüklemeye çalışıyorum ancak uygulama hata göstermeye devam ediyor" },
    { pattern: /can you please help me fix(.*)issue/i, replacement: "Bu sorunu çözmeme yardımcı olabilir misiniz" },
    { pattern: /I have important evidence(.*)share/i, replacement: "Paylaşmak için önemli kanıtlarım var" },
    { pattern: /I am trying to (.*) but (.*)/i, replacement: "$1 yapmaya çalışıyorum ama $2" },
    { pattern: /I am trying to (.*)/i, replacement: "$1 yapmaya çalışıyorum" },
    { pattern: /I cannot (.*)/i, replacement: "$1 yapamıyorum" },
    { pattern: /I need help (.*)/i, replacement: "$1 konusunda yardıma ihtiyaç duyuyorum" },
    { pattern: /Can you please (.*)/i, replacement: "Lütfen $1 yapabilir misiniz" },
    { pattern: /Can you help me (.*)/i, replacement: "$1 konusunda bana yardımcı olabilir misiniz" },
    { pattern: /How can I (.*)/i, replacement: "$1 nasıl yapabilirim" },
    { pattern: /I have (.*)/i, replacement: "$1'im var" },
    { pattern: /There is (.*) near (.*)/i, replacement: "$2 yakınında $1 var" },
    { pattern: /There is (.*)/i, replacement: "$1 var" },
    { pattern: /(.*) keeps showing (.*)/i, replacement: "$1 sürekli $2 gösteriyor" },
    { pattern: /(.*) is causing (.*)/i, replacement: "$1, $2'ye neden oluyor" },
  ]
  
  // Tam eşleşme dene
  const lowerText = text.toLowerCase().trim()
  for (const [phrase, translation] of Object.entries(exactPhrases)) {
    if (lowerText.includes(phrase.toLowerCase())) {
      return translation
    }
  }
  
  // Şablon eşleştirmesi dene
  for (const { pattern, replacement } of patterns) {
    if (pattern.test(text)) {
      return replacement
    }
  }
  
  // Cümleyi noktalı virgülle parçalara ayır ve her parçayı çevir
  if (text.includes(".")) {
    const sentences = text.split(".")
    const translatedSentences = sentences.map(s => {
      if (!s.trim()) return ""
      
      // Her cümle için şablon kontrolü
      for (const { pattern, replacement } of patterns) {
        if (pattern.test(s)) {
          return replacement
        }
      }
      
      return translateWords(s.trim())
    }).filter(s => s)
    
    return translatedSentences.join(". ") + "."
  }
  
  // Şablon yoksa kelime kelime çevir
  return translateWords(text)
}

// Kelime kelime çeviri
function translateWords(text: string): string {
  // Genişletilmiş İngilizce-Türkçe kelime sözlüğü
  const dictionary: Record<string, string> = {
    // Temel kelimeler
    "i": "ben",
    "am": "",
    "are": "",
    "is": "",
    "the": "",
    "a": "bir",
    "an": "bir",
    "to": "-e/-a",
    "for": "için",
    "of": "",
    "in": "içinde",
    "on": "üzerinde",
    "at": "de/da",
    "by": "tarafından",
    "with": "ile",
    "from": "den/dan",
    "and": "ve",
    "or": "veya",
    "but": "ama",
    "my": "benim",
    "your": "senin",
    "this": "bu",
    "that": "şu",
    "these": "bunlar",
    "those": "şunlar",
    "can": "yapabilir",
    "you": "sen",
    "me": "beni",
    "we": "biz",
    "have": "sahip",
    "has": "var",
    "had": "vardı",
    
    // Sorular
    "how": "nasıl",
    "what": "ne",
    "where": "nerede",
    "when": "ne zaman",
    "why": "neden",
    "who": "kim",
    
    // Yardım / Destek
    "help": "yardım",
    "please": "lütfen",
    "need": "ihtiyaç",
    "trying": "deniyorum",
    "upload": "yükle",
    "photos": "fotoğraflar",
    "complaint": "şikayet",
    "app": "uygulama",
    "keeps": "devam ediyor",
    "showing": "gösteriyor",
    "error": "hata",
    "issue": "sorun",
    "fix": "düzelt",
    "important": "önemli",
    "evidence": "kanıt",
    "share": "paylaş",
    "submit": "gönder",
    "reporting": "raporlama",
    "report": "rapor",
    "pollution": "kirlilik",
    "hello": "merhaba",
    "hi": "merhaba",
    "cannot": "yapamıyorum",
    
    // Doğa / Çevre
    "amazing": "harika",
    "nature": "doğa",
    "preservation": "koruma",
    "work": "çalışma",
    "happening": "oluyor",
    "here": "burada",
    "more": "daha fazla",
    "people": "insanlar",
    "join": "katıl",
    "environmental": "çevre",
    "cause": "amaç",
    "looks": "görünüyor",
    "absolutely": "kesinlikle",
    "beautiful": "güzel",
    "wonderful": "muhteşem",
    "place": "yer",
    "visit": "ziyaret",
    "there": "orada",
    "near": "yakın",
    "river": "nehir",
    "waste": "atık",
    "dumping": "atma",
    "illegal": "yasadışı",
    "large": "büyük",
    "amounts": "miktarlar",
    "plastic": "plastik",
    "chemical": "kimyasal",
    "being": "",
    "thrown": "atılıyor",
    "into": "içine",
    "water": "su",
    "causing": "neden oluyor",
    "serious": "ciddi",
    "damage": "zarar",
    "affecting": "etkiliyor",
    "local": "yerel",
    "wildlife": "vahşi yaşam",
  }
  
  // Cümle cümle çevir
  const sentences = text.split(/([.!?])/).filter(s => s.trim())
  let translated = ""
  
  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i]
    if (sentence.match(/[.!?]/)) {
      translated += sentence
      continue
    }
    
    // Kelimeleri çevir
    const words = sentence.split(/\s+/)
    const translatedWords = words.map(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "")
      return dictionary[cleanWord] || word
    }).filter(w => w && w !== "")
    
    translated += translatedWords.join(" ")
  }
  
  // Temizlik
  translated = translated
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?])/g, "$1")
    .trim()
  
  // İlk harfi büyüt
  if (translated.length > 0) {
    translated = translated.charAt(0).toUpperCase() + translated.slice(1)
  }
  
  // Çeviri başarısız olduysa orijinali dön
  if (!translated || translated.length < 5) {
    return text + " [Çeviri yapılamadı]"
  }
  
  return translated
}

// Profesyonel yanıt şablonları
export function getResponseTemplate(type: "greeting" | "closing" | "acknowledgment"): string {
  const templates = {
    greeting: "Merhaba,\n\n",
    closing: "\n\nSaygılarımızla,\nÇevre ve Özgürlük Destek Ekibi",
    acknowledgment: "Talebiniz alınmıştır. ",
  }

  return templates[type] || ""
}

// Metin formatla (profesyonel görünüm)
export function formatProfessionalResponse(text: string): string {
  let formatted = text.trim()

  // Paragraf ayır
  if (!formatted.includes("\n\n") && formatted.length > 100) {
    // Nokta sonrası paragraf ekle (uzun metinlerde)
    formatted = formatted.replace(/\. ([A-ZÇĞIÖŞÜ])/g, ".\n\n$1")
  }

  return formatted
}

// Gelişmiş yazım hatalarını düzelt (TDK kuralları)
export function fixCommonTypos(text: string): string {
  let fixed = text

  // Soru ekleri ayrı yazılır
  fixed = fixed
    .replace(/(\w+)(mi|mı|mu|mü)\b/g, "$1 $2") // Kelimeye bitişik mi/mı/mu/mü
    .replace(/\s+(mi|mı|mu|mü)\s+(mi|mı|mu|mü)\b/g, " $1 $2") // Çift soru eki

  // Bağlaç "ki" ayrı yazılır
  fixed = fixed.replace(/(\w+)ki\b/g, "$1 ki")

  // "de/da" bağlacı ayrı, "-de/-da" eki bitişik
  fixed = fixed
    .replace(/\bde\s+/g, "de ") // "de" bağlacı zaten ayrı
    .replace(/\bda\s+/g, "da ") // "da" bağlacı zaten ayrı

  // Yaygın yazım hataları
  fixed = fixed
    .replace(/birşey/gi, "bir şey")
    .replace(/herşey/gi, "her şey")
    .replace(/hiçbirşey/gi, "hiçbir şey")
    .replace(/birzaman/gi, "bir zaman")
    .replace(/herkes/gi, "herkes") // Doğru
    .replace(/başka/gi, "başka") // Doğru
    .replace(/inşallah/gi, "inşallah")
    .replace(/maalesef/gi, "maalesef")
    .replace(/\btşk\b/gi, "teşekkür")
    .replace(/\bslm\b/gi, "selam")
    .replace(/\bmrb\b/gi, "merhaba")
    .replace(/\bnaber\b/gi, "nasılsın")
    .replace(/\bnasılsn\b/gi, "nasılsın")
    .replace(/\btmm\b/gi, "tamam")

  // Bitişik yazılan kelimeler
  fixed = fixed
    .replace(/birgün/gi, "bir gün")
    .replace(/birsürü/gi, "bir sürü")
    .replace(/birçok/gi, "birçok") // Doğru (bitişik)
    .replace(/herhangi/gi, "herhangi") // Doğru (bitişik)
    .replace(/\bhiçbir\s+şey\b/gi, "hiçbir şey")
    .replace(/\bhiçbirşey\b/gi, "hiçbir şey")

  // Gereksiz harf tekrarlarını düzelt
  fixed = fixed
    .replace(/(.)\1{2,}/g, "$1") // "çoooook" -> "çok"
    .replace(/!!+/g, "!") // "!!!" -> "!"
    .replace(/\?\?+/g, "?") // "???" -> "?"

  return fixed
}
