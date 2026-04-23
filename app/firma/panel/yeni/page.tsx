"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Save, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function NewActivity() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [providerId, setProviderId] = useState<string | null>(null)
  
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nameTr: "",
    price: "",
    locationTr: "",
    duration: "",
    descTr: "",
    category: "macera",
  })

  // Sayfa açıldığında firmanın ID'sini bulalım
  useEffect(() => {
    async function getProvider() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("providers")
          .select("id")
          .eq("user_id", user.id)
          .single()
        
        if (data) setProviderId(data.id)
      }
      setLoading(false)
    }
    getProvider()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // Türkçe karakterleri ve boşlukları URL'ye uygun hale getirme (Slug oluşturucu)
  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           
      .replace(/[^\w\-]+/g, '')       
      .replace(/\-\-+/g, '-')         
      .replace(/^-+/, '')             
      .replace(/-+$/, '') + '-' + Date.now().toString().slice(-4);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // MANUEL KONTROL: Resim seçilmiş mi?
    if (!newImageFile) {
      alert("Lütfen aktivite için bir fotoğraf seçin.")
      return
    }

    if (!providerId) {
      alert("Firma bilgisi bulunamadı, lütfen tekrar giriş yapın.")
      return
    }

    setSaveLoading(true)

    try {
      // 1. Resmi Supabase Storage'a Yükle
      const fileExt = newImageFile.name.split('.').pop()
      const fileName = `tur-${Date.now()}.${fileExt}`
      const filePath = `activity-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('activity-images')
        .upload(filePath, newImageFile)

      if (uploadError) throw new Error("Resim yüklenemedi.")

      // Resmin açık linkini al
      const { data: publicUrlData } = supabase.storage
        .from('activity-images')
        .getPublicUrl(filePath)
      
      const imageUrl = publicUrlData.publicUrl

      // 2. Aktiviteyi Veritabanına Ekle
      const { error: insertError } = await supabase
        .from("activities")
        .insert({
          provider_id: providerId,
          slug: generateSlug(formData.nameTr),
          name: { tr: formData.nameTr, en: formData.nameTr },
          description: { tr: formData.descTr, en: formData.descTr },
          price: parseInt(formData.price),
          location: { tr: formData.locationTr, en: formData.locationTr },
          duration: formData.duration,
          category: formData.category,
          image: imageUrl
        })

      if (insertError) throw insertError

      // Başarılı olursa panele dön
      router.push("/firma/panel")

    } catch (error: any) {
      alert("Kayıt sırasında hata oluştu: " + error.message)
      console.error(error)
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="min-h-screen bg-secondary/20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild><Link href="/firma/panel"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-2xl font-bold">Yeni Aktivite Ekle</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-8">
          
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Aktivite Fotoğrafı</label>
            <div className="relative h-64 w-full rounded-xl overflow-hidden border-2 border-dashed border-border group bg-secondary/50">
              {previewUrl ? (
                <>
                  <Image src={previewUrl} alt="Önizleme" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                      <Upload className="h-4 w-4" /> Fotoğrafı Değiştir
                      {/* required YOK! */}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer hover:bg-secondary/80 transition-colors">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Fotoğraf Seçmek İçin Tıklayın</span>
                  {/* required YOK! */}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Aktivite İsmi</label>
              <Input value={formData.nameTr} onChange={e => setFormData({...formData, nameTr: e.target.value})} placeholder="Örn: Balon Turu" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fiyat (TL)</label>
              <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Örn: 1500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Konum</label>
              <Input value={formData.locationTr} onChange={e => setFormData({...formData, locationTr: e.target.value})} placeholder="Örn: Kapadokya, Nevşehir" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Süre</label>
              <Input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Örn: 2 Saat" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Açıklama</label>
            <textarea 
              className="w-full p-3 border border-input bg-background rounded-md min-h-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.descTr}
              onChange={e => setFormData({...formData, descTr: e.target.value})}
              placeholder="Aktivitenin detaylarını, nelerin dahil olduğunu buraya yazın..."
              required
            />
          </div>

          <Button type="submit" disabled={saveLoading} className="w-full h-12 text-lg">
            {saveLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
            Aktiviteyi Yayınla
          </Button>

        </form>
      </div>
    </div>
  )
}