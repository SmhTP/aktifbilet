"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Plus, LayoutDashboard, Package, Settings, LogOut, Loader2, Star, TrendingUp, MapPin, Home, Info, Menu, X, Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function ProviderDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [provider, setProvider] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // YENİ: Ayarlar sekmesi için state'ler
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
        // Veritabanından gelen bilgileri ayarlar formuna dolduruyoruz
        setSettingsDesc(providerData.description || "")
        setSettingsEmail(providerData.email || `iletisim@${providerData.slug}.com`)

        const { data: activityData } = await supabase
          .from("activities")
          .select("*")
          .eq("provider_id", providerData.id)
        
        if (activityData) setActivities(activityData)
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

    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Silme işlemi sırasında bir hata oluştu.")
      console.error(error)
    } else {
      setActivities(activities.filter(act => act.id !== id))
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  // YENİ: Ayarları Güncelleme Fonksiyonu
  const handleUpdateSettings = async () => {
    setIsUpdatingSettings(true)

    const { error } = await supabase
      .from("providers")
      .update({
        description: settingsDesc,
        email: settingsEmail
      })
      .eq("id", provider.id)

    if (error) {
      alert("Bilgiler güncellenirken bir hata oluştu. Lütfen tekrar deneyin.")
      console.error(error)
    } else {
      alert("Firma profiliniz başarıyla güncellendi!")
      // Ekranda görünen genel provider state'ini de güncelleyelim
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

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col md:flex-row">
      
      {/* SADECE MOBİLDE GÖRÜNEN ÜST MENÜ */}
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

      {/* SADECE BİLGİSAYARDA GÖRÜNEN YAN MENÜ */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Aktivite</CardTitle>
                  <Package className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{activities.length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ortalama Puan</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{provider?.rating || 0}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Yorum</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{provider?.review_count || 0}</div></CardContent>
              </Card>
            </div>
            
            <div className="bg-card p-4 md:p-6 rounded-xl border border-border flex items-start gap-4">
              <Info className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-sm md:text-base">İpucu: Daha fazla rezervasyon alın</h4>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">Aktivitelerinize yüksek kaliteli fotoğraflar eklemek ve açıklamaları detaylı tutmak müşteri dönüşümlerini %40'a kadar artırır.</p>
              </div>
            </div>
          </div>
        )}

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
                      variant="outline" 
                      size="sm" 
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
                <Button asChild>
                  <Link href="/firma/panel/yeni">Aktivite Ekle</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* --- YENİLENEN AYARLAR SEKMESİ --- */}
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
                  {/* YENİ: State'e bağlandı */}
                  <Input 
                    value={settingsEmail} 
                    onChange={(e) => setSettingsEmail(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Hakkımızda (Kısa Açıklama)</label>
                  {/* YENİ: State'e bağlandı */}
                  <textarea 
                    className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={settingsDesc}
                    onChange={(e) => setSettingsDesc(e.target.value)}
                    placeholder="Firmanızı müşterilere tanıtın..."
                  />
                </div>
                {/* YENİ: Fonksiyona bağlandı ve Loading eklendi */}
                <Button 
                  className="w-full h-11" 
                  onClick={handleUpdateSettings} 
                  disabled={isUpdatingSettings}
                >
                  {isUpdatingSettings ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
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