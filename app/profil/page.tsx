"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera, Bell, Shield, LogOut, Loader2 } from "lucide-react"
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
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+90 532 000 0000", // Şimdilik varsayılan
    location: "Türkiye", // Şimdilik varsayılan
  })

  // Oturum Kontrolü
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/kullanici/giris")
      } else {
        setUser(user)
        setFormData({
          name: user.user_metadata?.full_name || "İsimsiz Kullanıcı",
          email: user.email || "",
          phone: "+90 532 000 0000",
          location: "Türkiye",
        })
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleSave = () => {
    setIsEditing(false)
    // Gelecekte buraya isim/telefon güncelleme kodu eklenebilir
  }

  // YENİ: Gerçek Çıkış Yapma Fonksiyonu
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
        <p className="text-muted-foreground">Profiliniz yükleniyor...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">{t("profile.header") || "Profilim"}</h1>
          <p className="mt-2 text-muted-foreground">{t("profile.headerDesc") || "Kişisel bilgilerinizi ve hesap ayarlarınızı yönetin."}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-secondary">
                      {/* Şimdilik varsayılan bir avatar kullanıyoruz */}
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  {/* GERÇEK VERİLER */}
                  <h2 className="mt-4 text-xl font-semibold text-foreground">{formData.name}</h2>
                  <p className="text-muted-foreground">{formData.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    Yeni Üye
                  </Badge>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">{t("profile.reservations") || "Rezervasyon"}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">{t("profile.evaluations") || "Değerlendirme"}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/etkinliklerim">
                      <Calendar className="mr-2 h-4 w-4" />
                      {t("myEvents.title") || "Biletlerim"}
                    </Link>
                  </Button>
                  {/* YENİ: Buton onClick fonksiyonuna bağlandı */}
                  <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("profile.logout") || "Çıkış Yap"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">{t("profile.personalInfoTitle") || "Kişisel Bilgiler"}</TabsTrigger>
                <TabsTrigger value="notifications">{t("profile.notificationSettings") || "Bildirimler"}</TabsTrigger>
                <TabsTrigger value="security">{t("profile.security") || "Güvenlik"}</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t("profile.personalInfoTitle") || "Kişisel Bilgiler"}</CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                      className={isEditing ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
                    >
                      {isEditing ? t("common.save") || "Kaydet" : <><Edit2 className="mr-2 h-4 w-4" />{t("common.edit") || "Düzenle"}</>}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t("profile.fullName") || "Ad Soyad"}
                        </Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        ) : (
                          <p className="text-foreground py-2 font-medium">{formData.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {t("profile.email") || "E-posta"}
                        </Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            disabled // E-posta değiştirme genelde kapalı olur
                            className="bg-secondary"
                          />
                        ) : (
                          <p className="text-foreground py-2 font-medium">{formData.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t("profile.phone") || "Telefon"}
                        </Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        ) : (
                          <p className="text-foreground py-2 font-medium">{formData.phone}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {t("common.location") || "Konum"}
                        </Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          />
                        ) : (
                          <p className="text-foreground py-2 font-medium">{formData.location}</p>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex justify-end gap-2 pt-4 border-t border-border">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          {t("common.cancel") || "İptal"}
                        </Button>
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          {t("profile.saveChanges") || "Değişiklikleri Kaydet"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      {t("profile.notificationSettings") || "Bildirim Ayarları"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{t("profile.emailNotifications") || "E-posta Bildirimleri"}</p>
                        <p className="text-sm text-muted-foreground">{t("profile.bookingCampaignNotif") || "Rezervasyon ve kampanya bildirimleri"}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{t("profile.smsNotifications") || "SMS Bildirimleri"}</p>
                        <p className="text-sm text-muted-foreground">{t("profile.bookingReminders") || "Rezervasyon hatırlatıcıları"}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{t("profile.campaignNotifications") || "Kampanya Bildirimleri"}</p>
                        <p className="text-sm text-muted-foreground">{t("profile.specialOffers") || "Özel teklifler"}</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {t("profile.securitySettings") || "Güvenlik Ayarları"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-foreground mb-2">{t("profile.changePassword") || "Şifre Değiştir"}</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">{t("profile.currentPassword") || "Mevcut Şifre"}</Label>
                            <Input id="current-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">{t("profile.newPassword") || "Yeni Şifre"}</Label>
                            <Input id="new-password" type="password" />
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            {t("profile.updatePassword") || "Şifreyi Güncelle"}
                          </Button>
                        </div>
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