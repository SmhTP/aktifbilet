"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Plus, LayoutDashboard, Package, Settings, LogOut, Loader2, Star, TrendingUp, MapPin, Home, Info, Menu, X, Save, CalendarCheck, CheckCircle2, XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export default function ProviderDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [provider, setProvider] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([]) // YENİ: Rezervasyonlar State'i
  
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Ayarlar sekmesi için state'ler
  const [settingsDesc, setSettingsDesc] = useState("")
  const [settingsEmail, setSettingsEmail] = useState("")
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)

  useEffect(() => {
    async function getDashboardData() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/firma/giris")
        return
      }

      const { data: providerData } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (providerData) {
        setProvider(providerData)
        setSettingsDesc(providerData.description || "")
        setSettingsEmail(providerData.email || `iletisim@${providerData.slug}.com`)

        // 1. Firmanın aktivitelerini çek
        const { data: activityData } = await supabase
          .from("activities")
          .select("*")
          .eq("provider_id", providerData.id)
        
        if (activityData) {
          setActivities(activityData)

          // 2. YENİ: Firmanın aktivitelerine ait rezervasyonları çek
          // Supabase'de 'bookings' tablosu 'activities' ile ilişkili. 
          // Bu yüzden bu firmanın sahip olduğu aktivite ID'lerine denk gelen biletleri çekiyoruz.
          if (activityData.length > 0) {
            const activityIds = activityData.map(a => a.id)
            const { data: bookingData } = await supabase
              .from("bookings")
              .select(`
                *,
                activities(name),
                auth:user_id(email)
              `)
              .in("activity_id", activityIds)
              .order("booking_date", { ascending: false }) // En yeniler en üstte
            
            if (bookingData) setBookings(bookingData)
          }
        }
      }
      
      setLoading(false)
    }

    getDashboardData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/firma/giris")
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Bu aktiviteyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")
    if (!confirmDelete) return

    const { error } = await supabase.from("activities").delete().eq("id", id)

    if (error) {
      alert("Silme işlemi sırasında bir hata oluştu.")
      console.error(error)
    } else {
      setActivities(activities.filter(act => act.id !== id))
    }
  }

  // YENİ: Rezervasyon Durumu Güncelleme
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId)

    if (!error) {
      // Ekrandaki listeyi anında güncelle
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
    } else {
      alert("Durum güncellenirken hata oluştu.")
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  const handleUpdateSettings = async () => {
    setIsUpdatingSettings(true)

    const { error } = await supabase
      .from("providers")
      .update({ description: settingsDesc, email: settingsEmail })
      .eq("id", provider.id)

    if (error) {
      alert("Bilgiler güncellenirken bir hata oluştu. Lütfen tekrar deneyin.")
      console.error(error)
    } else {
      alert("Firma profiliniz başarıyla güncellendi!")
      setProvider({ ...provider, description: settingsDesc, email: settingsEmail })
    }
    setIsUpdatingSettings(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  // Aktif (İptal edilmemiş) rezervasyonlardan elde edilen toplam ciro
  const totalRevenue = bookings.filter(b => b.status !== 'iptal').reduce((sum, b) => sum + b.total_price, 0)

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col md:flex-row">
      
      {/* MOBİL ÜST MENÜ */}
      <div className="md:hidden bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">AktifBilet</h1>
          </a>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="p-4 border-t border-border flex flex-col gap-2 bg-card absolute w-full shadow-xl z-40 left-0 top-[73px]">
            <Button variant={activeTab === "dashboard" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange("dashboard")}>
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Button>
            <Button variant={activeTab === "bookings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange("bookings")}>
              <CalendarCheck className="mr-2 h-4 w-4" /> Rezervasyonlar
            </Button>
            <Button variant={activeTab === "activities" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange("activities")}>
              <Package className="mr-2 h-4 w-4" /> Aktivitelerim
            </Button>
            <Button variant={activeTab === "settings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange("settings")}>
              <Settings className="mr-2 h-4 w-4" /> Ayarlar
            </Button>
            <div className="h-px bg-border my-2" />
            <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:text-foreground">
              <a href="/"><Home className="mr-2 h-4 w-4" /> Ana Sayfaya Dön</a>
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
            </Button>
          </div>
        )}
      </div>

      {/* BİLGİSAYAR YAN MENÜ */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-border">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">AktifBilet</h1>
          </a>
          <p className="text-xs text-muted-foreground mt-2">Firma Yönetim Paneli</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button variant={activeTab === "dashboard" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange("dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          {/* YENİ SEKME */}
          <Button variant={activeTab === "bookings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange("bookings")}>
            <CalendarCheck className="mr-2 h-4 w-4" /> Rezervasyonlar
            {bookings.filter(b => b.status === 'onaylandi').length > 0 && (
              <Badge className="ml-auto bg-primary text-primary-foreground">{bookings.filter(b => b.status === 'onaylandi').length}</Badge>
            )}
          </Button>
          <Button variant={activeTab === "activities" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange("activities")}>
            <Package className="mr-2 h-4 w-4" /> Aktivitelerim
          </Button>
          <Button variant={activeTab === "settings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange("settings")}>
            <Settings className="mr-2 h-4 w-4" /> Ayarlar
          </Button>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:text-foreground">
            <a href="/"><Home className="mr-2 h-4 w-4" /> Ana Sayfaya Dön</a>
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Hoş Geldin, {provider?.name}</h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {activeTab === "dashboard" && "İşletmenizin bugünkü durumuna göz atın."}
              {activeTab === "bookings" && "Gelen rezervasyonları yönetin ve onaylayın."}
              {activeTab === "activities" && "Platformda listelenen turlarınızı yönetin."}
              {activeTab === "settings" && "Firma bilgilerinizi ve profilinizi güncelleyin."}
            </p>
          </div>
          {activeTab === "activities" && (
            <Button className="shadow-lg w-full sm:w-auto" asChild>
              <Link href="/firma/panel/yeni">
                <Plus className="mr-2 h-5 w-5" /> Yeni Aktivite
              </Link>
            </Button>
          )}
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Ciro Kartı Eklendi */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Ciro</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{totalRevenue} TL</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Bilet</CardTitle>
                  <CalendarCheck className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{bookings.length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Aktif Turlar</CardTitle>
                  <Package className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{activities.length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Değerlendirme</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{provider?.rating || 0}</div></CardContent>
              </Card>
            </div>
            
            <div className="bg-card p-4 md:p-6 rounded-xl border border-border flex items-start gap-4">
              <Info className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-sm md:text-base">İpucu: Rezervasyonları hızla onaylayın</h4>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">Sol menüdeki "Rezervasyonlar" sekmesinden gelen biletleri takip edebilir, etkinlik tamamlandığında durumlarını güncelleyebilirsiniz.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- YENİ EKLENEN REZERVASYONLAR SEKMESİ --- */}
        {activeTab === "bookings" && (
          <Card>
            <CardHeader>
              <CardTitle>Tüm Rezervasyonlar</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Tarih</th>
                        <th className="px-4 py-3">Aktivite</th>
                        <th className="px-4 py-3">Müşteri Email</th>
                        <th className="px-4 py-3 text-center">Kişi</th>
                        <th className="px-4 py-3 text-right">Tutar</th>
                        <th className="px-4 py-3 text-center">Durum</th>
                        <th className="px-4 py-3 rounded-tr-lg text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => {
                        let badgeColor = "bg-primary"
                        if (booking.status === "iptal") badgeColor = "bg-destructive"
                        if (booking.status === "tamamlandi") badgeColor = "bg-secondary text-secondary-foreground"
                        
                        return (
                          <tr key={booking.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                            <td className="px-4 py-3 font-medium whitespace-nowrap">
                              {new Date(booking.booking_date).toLocaleDateString("tr-TR")} <br/>
                              <span className="text-muted-foreground text-xs">{booking.booking_time}</span>
                            </td>
                            <td className="px-4 py-3">
                              {/* Aktivite adı JSON olarak geliyorsa tr'sini al, değilse kendisini al */}
                              {typeof booking.activities?.name === 'string' 
                                ? booking.activities.name 
                                : booking.activities?.name?.tr || "Aktivite"}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{booking.auth?.email || "Bilinmiyor"}</td>
                            <td className="px-4 py-3 text-center font-bold">{booking.guest_count}</td>
                            <td className="px-4 py-3 text-right font-bold text-primary">{booking.total_price} TL</td>
                            <td className="px-4 py-3 text-center">
                              <Badge className={`${badgeColor} border-none`}>{booking.status}</Badge>
                            </td>
                            <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                              {booking.status === "onaylandi" && (
                                <>
                                  <Button size="sm" variant="outline" className="text-green-500 hover:text-green-600 hover:bg-green-500/10" onClick={() => updateBookingStatus(booking.id, "tamamlandi")}>
                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Tamamla
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => updateBookingStatus(booking.id, "iptal")}>
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <CalendarCheck className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground">Henüz rezervasyon yok</h3>
                  <p className="text-muted-foreground mt-1">Aktivitelerinize bilet satıldığında burada listelenecektir.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* AKTİVİTELER */}
        {activeTab === "activities" && (
          <div className="grid grid-cols-1 gap-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="bg-card border border-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-secondary rounded-lg overflow-hidden relative shrink-0">
                      <img src={activity.image || "/placeholder.jpg"} alt={activity.name?.tr || "Aktivite"} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground line-clamp-1">{activity.name?.tr || "İsimsiz Aktivite"}</h4>
                      <div className="flex items-center text-xs md:text-sm text-muted-foreground gap-3 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {activity.location?.tr || "Konum Yok"}</span>
                        <span className="font-medium text-primary">{activity.price} TL</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none" asChild>
                      <Link href={`/firma/panel/duzenle/${activity.id}`}>Düzenle</Link>
                    </Button>
                    <Button 
                      variant="outline" size="sm" 
                      className="flex-1 sm:flex-none text-destructive hover:bg-destructive/10 border-destructive/20"
                      onClick={() => handleDelete(activity.id)}
                    >
                      Sil
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 md:py-16 bg-card rounded-xl border border-dashed border-border px-4">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">Henüz Aktivite Yok</h3>
                <p className="text-sm text-muted-foreground mb-4">Müşterilere sunmak için ilk turunuzu hemen oluşturun.</p>
                <Button asChild><Link href="/firma/panel/yeni">Aktivite Ekle</Link></Button>
              </div>
            )}
          </div>
        )}

        {/* AYARLAR */}
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Firma Profili</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Firma Adı</label>
                  <Input disabled value={provider?.name || ""} />
                  <p className="text-xs text-muted-foreground mt-1">Firma adını değiştirmek için destek ekibiyle iletişime geçmelisiniz.</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">İletişim E-postası</label>
                  <Input value={settingsEmail} onChange={(e) => setSettingsEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Hakkımızda (Kısa Açıklama)</label>
                  <textarea 
                    className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={settingsDesc}
                    onChange={(e) => setSettingsDesc(e.target.value)}
                    placeholder="Firmanızı müşterilere tanıtın..."
                  />
                </div>
                <Button className="w-full h-11" onClick={handleUpdateSettings} disabled={isUpdatingSettings}>
                  {isUpdatingSettings ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                  Bilgileri Güncelle
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}