"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, LayoutDashboard, Package, Settings, LogOut, Loader2, Star, TrendingUp, MapPin, Home, Info, Menu, X, Save, CalendarCheck, CheckCircle2, XCircle } from "lucide-react"
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
  const [bookings, setBookings] = useState<any[]>([]) 
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [settingsDesc, setSettingsDesc] = useState("")
  const [settingsEmail, setSettingsEmail] = useState("")
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)

  useEffect(() => {
    async function getDashboardData() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.replace("/firma/giris")
        return
      }

      const { data: providerData } = await supabase.from("providers").select("*").eq("user_id", user.id).single()
      
      if (providerData) {
        setProvider(providerData)
        setSettingsDesc(providerData.description || "")
        setSettingsEmail(providerData.email || `iletisim@${providerData.slug}.com`)

        const { data: activityData } = await supabase.from("activities").select("*").eq("provider_id", providerData.id)
        
        if (activityData) {
          setActivities(activityData)
          if (activityData.length > 0) {
            const activityIds = activityData.map(a => a.id)
            const { data: bookingData, error: bookingError } = await supabase
              .from("bookings")
              .select(`*, activities(name)`)
              .in("activity_id", activityIds)
              .order("booking_date", { ascending: false })

            if (bookingError) console.error("Rezervasyonlar çekilemedi:", bookingError.message)
            if (bookingData) setBookings(bookingData)
          }
        }
      } else {
        window.location.replace("/")
      }
      
      setLoading(false)
    }

    getDashboardData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.replace("/firma/giris")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu aktiviteyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return
    const { error } = await supabase.from("activities").delete().eq("id", id)
    if (error) { alert("Silme işlemi sırasında bir hata oluştu."); console.error(error) } 
    else { setActivities(activities.filter(act => act.id !== id)) }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId)
    if (!error) setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
    else alert("Durum güncellenirken hata oluştu.")
  }

  const handleUpdateSettings = async () => {
    setIsUpdatingSettings(true)
    const { error } = await supabase.from("providers").update({ description: settingsDesc, email: settingsEmail }).eq("id", provider.id)
    if (error) { alert("Bilgiler güncellenirken hata oluştu."); console.error(error) } 
    else { alert("Firma profiliniz başarıyla güncellendi!"); setProvider({ ...provider, description: settingsDesc, email: settingsEmail }) }
    setIsUpdatingSettings(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>

  const totalRevenue = bookings.filter(b => b.status !== 'iptal').reduce((sum, b) => sum + b.total_price, 0)

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col md:flex-row">
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">AktifBilet</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Firma Yönetim Paneli</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button variant={activeTab === "dashboard" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button variant={activeTab === "bookings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("bookings")}>
            <CalendarCheck className="mr-2 h-4 w-4" /> Rezervasyonlar
            {bookings.filter(b => b.status === 'bekliyor').length > 0 && (
              <Badge className="ml-auto bg-primary text-primary-foreground">{bookings.filter(b => b.status === 'bekliyor').length}</Badge>
            )}
          </Button>
          <Button variant={activeTab === "activities" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("activities")}>
            <Package className="mr-2 h-4 w-4" /> Aktivitelerim
          </Button>
          <Button variant={activeTab === "settings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("settings")}>
            <Settings className="mr-2 h-4 w-4" /> Ayarlar
          </Button>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Hoş Geldin, {provider?.name}</h2>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Toplam Ciro</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalRevenue} TL</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Toplam Bilet</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{bookings.length}</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Aktif Turlar</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{activities.length}</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Değerlendirme</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{provider?.rating || 0}</div></CardContent></Card>
          </div>
        )}

        {activeTab === "bookings" && (
          <Card>
            <CardHeader><CardTitle>Tüm Rezervasyonlar</CardTitle></CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/50">
                      <tr><th className="px-4 py-3">Tarih</th><th className="px-4 py-3">Aktivite</th><th className="px-4 py-3">Müşteri</th><th className="px-4 py-3">Kişi</th><th className="px-4 py-3">Tutar</th><th className="px-4 py-3 text-center">Durum</th><th className="px-4 py-3 text-right">İşlem</th></tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => {
                        let badgeColor = "bg-primary"
                        if (booking.status === "iptal") badgeColor = "bg-destructive"
                        if (booking.status === "tamamlandi") badgeColor = "bg-secondary text-secondary-foreground"
                        if (booking.status === "bekliyor") badgeColor = "bg-yellow-500 text-white"
                        return (
                          <tr key={booking.id} className="border-b border-border">
                            <td className="px-4 py-3 font-medium whitespace-nowrap">{new Date(booking.booking_date).toLocaleDateString("tr-TR")} <br/><span className="text-xs text-muted-foreground">{booking.booking_time}</span></td>
                            <td className="px-4 py-3">{typeof booking.activities?.name === 'string' ? booking.activities.name : booking.activities?.name?.tr || "Aktivite"}</td>
                            <td className="px-4 py-3 text-muted-foreground">Kayıtlı Müşteri</td>
                            <td className="px-4 py-3 text-center font-bold">{booking.guest_count}</td>
                            <td className="px-4 py-3 text-right font-bold text-primary">{booking.total_price} TL</td>
                            <td className="px-4 py-3 text-center"><Badge className={`${badgeColor} border-none`}>{booking.status}</Badge></td>
                            <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                              {booking.status === "bekliyor" && (
                                <><Button size="sm" variant="outline" className="text-green-500 hover:bg-green-500/10" onClick={() => updateBookingStatus(booking.id, "onaylandi")}><CheckCircle2 className="h-4 w-4 mr-1" /> Onayla</Button><Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => updateBookingStatus(booking.id, "iptal")}><XCircle className="h-4 w-4" /></Button></>
                              )}
                              {booking.status === "onaylandi" && (
                                <><Button size="sm" variant="outline" className="text-blue-500 hover:bg-blue-500/10" onClick={() => updateBookingStatus(booking.id, "tamamlandi")}><CheckCircle2 className="h-4 w-4 mr-1" /> Tamamla</Button><Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => updateBookingStatus(booking.id, "iptal")}><XCircle className="h-4 w-4" /></Button></>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16"><CalendarCheck className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-4" /><h3 className="text-lg font-medium text-foreground">Henüz rezervasyon yok</h3></div>
              )}
            </CardContent>
          </Card>
        )}

        {/* AKTİVİTELER */}
        {activeTab === "activities" && (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-end mb-2"><Button asChild><Link href="/firma/panel/yeni"><Plus className="mr-2 h-5 w-5" /> Yeni Aktivite</Link></Button></div>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-secondary rounded-lg overflow-hidden shrink-0"><img src={activity.image || "/placeholder.jpg"} className="object-cover w-full h-full" /></div>
                    <div><h4 className="font-semibold text-foreground line-clamp-1">{activity.name?.tr || "İsimsiz Aktivite"}</h4><div className="text-sm text-primary font-medium mt-1">{activity.price} TL</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild><Link href={`/firma/panel/duzenle/${activity.id}`}>Düzenle</Link></Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(activity.id)}>Sil</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12"><Package className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-4" /><p className="text-muted-foreground">Henüz Aktivite Yok</p></div>
            )}
          </div>
        )}

        {/* AYARLAR */}
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader><CardTitle>Firma Profili</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><label className="text-sm font-medium mb-1 block">Firma Adı</label><Input disabled value={provider?.name || ""} /></div>
                <div><label className="text-sm font-medium mb-1 block">İletişim E-postası</label><Input value={settingsEmail} onChange={(e) => setSettingsEmail(e.target.value)} /></div>
                <div><label className="text-sm font-medium mb-1 block">Hakkımızda</label><textarea className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/50" value={settingsDesc} onChange={(e) => setSettingsDesc(e.target.value)} /></div>
                <Button className="w-full h-11" onClick={handleUpdateSettings} disabled={isUpdatingSettings}>{isUpdatingSettings ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} Bilgileri Güncelle</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}