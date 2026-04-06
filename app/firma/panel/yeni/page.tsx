"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function AddActivity() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [providerId, setProviderId] = useState<string | null>(null)

  // Form verilerini tutacağımız state
  const [formData, setFormData] = useState({
    nameTr: "",
    nameEn: "",
    descTr: "",
    descEn: "",
    price: "",
    locationTr: "",
    locationEn: "",
    duration: "",
    category: "macera",
  })

  // Sayfa açıldığında giriş yapan firmayı bul
  useEffect(() => {
    async function getProvider() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/firma/giris")
        return
      }

      const { data: providerData } = await supabase
        .from("providers")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (providerData) {
        setProviderId(providerData.id)
      }
    }
    getProvider()
  }, [router])

  // Formu veritabanına gönder
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!providerId) {
      alert("Firma bilgisi bulunamadı!")
      setLoading(false)
      return
    }

    // İsmi URL'ye uygun hale getir (Boğaz Turu -> bogaz-turu)
    const slug = formData.nameTr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now()

    const { error } = await supabase.from("activities").insert({
      provider_id: providerId,
      slug: slug,
      name: { tr: formData.nameTr, en: formData.nameEn },
      description: { tr: formData.descTr, en: formData.descEn },
      price: parseInt(formData.price),
      location: { tr: formData.locationTr, en: formData.locationEn },
      duration: formData.duration,
      category: formData.category,
      image: "/placeholder.jpg" // Şimdilik varsayılan görsel
    })

    setLoading(false)

    if (error) {
      console.error("Hata:", error)
      alert("Aktivite eklenirken bir hata oluştu.")
    } else {
      router.push("/firma/panel") // Başarılıysa panele geri dön
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-secondary/20 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/firma/panel">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Yeni Aktivite Ekle</h1>
            <p className="text-muted-foreground">Müşterilerinize sunacağınız yeni turu detaylandırın.</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Türkçe İsim */}
              <div>
                <label className="block text-sm font-medium mb-2">Aktivite Adı (Türkçe)</label>
                <Input required name="nameTr" value={formData.nameTr} onChange={handleChange} placeholder="Örn: Yamaç Paraşütü" />
              </div>
              
              {/* İngilizce İsim */}
              <div>
                <label className="block text-sm font-medium mb-2">Aktivite Adı (İngilizce)</label>
                <Input required name="nameEn" value={formData.nameEn} onChange={handleChange} placeholder="Örn: Paragliding" />
              </div>

              {/* Fiyat */}
              <div>
                <label className="block text-sm font-medium mb-2">Fiyat (TL)</label>
                <Input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Örn: 1500" />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="macera">Macera</option>
                  <option value="doga-sporlari">Doğa Sporları</option>
                  <option value="su-sporlari">Su Sporları</option>
                  <option value="kultur-sanat">Kültür & Sanat</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>

              {/* Süre */}
              <div>
                <label className="block text-sm font-medium mb-2">Süre</label>
                <Input required name="duration" value={formData.duration} onChange={handleChange} placeholder="Örn: 2 Saat" />
              </div>

              {/* Konum (TR) */}
              <div>
                <label className="block text-sm font-medium mb-2">Konum (Türkçe)</label>
                <Input required name="locationTr" value={formData.locationTr} onChange={handleChange} placeholder="Örn: Fethiye, Muğla" />
              </div>
            </div>

            {/* Açıklama (TR) */}
            <div>
              <label className="block text-sm font-medium mb-2">Kısa Açıklama (Türkçe)</label>
              <Input required name="descTr" value={formData.descTr} onChange={handleChange} placeholder="Aktiviteyi anlatan kısa bir cümle..." />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Aktiviteyi Kaydet
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}