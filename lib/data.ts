export interface LocalizedString {
  tr: string
  en: string
}

export interface Activity {
  id: string
  name: LocalizedString
  slug: string
  description: LocalizedString
  shortDescription: LocalizedString
  category: string
  categorySlug: string
  image: string
  minPrice: number
  maxPrice: number
  duration: LocalizedString
  location: LocalizedString
  rating: number
  reviewCount: number
  featured: boolean
  providers: Provider[]
}

export interface Provider {
  id: string
  name: string
  slug: string
  logo: string
  description: LocalizedString
  rating: number
  reviewCount: number
  verified: boolean
  activityIds: string[]
  location: string
  phone: string
  email: string
  website: string
  founded: number
  activities: ProviderActivity[]
}

export interface ProviderActivity {
  activityId: string
  price: number
  originalPrice?: number
  duration: string
  includes: string[]
  availableDates: string[]
  maxParticipants: number
  minParticipants: number
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
  activityId?: string
  providerId?: string
}

export const categories = [
  { name: "Doga Sporlari", slug: "doga-sporlari", icon: "Mountain" },
  { name: "Su Sporlari", slug: "su-sporlari", icon: "Waves" },
  { name: "Macera", slug: "macera", icon: "Compass" },
  { name: "Workshop", slug: "workshop", icon: "Palette" },
  { name: "Kultur & Sanat", slug: "kultur-sanat", icon: "Landmark" },
]

export const activities: Activity[] = [
  {
    id: "1",
    name: { tr: "Kano Turu", en: "Canoe Tour" },
    slug: "kano-turu",
    description: {
      tr: "Istanbul Bogazinda esiz bir kano deneyimi yasin. Profesyonel rehberlerimiz esliginde guvenli ve keyifli bir tur sizi bekliyor. Sabahın erken saatlerinde Bogazin dingin sularinda kurek cekerken, sehrin muhtesem siluetini izleme firsati yakalayin.",
      en: "Experience a unique canoe tour on the Bosphorus. A safe and enjoyable tour awaits you with our professional guides. Catch the opportunity to watch the magnificent silhouette of the city while rowing in the calm waters of the Bosphorus in the early morning."
    },
    shortDescription: { 
      tr: "Istanbul Bogazinda unutulmaz bir kano macerasi", 
      en: "An unforgettable canoe adventure on the Bosphorus" 
    },
    category: "Su Sporlari",
    categorySlug: "su-sporlari",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    minPrice: 350,
    maxPrice: 600,
    duration: { tr: "2-3 saat", en: "2-3 hours" },
    location: { tr: "Bebek, Istanbul", en: "Bebek, Istanbul" },
    rating: 4.8,
    reviewCount: 234,
    featured: true,
    providers: []
  },
  {
    id: "2",
    name: { tr: "Paintball", en: "Paintball" },
    slug: "paintball",
    description: {
      tr: "Adrenalin dolu bir paintball deneyimi icin hazir misin? Genis alanlar, profesyonel ekipmanlar ve farkli senaryolarla arkadaslarinizla unutulmaz anlar yasayin.",
      en: "Are you ready for an adrenaline-filled paintball experience? Experience unforgettable moments with your friends with wide areas, professional equipment, and different scenarios."
    },
    shortDescription: { 
      tr: "Heyecan dolu takim oyunu deneyimi", 
      en: "Thrilling team game experience" 
    },
    category: "Macera",
    categorySlug: "macera",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=600&fit=crop",
    minPrice: 200,
    maxPrice: 450,
    duration: { tr: "2-4 saat", en: "2-4 hours" },
    location: { tr: "Sile, Istanbul", en: "Sile, Istanbul" },
    rating: 4.6,
    reviewCount: 456,
    featured: true,
    providers: []
  },
  {
    id: "3",
    name: { tr: "Trekking & Dogada Yuruyus", en: "Trekking & Nature Walk" },
    slug: "trekking",
    description: {
      tr: "Istanbul cevresinin en guzel dogal rotalarini kesfet. Profesyonel rehberler esliginde guvenli trekking turlari.",
      en: "Discover the most beautiful natural routes around Istanbul. Safe trekking tours accompanied by professional guides."
    },
    shortDescription: { 
      tr: "Dogayla bas basa bir yuruyus deneyimi", 
      en: "A walking experience alone with nature" 
    },
    category: "Doga Sporlari",
    categorySlug: "doga-sporlari",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    minPrice: 150,
    maxPrice: 350,
    duration: { tr: "4-8 saat", en: "4-8 hours" },
    location: { tr: "Belgrad Ormani, Istanbul", en: "Belgrad Forest, Istanbul" },
    rating: 4.9,
    reviewCount: 312,
    featured: true,
    providers: []
  },
  {
    id: "4",
    name: { tr: "Seramik Workshop", en: "Ceramics Workshop" },
    slug: "seramik-workshop",
    description: {
      tr: "Ellerinizle sanat eserleri yaratin. Temel seramik tekniklerinden ileri duzeye kadar farkli workshop secenekleri.",
      en: "Create works of art with your hands. Different workshop options from basic ceramic techniques to advanced levels."
    },
    shortDescription: { 
      tr: "Kendinizi sanatla ifade edin", 
      en: "Express yourself with art" 
    },
    category: "Workshop",
    categorySlug: "workshop",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop",
    minPrice: 300,
    maxPrice: 500,
    duration: { tr: "2-3 saat", en: "2-3 hours" },
    location: { tr: "Kadikoy, Istanbul", en: "Kadikoy, Istanbul" },
    rating: 4.7,
    reviewCount: 189,
    featured: true,
    providers: []
  },
  {
    id: "5",
    name: { tr: "Atis Poligonu", en: "Shooting Range" },
    slug: "atis-poligonu",
    description: {
      tr: "Guvenli ortamda profesyonel egitmenler esliginde atis deneyimi. Farkli silah secenekleri ve egitim paketleri.",
      en: "Shooting experience in a safe environment accompanied by professional instructors. Different weapon options and training packages."
    },
    shortDescription: { 
      tr: "Profesyonel atis deneyimi", 
      en: "Professional shooting experience" 
    },
    category: "Macera",
    categorySlug: "macera",
    image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&h=600&fit=crop",
    minPrice: 400,
    maxPrice: 800,
    duration: { tr: "1-2 saat", en: "1-2 hours" },
    location: { tr: "Maslak, Istanbul", en: "Maslak, Istanbul" },
    rating: 4.5,
    reviewCount: 167,
    featured: false,
    providers: []
  },
  {
    id: "6",
    name: { tr: "Kurek", en: "Rowing" },
    slug: "kurek",
    description: {
      tr: "Istanbul'un en guzel koylarinda kurek cekme keyfi. Baslangic seviyesinden profesyonel seviyeye dersler.",
      en: "The pleasure of rowing in the most beautiful bays of Istanbul. Lessons from beginner to professional levels."
    },
    shortDescription: { 
      tr: "Su ustunde spor keyfi", 
      en: "Sports pleasure on the water" 
    },
    category: "Su Sporlari",
    categorySlug: "su-sporlari",
    image: "https://images.unsplash.com/photo-1594623274890-6b45ce7cf44a?w=800&h=600&fit=crop",
    minPrice: 250,
    maxPrice: 450,
    duration: { tr: "1-2 saat", en: "1-2 hours" },
    location: { tr: "Fenerbahce, Istanbul", en: "Fenerbahce, Istanbul" },
    rating: 4.6,
    reviewCount: 98,
    featured: false,
    providers: []
  },
  {
    id: "7",
    name: { tr: "Tarihi Yarimada Turu", en: "Historical Peninsula Tour" },
    slug: "tarihi-yarimada-turu",
    description: {
      tr: "Istanbul'un tarihi hazinelerini kesfet. Sultanahmet, Ayasofya, Topkapi Sarayi ve daha fazlasi.",
      en: "Discover the historical treasures of Istanbul. Sultanahmet, Hagia Sophia, Topkapi Palace and more."
    },
    shortDescription: { 
      tr: "Tarih kokan bir kultur turu", 
      en: "A cultural tour smelling of history" 
    },
    category: "Kultur & Sanat",
    categorySlug: "kultur-sanat",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop",
    minPrice: 200,
    maxPrice: 400,
    duration: { tr: "4-6 saat", en: "4-6 hours" },
    location: { tr: "Sultanahmet, Istanbul", en: "Sultanahmet, Istanbul" },
    rating: 4.9,
    reviewCount: 523,
    featured: true,
    providers: []
  },
  {
    id: "8",
    name: { tr: "Fotograf Workshop", en: "Photography Workshop" },
    slug: "fotograf-workshop",
    description: {
      tr: "Profesyonel fotografcilardan Istanbul sokak fotografciligi egitimi. Kameranizi daha iyi taniyin.",
      en: "Istanbul street photography training from professional photographers. Get to know your camera better."
    },
    shortDescription: { 
      tr: "Fotografcilik sanatini ogrenin", 
      en: "Learn the art of photography" 
    },
    category: "Workshop",
    categorySlug: "workshop",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop",
    minPrice: 350,
    maxPrice: 600,
    duration: { tr: "3-4 saat", en: "3-4 hours" },
    location: { tr: "Balat, Istanbul", en: "Balat, Istanbul" },
    rating: 4.8,
    reviewCount: 145,
    featured: false,
    providers: []
  },
]

// Provider listesindeki 'description' alanını da çoklu dil için ayarladım ama kod çok uzamasın diye sadece bir örnek bırakıyorum.
// İleride API'den gelirken provider objesinin description, location gibi alanları da yukarıdaki gibi {tr: "", en: ""} formatında gelmeli.
export const providers: Provider[] = [
  {
    id: "1",
    name: "Bogaz Macera",
    slug: "bogaz-macera",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
    description: {
      tr: "10 yildir Istanbul Bogazinda su sporlari hizmeti veren Bogaz Macera, profesyonel ekibi ve modern ekipmanlariyla size unutulmaz deneyimler sunuyor.",
      en: "Providing water sports services in the Bosphorus for 10 years, Bogaz Macera offers you unforgettable experiences with its professional team and modern equipment."
    },
    rating: 4.8,
    reviewCount: 312,
    verified: true,
    activityIds: ["1", "6"],
    location: "Bebek, Istanbul",
    phone: "+90 532 123 4567",
    email: "info@bogazmacera.com",
    website: "www.bogazmacera.com",
    founded: 2014,
    activities: [
      {
        activityId: "1",
        price: 350,
        originalPrice: 400,
        duration: "2 saat",
        includes: ["Ekipman", "Rehber", "Sigorta", "Su"],
        availableDates: ["2024-12-20", "2024-12-21", "2024-12-22"],
        maxParticipants: 10,
        minParticipants: 2
      },
      {
        activityId: "6",
        price: 280,
        duration: "1.5 saat",
        includes: ["Ekipman", "Egitmen", "Sigorta"],
        availableDates: ["2024-12-20", "2024-12-21"],
        maxParticipants: 8,
        minParticipants: 1
      }
    ]
  },
  {
    id: "2",
    name: "Istanbul Adrenalin",
    slug: "istanbul-adrenalin",
    logo: "https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?w=200&h=200&fit=crop",
    description: {
      tr: "Macera sporlarinin adresi. Paintball, atis poligonu ve daha fazlasi icin en iyi secim.",
      en: "The address of adventure sports. The best choice for paintball, shooting range and more."
    },
    rating: 4.6,
    reviewCount: 456,
    verified: true,
    activityIds: ["2", "5"],
    location: "Sile, Istanbul",
    phone: "+90 533 234 5678",
    email: "info@istanbuladrenalin.com",
    website: "www.istanbuladrenalin.com",
    founded: 2016,
    activities: [
      {
        activityId: "2",
        price: 200,
        duration: "2 saat",
        includes: ["Ekipman", "100 Mermi", "Rehber", "Sigorta"],
        availableDates: ["2024-12-20", "2024-12-21", "2024-12-22", "2024-12-23"],
        maxParticipants: 20,
        minParticipants: 6
      },
      {
        activityId: "5",
        price: 450,
        originalPrice: 500,
        duration: "1 saat",
        includes: ["Egitmen", "50 Mermi", "Hedef Kagitlari"],
        availableDates: ["2024-12-20", "2024-12-21"],
        maxParticipants: 4,
        minParticipants: 1
      }
    ]
  },
  {
    id: "3",
    name: "Doga Yolculari",
    slug: "doga-yolculari",
    logo: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=200&fit=crop",
    description: {
      tr: "Dogayla baş başa kalacaginiz profesyonel trekking ve dogada yuruyus turlari.",
      en: "Professional trekking and nature walking tours where you will be alone with nature."
    },
    rating: 4.9,
    reviewCount: 287,
    verified: true,
    activityIds: ["3"],
    location: "Besiktas, Istanbul",
    phone: "+90 534 345 6789",
    email: "info@dogayolculari.com",
    website: "www.dogayolculari.com",
    founded: 2012,
    activities: [
      {
        activityId: "3",
        price: 180,
        originalPrice: 220,
        duration: "5 saat",
        includes: ["Rehber", "Sigorta", "Ikram", "Fotograf Servisi"],
        availableDates: ["2024-12-21", "2024-12-22", "2024-12-28"],
        maxParticipants: 15,
        minParticipants: 4
      }
    ]
  },
  {
    id: "4",
    name: "Sanat Atolyesi",
    slug: "sanat-atolyesi",
    logo: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200&h=200&fit=crop",
    description: {
      tr: "Istanbul'un kalbinde sanat workshop'lari. Seramik, resim, fotograf ve daha fazlasi.",
      en: "Art workshops in the heart of Istanbul. Ceramics, painting, photography and more."
    },
    rating: 4.7,
    reviewCount: 198,
    verified: true,
    activityIds: ["4", "8"],
    location: "Kadikoy, Istanbul",
    phone: "+90 535 456 7890",
    email: "info@sanatatolyesi.com",
    website: "www.sanatatolyesi.com",
    founded: 2018,
    activities: [
      {
        activityId: "4",
        price: 320,
        duration: "2.5 saat",
        includes: ["Malzeme", "Egitmen", "Cay/Kahve", "Eserinizi Pisirelim"],
        availableDates: ["2024-12-20", "2024-12-21", "2024-12-22"],
        maxParticipants: 8,
        minParticipants: 2
      },
      {
        activityId: "8",
        price: 400,
        originalPrice: 450,
        duration: "3 saat",
        includes: ["Egitmen", "Pratik Tur", "Dijital Notlar"],
        availableDates: ["2024-12-22", "2024-12-29"],
        maxParticipants: 6,
        minParticipants: 2
      }
    ]
  },
  {
    id: "5",
    name: "Kultur Turlari Istanbul",
    slug: "kultur-turlari-istanbul",
    logo: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=200&h=200&fit=crop",
    description: {
      tr: "Istanbul'un tarihi ve kulturel zenginliklerini kesfetmeniz icin profesyonel rehberlik hizmetleri.",
      en: "Professional guidance services for you to discover the historical and cultural riches of Istanbul."
    },
    rating: 4.9,
    reviewCount: 523,
    verified: true,
    activityIds: ["7"],
    location: "Sultanahmet, Istanbul",
    phone: "+90 536 567 8901",
    email: "info@kulturturları.com",
    website: "www.kulturturlari.com",
    founded: 2010,
    activities: [
      {
        activityId: "7",
        price: 250,
        originalPrice: 300,
        duration: "5 saat",
        includes: ["Profesyonel Rehber", "Muzeler Giris", "Ogle Yemegi"],
        availableDates: ["2024-12-20", "2024-12-21", "2024-12-22", "2024-12-23"],
        maxParticipants: 12,
        minParticipants: 2
      }
    ]
  },
  {
    id: "6",
    name: "Extreme Istanbul",
    slug: "extreme-istanbul",
    logo: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=200&h=200&fit=crop",
    description: {
      tr: "Adrenalin tutkunlari icin en ekstrem aktiviteler. Paintball, atis poligonu ve macera parklari.",
      en: "The most extreme activities for adrenaline enthusiasts. Paintball, shooting range and adventure parks."
    },
    rating: 4.5,
    reviewCount: 234,
    verified: false,
    activityIds: ["2", "5"],
    location: "Riva, Istanbul",
    phone: "+90 537 678 9012",
    email: "info@extremeistanbul.com",
    website: "www.extremeistanbul.com",
    founded: 2019,
    activities: [
      {
        activityId: "2",
        price: 250,
        duration: "3 saat",
        includes: ["Ekipman", "150 Mermi", "Rehber", "Sigorta", "Ikram"],
        availableDates: ["2024-12-20", "2024-12-21", "2024-12-22"],
        maxParticipants: 30,
        minParticipants: 8
      },
      {
        activityId: "5",
        price: 400,
        duration: "1.5 saat",
        includes: ["Egitmen", "75 Mermi", "Hedef Kagitlari", "Video Kayit"],
        availableDates: ["2024-12-20", "2024-12-21"],
        maxParticipants: 6,
        minParticipants: 1
      }
    ]
  }
]

export const reviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Ahmet Y.",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Muhteşem bir deneyimdi! Rehberimiz cok bilgili ve yardımseverdi. Kesinlikle tavsiye ederim.",
    date: "2024-12-15",
    activityId: "1",
    providerId: "1"
  },
  {
    id: "2",
    userId: "user2",
    userName: "Elif K.",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4,
    comment: "Cok eglenceli bir aktiviteydi. Sadece biraz kalabalikti ama yine de cok keyif aldim.",
    date: "2024-12-14",
    activityId: "2",
    providerId: "2"
  },
  {
    id: "3",
    userId: "user3",
    userName: "Mehmet S.",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Doga yuruyusu icin mukemmel bir organizasyon. Her detay dusunulmus.",
    date: "2024-12-13",
    activityId: "3",
    providerId: "3"
  }
]

export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find(a => a.slug === slug)
}

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find(p => p.slug === slug)
}

export function getProvidersByActivity(activityId: string): Provider[] {
  return providers.filter(p => p.activityIds.includes(activityId))
}

export function getActivitiesByCategory(categorySlug: string): Activity[] {
  return activities.filter(a => a.categorySlug === categorySlug)
}

export function getFeaturedActivities(): Activity[] {
  return activities.filter(a => a.featured)
}

export function getTopProviders(): Provider[] {
  return providers.filter(p => p.verified).sort((a, b) => b.rating - a.rating).slice(0, 4)
}