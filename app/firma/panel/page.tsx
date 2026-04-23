"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link" // Panel içi gezinmeler (Yeni Aktivite vb.) için hala lazım
import { 
  Plus, LayoutDashboard, Package, Settings, LogOut, Loader2, Star, TrendingUp, MapPin, Home, Info
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
  
  // Yan menüde hangi sekmenin açık olduğunu tutuyoruz
  const [activeTab, setActiveTab] = useState("dashboard")

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/20 flex">
      {/* YAN MENÜ (Sidebar) */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          {/* DÜZELTME 1: Logo artık 'a' etiketi kullanıyor (Sert Geçiş) */}
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">AktifBilet</h1>
          </a>
          <p className="text-xs text-muted-foreground mt-2">Firma Yönetim Paneli</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant={activeTab === "dashboard" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button 
            variant={activeTab === "activities" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("activities")}
          >
            <Package className="mr-2 h-4 w-4" /> Aktivitelerim
          </Button>
          <Button 
            variant={activeTab === "settings" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" /> Ayarlar
          </Button>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          {/* DÜZELTME 2: Ana Sayfaya Dön Butonu artık 'a' etiketi kullanıyor (Sert Geçiş) */}
          <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:text-foreground">
            <a href="/">
              <Home className="mr-2 h-4 w-4" /> Ana Sayfaya Dön
            </a>
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Hoş Geldin, {provider?.name}</h2>
            <p className="text-muted-foreground">
              {activeTab === "dashboard" && "İşletmenizin bugünkü durumuna göz atın."}
              {activeTab === "activities" && "Platformda listelenen turlarınızı yönetin."}
              {activeTab === "settings" && "Firma bilgilerinizi ve profilinizi güncelleyin."}
            </p>
          </div>
          {activeTab === "activities" && (
            <Button size="lg" className="shadow-lg" asChild>
              <Link href="/firma/panel/yeni">
                <Plus className="mr-2 h-5 w-5" /> Yeni Aktivite Ekle
              </Link>
            </Button>
          )}
        </div>

        {/* --- SEKME 1: DASHBOARD --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Aktivite</CardTitle>
                  <Package className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activities.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ortalama Puan</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{provider?.rating || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Yorum</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{provider?.review_count || 0}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border flex items-start gap-4">
              <Info className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">İpucu: Daha fazla rezervasyon alın</h4>
                <p className="text-sm text-muted-foreground mt-1">Aktivitelerinize yüksek kaliteli fotoğraflar eklemek ve açıklamaları detaylı tutmak müşteri dönüşümlerini %40'a kadar artırır. Aktivitelerim sekmesinden turlarınızı güncelleyebilirsiniz.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- SEKME 2: AKTİVİTELERİM --- */}
        {activeTab === "activities" && (
          <div className="grid grid-cols-1 gap-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-secondary rounded-lg overflow-hidden relative">
                      <img src={activity.image || "/placeholder.jpg"} alt={activity.name?.tr || "Aktivite"} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{activity.name?.tr || "İsimsiz Aktivite"}</h4>
                      <div className="flex items-center text-sm text-muted-foreground gap-3">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {activity.location?.tr || "Konum Yok"}</span>
                        <span className="font-medium text-primary">{activity.price} TL</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Düzenle</Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20">Sil</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">Henüz Aktivite Yok</h3>
                <p className="text-muted-foreground mb-4">Müşterilere sunmak için ilk turunuzu hemen oluşturun.</p>
                <Button asChild>
                  <Link href="/firma/panel/yeni">Aktivite Ekle</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* --- SEKME 3: AYARLAR --- */}
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
                  <Input defaultValue={`iletisim@${provider?.slug}.com`} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Hakkımızda (Kısa Açıklama)</label>
                  <textarea 
                    className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm"
                    defaultValue={provider?.description || ""}
                    placeholder="Firmanızı müşterilere tanıtın..."
                  />
                </div>
                <Button className="w-full">Bilgileri Güncelle</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}