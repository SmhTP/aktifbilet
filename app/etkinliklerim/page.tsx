"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Users, MapPin, ChevronRight, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

// İsmi güvenli okuma fonksiyonu
const getActivityName = (nameObj: any) => {
  if (!nameObj) return "İsimsiz Aktivite"
  if (typeof nameObj === 'string') return nameObj
  return nameObj.tr || "İsimsiz Aktivite"
}

export default function MyEventsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    async function fetchBookings() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/kullanici/giris")
        return
      }

      // Veritabanından kullanıcının biletlerini, aktivite ve firma detaylarıyla birlikte çek
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          activities (
            slug, name, location, image,
            providers (name)
          )
        `)
        .eq("user_id", user.id)
        .order("booking_date", { ascending: true })

      if (data) setBookings(data)
      setLoading(false)
    }

    fetchBookings()
  }, [router])

  // İptal Etme Fonksiyonu
  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")
    if (!confirmCancel) return

    const { error } = await supabase
      .from("bookings")
      .update({ status: "iptal" })
      .eq("id", bookingId)

    if (!error) {
      // Ekrandaki listeyi anında güncelle
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: "iptal" } : b))
      alert("Rezervasyonunuz iptal edildi.")
    } else {
      alert("İptal işlemi sırasında bir hata oluştu.")
    }
  }

  // Tarihleri kıyaslamak için bugünün tarihini al
  const today = new Date().toISOString().split('T')[0]

  // Biletleri yaklaşan ve geçmiş olarak ayır (iptal edilenleri geçmişe veya ayrı yere alabiliriz, şimdilik statüye göre ayırıyoruz)
  const upcomingBookings = bookings.filter(b => b.booking_date >= today && b.status !== 'iptal' && b.status !== 'tamamlandi')
  const pastBookings = bookings.filter(b => b.booking_date < today || b.status === 'iptal' || b.status === 'tamamlandi')

  // İstatistikler
  const totalCount = bookings.length
  const upcomingCount = upcomingBookings.length
  const completedCount = bookings.filter(b => b.status === 'tamamlandi' || (b.booking_date < today && b.status !== 'iptal')).length
  const reviewedCount = 0 // İleride yorum sistemi gelince burası dolacak

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background/50">
      <div className="bg-primary/5 border-b border-border py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Etkinliklerim</h1>
          <p className="mt-2 text-muted-foreground">Tüm rezervasyonlarınızı ve geçmiş etkinliklerinizi görüntüleyin</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* İSTATİSTİKLER (Senin harika tasarımın) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-primary">{totalCount}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Toplam</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-primary">{upcomingCount}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Yaklaşan</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-primary">{completedCount}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Tamamlanan</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-primary">{reviewedCount}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Değerlendirilen</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
            <TabsTrigger value="upcoming" className="text-base">Yaklaşan Etkinlikler ({upcomingCount})</TabsTrigger>
            <TabsTrigger value="past" className="text-base">Geçmiş Etkinlikler ({pastBookings.length})</TabsTrigger>
          </TabsList>

          {/* YAKLAŞAN ETKİNLİKLER */}
          <TabsContent value="upcoming" className="space-y-6">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onCancel={() => handleCancelBooking(booking.id)} 
                  isPast={false} 
                />
              ))
            ) : (
              <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
                <Calendar className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Yaklaşan Etkinliğiniz Yok</h3>
                <p className="text-muted-foreground mt-2 mb-6">Hemen yeni bir macera keşfedin ve rezervasyon yapın!</p>
                <Button asChild>
                  <Link href="/aktiviteler">Aktiviteleri Keşfet</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* GEÇMİŞ / İPTAL EDİLEN ETKİNLİKLER */}
          <TabsContent value="past" className="space-y-6">
            {pastBookings.length > 0 ? (
              pastBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  isPast={true} 
                />
              ))
            ) : (
              <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">Henüz geçmiş bir etkinliğiniz bulunmuyor.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Bilet Kartı Komponenti (Temiz kod için ayırdık)
function BookingCard({ booking, onCancel, isPast }: { booking: any, onCancel?: () => void, isPast: boolean }) {
  const activity = booking.activities
  const name = getActivityName(activity?.name)
  const location = getActivityName(activity?.location)
  const providerName = activity?.providers?.name || "Bilinmeyen Firma"

  // Duruma göre Badge rengi belirleme
  let badgeColor = "bg-primary text-primary-foreground"
  let statusText = "Onaylandı"
  
  if (booking.status === "bekliyor") { badgeColor = "bg-yellow-500 text-white"; statusText = "Onay Bekliyor" }
  if (booking.status === "iptal") { badgeColor = "bg-destructive text-destructive-foreground"; statusText = "İptal Edildi" }
  if (booking.status === "tamamlandi") { badgeColor = "bg-secondary text-secondary-foreground"; statusText = "Tamamlandı" }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Sol Taraf: Fotoğraf ve Badge */}
        <div className="relative w-full sm:w-72 h-48 sm:h-auto shrink-0 bg-secondary">
          <Image 
            src={activity?.image || "/placeholder.jpg"} 
            alt={name} 
            fill 
            className={`object-cover ${booking.status === 'iptal' ? 'grayscale opacity-70' : ''}`}
          />
          <Badge className={`absolute top-3 left-3 ${badgeColor} border-none`}>
            {statusText}
          </Badge>
        </div>
        
        {/* Sağ Taraf: İçerik */}
        <CardContent className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{providerName}</p>
              </div>
              <p className="text-xl font-bold text-primary shrink-0">{booking.total_price} TL</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0 text-foreground/70" />
                <span>{new Date(booking.booking_date).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0 text-foreground/70" />
                <span>{booking.booking_time || "Belirtilmemiş"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 shrink-0 text-foreground/70" />
                <span>{booking.guest_count} Kişi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground line-clamp-1">
                <MapPin className="h-4 w-4 shrink-0 text-foreground/70" />
                <span className="truncate" title={location}>{location}</span>
              </div>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
            {activity?.slug && (
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href={`/aktiviteler/${activity.slug}`}>Detayları Gör</Link>
              </Button>
            )}
            
            {/* Eğer etkinlik yaklaşansa ve iptal edilmemişse İptal Butonunu göster */}
            {!isPast && booking.status !== 'iptal' && onCancel && (
              <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onCancel}>
                <XCircle className="h-4 w-4 mr-2" /> İptal Et
              </Button>
            )}

            {/* İptal edilen veya geçmiş etkinlikler için tekrar rezervasyon linki */}
            {isPast && activity?.slug && (
              <Link href={`/rezervasyon/${activity.slug}`} className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-1 transition-colors ml-2">
                Tekrar Rezervasyon Yap <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}