"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  BadgeCheck,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RatingStars } from "@/components/rating-stars"
import { supabase } from "@/lib/supabase"
import { useI18n } from "@/lib/i18n"

const categoryTranslationKeys: Record<string, string> = {
  "doga-sporlari": "category.natureSports",
  "su-sporlari": "category.waterSports",
  "macera": "category.adventure",
  "workshop": "category.workshop",
  "kultur-sanat": "category.culturalArt",
}

// Güvenli metin okuyucu (JSON veya düz metin çökmelerini engeller)
const getText = (obj: any, locale: string, fallback = "") => {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  return obj[locale] || obj['tr'] || fallback;
}

export default function ProviderDetailPage() {
  const { t, locale } = useI18n()
  const params = useParams()
  const currentLocale = locale as "tr" | "en"

  const [provider, setProvider] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProviderAndActivities() {
      if (!params.slug) return

      // 1. Firmayı (Provider) slug üzerinden bul
      const { data: pData, error: pError } = await supabase
        .from("providers")
        .select("*")
        .eq("slug", params.slug)
        .single()

      if (pData) {
        setProvider(pData)

        // 2. Bu firmaya ait tüm aktiviteleri çek
        const { data: aData } = await supabase
          .from("activities")
          .select("*")
          .eq("provider_id", pData.id)
        
        if (aData) setActivities(aData)
      } else {
        console.error("Firma bulunamadı:", pError)
      }
      
      setLoading(false)
    }

    fetchProviderAndActivities()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Firma detayları yükleniyor...</p>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Firma Bulunamadı</h2>
          <Button asChild><Link href="/firmalar">Firmalara Dön</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t("booking.breadcrumbHome") || "Ana Sayfa"}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/firmalar" className="hover:text-foreground transition-colors">
              {t("providers.header") || "Firmalar"}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{provider.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Firma Başlık Alanı */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative h-32 w-32 shrink-0 rounded-2xl overflow-hidden bg-secondary border border-border flex items-center justify-center text-4xl font-bold text-primary">
            {/* Logo yoksa isminin ilk harfini basıyoruz */}
            {provider.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-foreground">{provider.name}</h1>
              <Badge className="bg-primary text-primary-foreground gap-1">
                <BadgeCheck className="h-4 w-4" />
                Doğrulanmış İşletme
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <RatingStars rating={provider.rating || 0} />
                <span className="font-semibold text-foreground ml-1">{provider.rating || 0}</span>
                <span>({provider.review_count || 0} Yorum)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                {/* Şimdilik varsayılan bir konum atadık */}
                <span>Türkiye</span>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl line-clamp-3">
              {provider.name}, AktifBilet platformunda onaylı bir etkinlik sağlayıcısıdır. Misafirlerimize güvenilir ve unutulmaz deneyimler sunmak için buradayız.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="activities" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="activities">
                  Aktiviteler ({activities.length})
                </TabsTrigger>
                <TabsTrigger value="reviews">Değerlendirmeler (0)</TabsTrigger>
              </TabsList>

              <TabsContent value="activities" className="mt-6">
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.map((activity) => {
                      const activityName = getText(activity.name, currentLocale, "İsimsiz Aktivite");
                      const activityDesc = getText(activity.description, currentLocale, "");
                      const activityCat = t(categoryTranslationKeys[activity.categorySlug]) || activity.categorySlug;
                      const duration = typeof activity.duration === 'string' ? activity.duration : getText(activity.duration, currentLocale, "");

                      return (
                        <Card key={activity.id} className="overflow-hidden hover:border-primary/50 transition-all">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-secondary">
                              <Image
                                src={activity.image || "/placeholder.jpg"}
                                alt={activityName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <CardContent className="flex-1 p-4">
                              <div className="flex flex-col h-full justify-between">
                                <div>
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <Link
                                        href={`/aktiviteler/${activity.slug}`}
                                        className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
                                      >
                                        {activityName}
                                      </Link>
                                      <Badge variant="secondary" className="ml-2 text-xs">
                                        {activityCat}
                                      </Badge>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-xl font-bold text-primary">
                                        {activity.price} TL
                                      </p>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                    {activityDesc}
                                  </p>
                                  {duration && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {duration}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <div className="mt-4 flex gap-2">
                                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    <Link href={`/rezervasyon/${activity.slug}`}>
                                      Rezervasyon Yap
                                    </Link>
                                  </Button>
                                  <Button asChild variant="outline" size="sm">
                                    <Link href={`/aktiviteler/${activity.slug}`}>
                                      Detayları İncele
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      )
                    })
                  ) : (
                    <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
                      <p className="text-muted-foreground">Bu firmaya ait henüz bir aktivite bulunmuyor.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
                  <p className="text-muted-foreground">Henüz bir değerlendirme yapılmamış.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>İletişim Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">E-posta</p>
                      <a href={`mailto:iletisim@${provider.slug}.com`} className="font-medium text-foreground hover:text-primary transition-colors">
                        iletisim@{provider.slug}.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Web Sitesi</p>
                      <a href={`https://www.${provider.slug}.com`} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-primary transition-colors">
                        www.{provider.slug}.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>İstatistikler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-secondary/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{provider.rating || 0}</p>
                      <p className="text-sm text-muted-foreground">Puan</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{provider.review_count || 0}</p>
                      <p className="text-sm text-muted-foreground">Yorum</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{activities.length}</p>
                      <p className="text-sm text-muted-foreground">Aktivite</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">1</p>
                      <p className="text-sm text-muted-foreground">Yıllık Tecrübe</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}