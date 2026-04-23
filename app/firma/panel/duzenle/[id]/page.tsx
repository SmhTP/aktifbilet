"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function EditActivity() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

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

  useEffect(() => {
    async function fetchActivity() {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("id", id)
        .single()

      if (data) {
        setFormData({
          nameTr: data.name?.tr || "",
          nameEn: data.name?.en || "",
          descTr: data.description?.tr || "",
          descEn: data.description?.en || "",
          price: data.price ? data.price.toString() : "",
          locationTr: data.location?.tr || "",
          locationEn: data.location?.en || "",
          duration: data.duration || "",
          category: data.category || "macera",
        })
      }
      setLoading(false)
    }
    fetchActivity()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)

    const { error } = await supabase
      .from("activities")
      .update({
        name: { tr: formData.nameTr, en: formData.nameEn },
        description: { tr: formData.descTr, en: formData.descEn },
        price: parseInt(formData.price),
        location: { tr: formData.locationTr, en: formData.locationEn },
        duration: formData.duration,
        category: formData.category,
      })
      .eq("id", id)

    if (error) {
      alert("Güncelleme hatası! Lütfen tekrar deneyin.")
      console.error(error)
    } else {
      router.push("/firma/panel")
    }
    setSaveLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-secondary/20">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/firma/panel"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">Aktiviteyi Düzenle</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Aktivite İsmi (TR)</label>
              <Input 
                value={formData.nameTr} 
                onChange={e => setFormData({...formData, nameTr: e.target.value})} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fiyat (TL)</label>
              <Input 
                type="number" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Konum (TR)</label>
              <Input 
                value={formData.locationTr} 
                onChange={e => setFormData({...formData, locationTr: e.target.value})} 
                placeholder="Örn: Kapadokya, Nevşehir"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Süre</label>
              <Input 
                value={formData.duration} 
                onChange={e => setFormData({...formData, duration: e.target.value})} 
                placeholder="Örn: 2 Saat, Tam Gün"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Açıklama (TR)</label>
            <textarea 
              className="w-full p-3 border border-input bg-background rounded-md min-h-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.descTr}
              onChange={e => setFormData({...formData, descTr: e.target.value})}
              placeholder="Müşterilerinize aktivitenizi detaylıca anlatın..."
              required
            />
          </div>

          <Button type="submit" disabled={saveLoading} className="w-full h-12 text-lg">
            {saveLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
            Değişiklikleri Kaydet
          </Button>

        </form>
      </div>
    </div>
  )
}