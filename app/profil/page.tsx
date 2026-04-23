"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera, Bell, Shield, LogOut, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const { t } = useI18n()
  const router = useRouter()
  
  // Supabase State'leri
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Profil Güncelleme State'leri
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  
  // Form Verileri
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  })

  // Şifre Güncelleme State'i
  const [newPassword, setNewPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/kullanici/giris")
      } else {
        setUser(user)
        // Kayıtlı verileri forma doldur (Eğer yoksa varsayılanları koy)
        setFormData({
          name: user.user_metadata?.full_name || "İsimsiz Kullanıcı",
          email: user.email || "",
          phone: user.user_metadata?.phone || "+90 532 000 0000",
          location: user.user_metadata?.location || "Türkiye",
        })
        if (user.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url)
        }
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  // 1. PROFİL BİLGİLERİNİ KAYDET
  const handleSave = async () => {
    setIsSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: { 
        full_name: formData.name,
        phone: formData.phone,
        location: formData.location
      }
    })

    if (error) {
      alert("Bilgiler güncellenirken hata oluştu: " + error.message)
    } else {
      setIsEditing(false)
      alert("Profil bilgileriniz başarıyla güncellendi!")
    }
    setIsSaving(false)
  }

  // 2. FOTOĞRAF YÜKLE
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar-${user.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Resmi Storage'a yükle (Not: 'avatars' adında bir bucket oluşturulmalı)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      alert("Fotoğraf yüklenemedi. 'avatars' bucket'ını oluşturduğunuzdan emin olun.")
      setIsUploadingAvatar(false)
      return
    }

    // Public URL'yi al ve User Metadata'ya kaydet
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
    
    await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    })

    setAvatarUrl(publicUrl)
    setIsUploadingAvatar(false)
  }

  // 3. ŞİFRE GÜNCELLE
  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır.")
      return
    }
    setIsUpdatingPassword(true)
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) alert("Şifre güncellenemedi: " + error.message)
    else {
      alert("Şifreniz başarıyla güncellendi!")
      setNewPassword("")
    }
    setIsUpdatingPassword(false)
  }

  // ÇIKIŞ YAP
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">Profilim</h1>
          <p className="mt-2 text-muted-foreground">Hesap bilgilerinizi yönetin ve ayarlarınızı düzenleyin</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SOL PANEL: Avatar & Kısa Bilgi */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-secondary border-2 border-border">
                      {isUploadingAvatar ? (
                        <div className="flex items-center justify-center h-full w-full bg-secondary/50">
                          <Loader2 className="animate-spin h-6 w-6 text-primary" />
                        </div>
                      ) : (
                        <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                      )}
                    </div>
                    {/* KAMERA BUTONU (Dosya seçici gizli input ile) */}
                    <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-md">
                      <Camera className="h-4 w-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                    </label>
                  </div>
                  
                  <h2 className="mt-4 text-xl font-semibold text-foreground text-center">{formData.name}</h2>
                  <p className="text-sm text-muted-foreground text-center">{formData.email}</p>
                  <Badge variant="secondary" className="mt-2">Yeni Üye</Badge>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Rezervasyon</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Değerlendirme</p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/etkinliklerim"><Calendar className="mr-2 h-4 w-4" /> Biletlerim</Link>
                  </Button>
                  <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SAĞ PANEL: Sekmeler */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Kişisel Bilgiler</TabsTrigger>
                <TabsTrigger value="notifications">Bildirim Ayarları</TabsTrigger>
                <TabsTrigger value="security">Güvenlik</TabsTrigger>
              </TabsList>

              {/* PROFİL DÜZENLEME */}
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Kişisel Bilgiler</CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                      disabled={isSaving}
                      className={isEditing ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
                    >
                      {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit2 className="mr-2 h-4 w-4" />}
                      {isEditing ? "Kaydet" : "Düzenle"}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4" /> Ad Soyad</Label>
                        {isEditing ? (
                          <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        ) : (
                          <p className="text-foreground py-2 font-medium">{formData.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4" /> E-posta</Label>
                        {isEditing ? (
                          <Input id="email" type="email" value={formData.email} disabled className="bg-secondary opacity-70" title="E-posta değiştirilemez" />
                        ) : (
                          <p className="text-foreground py-2 font-medium">{formData.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Telefon</Label>
                        {isEditing ? (
                          <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        ) : (
                          <p className="text-foreground py-2 font-medium">{formData.phone}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Konum</Label>
                        {isEditing ? (
                          <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                        ) : (
                          <p className="text-foreground py-2 font-medium">{formData.location}</p>
                        )}
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="flex justify-end gap-2 pt-6 border-t border-border mt-6">
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>İptal</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                          {isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Değişiklikleri Kaydet
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* BİLDİRİMLER (Görsel) */}
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Bildirim Ayarları</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">E-posta Bildirimleri</p>
                        <p className="text-sm text-muted-foreground">Rezervasyon ve hesap bildirimleri</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Kampanya Bildirimleri</p>
                        <p className="text-sm text-muted-foreground">Özel teklifler ve indirimler</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* GÜVENLİK (Gerçek Şifre Güncelleme) */}
              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Güvenlik Ayarları</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4 max-w-md">
                      <h3 className="font-medium text-foreground mb-4">Şifre Değiştir</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Yeni Şifre</Label>
                          <Input 
                            id="new-password" type="password" placeholder="En az 6 karakter"
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <Button onClick={handlePasswordUpdate} disabled={isUpdatingPassword || newPassword.length < 6} className="w-full">
                          {isUpdatingPassword ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                          Şifreyi Güncelle
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}