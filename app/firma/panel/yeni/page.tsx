"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function AddActivity() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [providerId, setProviderId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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
      if (providerData) setProviderId(providerData.id)
    }
    getProvider()
  }, [router])

  // Dosya seçildiğinde önizleme oluştur
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!providerId || !imageFile) {
      alert("Lütfen bir fotoğraf seçin!")
      setLoading(false)
      return
    }

    try {
      // 1. Resmi Supabase Storage'a Yükle
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${providerId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('activity-images')
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      // 2. Yüklenen resmin linkini al
      const { data: { publicUrl } } = supabase.storage
        .from('activity-images')
        .getPublicUrl(filePath)

      // 3. Veritabanına kaydet
      const slug = formData.nameTr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now()

      const { error: dbError } = await supabase.from("activities").insert({
        provider_id: providerId,
        slug: slug,
        name: { tr: formData.nameTr, en: formData.nameEn },
        description: { tr: formData.descTr, en: formData.descEn },
        price: parseInt(formData.price),
        location: { tr: formData.locationTr, en: formData.locationEn },
        duration: formData.duration,
        category: formData.category,
        image: publicUrl // Artık gerçek resim linkini kaydediyoruz!
      })

      if (dbError) throw dbError
      router.push("/firma/panel")

    } catch (error: any) {
      alert("Hata oluştu: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary/20 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild><Link href="/firma/panel"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-2xl font-bold">Yeni Aktivite Ekle</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            
            {/* Resim Yükleme Alanı */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Aktivite Fotoğrafı</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-secondary/10 hover:bg-secondary/20 transition-all overflow-hidden relative">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Önizleme" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Tıklayın veya fotoğrafı sürükleyin</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input required name="nameTr" placeholder="Aktivite Adı (TR)" onChange={(e) => setFormData({...formData, nameTr: e.target.value})} />
              <Input required name="nameEn" placeholder="Aktivite Adı (EN)" onChange={(e) => setFormData({...formData, nameEn: e.target.value})} />
              <Input required type="number" name="price" placeholder="Fiyat (TL)" onChange={(e) => setFormData({...formData, price: e.target.value})} />
              <select name="category" className="w-full h-10 px-3 rounded-md border border-input bg-background" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="macera">Macera</option>
                <option value="su-sporlari">Su Sporları</option>
                <option value="doga-sporlari">Doğa Sporları</option>
              </select>
            </div>

            <Input required name="descTr" placeholder="Kısa Açıklama (TR)" onChange={(e) => setFormData({...formData, descTr: e.target.value})} />
            
            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Resimle Birlikte Kaydet
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}