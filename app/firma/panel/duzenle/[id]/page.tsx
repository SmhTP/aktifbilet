"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function EditActivity() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  
  // Resim Yönetimi State'leri
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
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
          price: data.price ? data.price.toString() : "",
          locationTr: data.location?.tr || "",
          duration: data.duration || "",
          descTr: data.description?.tr || "",
          category: data.category || "macera",
        })
        setCurrentImageUrl(data.image)
      }
      setLoading(false)
    }
    fetchActivity()
  }, [id])

  // Dosya seçildiğinde önizleme oluştur
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)

    let finalImageUrl = currentImageUrl

    // 1. Eğer yeni bir resim seçildiyse önce onu yükleyelim
    if (newImageFile) {
      const fileExt = newImageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `activity-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('activity-images')
        .upload(filePath, newImageFile)

      if (uploadError) {
        alert("Resim yüklenirken bir hata oluştu.")
        setSaveLoading(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('activity-images')
        .getPublicUrl(filePath)
      
      finalImageUrl = publicUrlData.publicUrl
    }

    // 2. Veritabanını güncelle
    const { error } = await supabase
      .from("activities")
      .update({
        name: { tr: formData.nameTr },
        description: { tr: formData.descTr },
        price: parseInt(formData.price),
        location: { tr: formData.locationTr },
        duration: formData.duration,
        category: formData.category,
        image: finalImageUrl // Yeni veya eski resim linki
      })
      .eq("id", id)

    if (error) {
      alert("Güncelleme hatası!")
      console.error(error)
    } else {
      router.push("/firma/panel")
    }
    setSaveLoading(false)
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="min-h-screen bg-secondary/20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild><Link href="/firma/panel"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-2xl font-bold">Aktiviteyi Düzenle</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-8">
          
          {/* RESİM DÜZENLEME ALANI */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Aktivite Fotoğrafı</label>
            <div className="relative h-64 w-full rounded-xl overflow-hidden border-2 border-dashed border-border group">
              {(previewUrl || currentImageUrl) ? (
                <>
                  <Image 
                    src={previewUrl || currentImageUrl || ""} 
                    alt="Önizleme" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                      <Upload className="h-4 w-4" /> Değiştir
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer hover:bg-secondary/50 transition-colors">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Fotoğraf Yükle</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
            {newImageFile && <p className="text-xs text-primary font-medium italic">* Yeni fotoğraf seçildi, kaydet butonuna basınca güncellenecek.</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Aktivite İsmi (TR)</label>
              <Input value={formData.nameTr} onChange={e => setFormData({...formData, nameTr: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fiyat (TL)</label>
              <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Açıklama (TR)</label>
            <textarea 
              className="w-full p-3 border border-input bg-background rounded-md min-h-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.descTr}
              onChange={e => setFormData({...formData, descTr: e.target.value})}
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