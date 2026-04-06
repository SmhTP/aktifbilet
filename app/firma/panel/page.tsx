"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  Loader2, 
  Star, 
  TrendingUp,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function ProviderDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [provider, setProvider] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    async function getDashboardData() {
      // 1. Giriş yapmış kullanıcıyı kontrol et
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/firma/giris")
        return
      }

      // 2. Bu kullanıcıya bağlı firmayı (Provider) çek
      const { data: providerData, error: pError } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (providerData) {
        setProvider(providerData)

        // 3. Bu firmaya ait aktiviteleri çek
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
      {/* Yan Menü (Sidebar) */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">AktifBilet</h1>
          <p className="text-xs text-muted-foreground">Firma Yönetim Paneli</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Package className="mr-2 h-4 w-4" /> Aktivitelerim
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" /> Ayarlar
          </Button>
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Ana İçerik */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Hoş Geldin, {provider?.name}</h2>
            <p className="text-muted-foreground">İşletmenizin bugünkü durumuna göz atın.</p>
          </div>
          <Button size="lg" className="shadow-lg">
            <Plus className="mr-2 h-5 w-5" /> Yeni Aktivite Ekle
          </Button>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <div className="text-2xl font-bold">{provider?.rating}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Yorum</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{provider?.review_count}</div>
            </CardContent>
          </Card>
        </div>

        {/* Aktivite Listesi Başlığı */}
        <h3 className="text-xl font-semibold mb-4">Mevcut Aktiviteleriniz</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-secondary rounded-lg overflow-hidden relative">
                    <img src={activity.image} alt={activity.name?.tr} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{activity.name?.tr}</h4>
                    <div className="flex items-center text-sm text-muted-foreground gap-3">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {activity.location?.tr}</span>
                      <span>{activity.price} TL</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Düzenle</Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">Sil</Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground">Henüz bir aktivite eklememişsiniz.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}