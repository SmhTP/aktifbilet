"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, MapPin, Clock, Users, BadgeCheck, ChevronRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RatingStars } from "@/components/rating-stars"
import { supabase } from "@/lib/supabase"
import { useI18n } from "@/lib/i18n"

interface PageProps {
  params: Promise<{ slug: string }>
}

const categoryTranslationKeys: Record<string, string> = {
  "doga-sporlari": "category.natureSports",
  "su-sporlari": "category.waterSports",
  "macera": "category.adventure",
  "workshop": "category.workshop",
  "kultur-sanat": "category.culturalArt",
}

// JSON Çökme Koruması
const getText = (obj: any, locale: string, fallback = "") => {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  return obj[locale] || obj['tr'] || fallback;
}

export default function ActivityDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const { t, locale } = useI18n()
  const currentLocale = locale as "tr" | "en"
  
  // State'ler
  const [activity, setActivity] = useState<any>(null)
  const [activityProviders, setActivityProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchActivityData() {
      // 1. Aktiviteyi Çek
      const { data: actData, error: actError } = await supabase
        .from("activities")
        .select("*")
        .eq("slug", slug)
        .single()

      if (actError || !actData) {
        console.error("Aktivite bulunamadı:", actError)
        setActivity(null)
        setLoading(false)
        return
      }

      setActivity(actData)

      // 2. Bu Aktiviteyi Sunan Firmaları Çek (Supabase yapısında activity içindeki provider_id üzerinden veya ara tablodan)
      // Mevcut veritabanımızda 1 aktivite 1 firmaya ait. Eğer ileride "birçok firma 1 aktiviteyi yapar" derseniz ara tablo (activity_providers) kurarız.
      // Şimdilik bu aktivitenin sahibini "activityProviders" listesine ekliyoruz.
      const { data: provData } = await supabase
        .from("providers")
        .select("*")
        .eq("id", actData.provider_id)
      
      if (provData && provData.length > 0) {
        // Senin arayüz yapını korumak için, veritabanından gelen aktivite verisini "providerActivity" formatına uyduruyoruz
        const formattedProviders = provData.map(p => ({
          ...p,
          providerActivity: {
             price: actData.price,
             originalPrice: actData.price * 1.2, // Örnek indirim göstermek için
             duration: typeof actData.duration === 'string' ? actData.duration : getText(actData.duration, currentLocale, "1 Gün"),
             minParticipants: 1,
             maxParticipants: 10,
             includes: ["Rehberlik", "Ekipman", "Sigorta"]
          }
        }))

        setActivityProviders(formattedProviders)
        setSelectedProviderId(formattedProviders[0].id)
      }

      setLoading(false)
    }

    fetchActivityData()
  }, [slug, currentLocale])


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Aradığınız aktivite bulunamadı veya yayından kaldırılmış olabilir.</p>
        <Button asChild size="lg">
          <Link href="/aktiviteler">Tüm Aktivitelere Dön</Link>
        </Button>
      </div>
    )
  }

  // Dinamik Veriler
  const activityName = getText(activity.name, currentLocale, "İsimsiz Aktivite")
  const activityCategory = t(categoryTranslationKeys[activity.categorySlug]) || activity.categorySlug || activity.category || "Genel"
  const activityDescription = getText(activity.description, currentLocale, "Açıklama bulunmuyor.")
  const activityLocation = getText(activity.location, currentLocale, "Konum Belirtilmemiş")
  const activityDuration = typeof activity.duration === 'string' ? activity.duration : getText(activity.duration, currentLocale, "Belirtilmemiş")

  const selectedProvider = activityProviders.find((p) => p.id === selectedProviderId)
  const selectedProviderActivity = selectedProvider?.providerActivity

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="bg-secondary/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">{t("booking.breadcrumbHome")}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/aktiviteler" className="hover:text-foreground transition-colors">{t("activities.header")}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground line-clamp-1 max-w-[200px]">{activityName}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL PANEL */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-secondary border border-border">
              <Image src={activity.image || "/placeholder.jpg"} alt={activityName} fill className="object-cover" priority />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1 capitalize">
                  {activityCategory}
                </Badge>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground">{activityName}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">5.0</span>
                  <span>(12 {t("common.reviews")})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>{activityLocation}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>{activityDuration}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">{t("activityDetail.description")}</TabsTrigger>
                <TabsTrigger value="providers">{t("activityDetail.providers")} ({activityProviders.length})</TabsTrigger>
                <TabsTrigger value="reviews">{t("activityDetail.reviews")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{activityDescription}</p>
                </div>
              </TabsContent>

              <TabsContent value="providers" className="mt-6">
                <div className="space-y-4">
                  {activityProviders.map((provider) => {
                    const pActivity = provider.providerActivity
                    return (
                      <Card
                        key={provider.id}
                        className={`cursor-pointer transition-all ${
                          selectedProviderId === provider.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedProviderId(provider.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-secondary border border-border flex items-center justify-center text-xl font-bold text-primary">
                              {provider.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{provider.name}</h3>
                                <BadgeCheck className="h-5 w-5 text-blue-500" />
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <RatingStars rating={provider.rating || 5} size="sm" />
                                <span className="text-sm text-muted-foreground">({provider.review_count || 12})</span>
                              </div>
                              {pActivity && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />{pActivity.duration}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    <Users className="h-3 w-3 mr-1" />{pActivity.minParticipants}-{pActivity.maxParticipants} {t("common.person")}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-border">
                              {pActivity?.originalPrice && (
                                <p className="text-sm text-muted-foreground line-through">{pActivity.originalPrice} TL</p>
                              )}
                              <p className="text-xl font-bold text-primary">{pActivity?.price} TL</p>
                              <p className="text-xs text-muted-foreground">{t("common.perPerson")}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
                  <p className="text-muted-foreground">{t("activityDetail.noReviews") || "Henüz değerlendirme yapılmamış."}</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* SAĞ PANEL: Fiyat ve Rezervasyon Butonu */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{t("activityDetail.booking")}</span>
                    {selectedProviderActivity?.originalPrice && (
                      <Badge variant="destructive" className="text-xs">
                        %{Math.round(((selectedProviderActivity.originalPrice - selectedProviderActivity.price) / selectedProviderActivity.originalPrice) * 100)} {t("activityDetail.discount")}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedProvider && selectedProviderActivity ? (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-background border border-border flex items-center justify-center font-bold text-primary">
                          {selectedProvider.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{selectedProvider.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            <span className="text-sm text-muted-foreground">{selectedProvider.rating || "5.0"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("common.duration")}</span>
                          <span className="font-medium text-foreground">{selectedProviderActivity.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("booking.participant")}</span>
                          <span className="font-medium text-foreground">
                            {selectedProviderActivity.minParticipants}-{selectedProviderActivity.maxParticipants} {t("common.person")}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">{t("common.includes")}</p>
                        <ul className="space-y-1">
                          {selectedProviderActivity.includes.map((item: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-primary" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex items-baseline justify-between">
                          <span className="text-muted-foreground">{t("common.price")}</span>
                          <div className="text-right">
                            {selectedProviderActivity.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through mr-2">
                                {selectedProviderActivity.originalPrice} TL
                              </span>
                            )}
                            <span className="text-3xl font-black text-primary">
                              {selectedProviderActivity.price} TL
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* İŞTE BİZİM KUSURSUZ REZERVASYON SAYFAMIZA GİDEN BUTON */}
                      <Button asChild className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg mt-4" size="lg">
                        <Link href={`/rezervasyon/${activity.slug}?firma=${selectedProvider.slug}`}>
                          {t("common.book")} <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>

                      <p className="text-xs text-center text-muted-foreground pt-2">
                        {t("activityDetail.freeCancel")}
                      </p>
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      {t("activityDetail.noProvider")}
                    </p>
                  )}
                </CardContent>
              </Card>

              {activityProviders.length > 1 && (
                <div className="mt-4 text-center">
                  <Link href={`/karsilastir?aktivite=${activity.slug}`} className="text-sm font-medium text-primary hover:underline">
                    {activityProviders.length} {t("activityDetail.compareProviders")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}