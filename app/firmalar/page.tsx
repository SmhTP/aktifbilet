"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, SlidersHorizontal, BadgeCheck, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ProviderCard } from "@/components/provider-card"
import { supabase } from "@/lib/supabase"
import { useI18n } from "@/lib/i18n"

export default function ProvidersPage() {
  const { t } = useI18n()
  
  // Supabase'den gelecek veriler için state'ler
  const [dbProviders, setDbProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filtre state'leri
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("rating")
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  useEffect(() => {
    async function fetchProviders() {
      // Firmaları ve onlara bağlı aktivitelerin sayısını (sıralama yapabilmek için) çekiyoruz
      const { data, error } = await supabase
        .from("providers")
        .select(`
          *,
          activities ( id )
        `)

      if (data) {
        // Gelen veriyi senin ProviderCard bileşeninin ve arama/filtre fonksiyonlarının çökmemesi için formatlıyoruz
        const formattedData = data.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name || "İsimsiz Firma",
          description: p.description || "AktifBilet onaylı hizmet sağlayıcısı.", // Arama çubuğu için boş kalmamalı
          location: p.location || "Türkiye", // Arama çubuğu için
          rating: p.rating || 0,
          reviewCount: p.review_count || 0,
          verified: true, // Şimdilik platformdaki firmaları onaylı sayıyoruz
          activities: p.activities || [], // Aktivite sayısına göre sıralama için
          logo: p.logo || "/placeholder.jpg" // Eğer logoları yoksa
        }))
        setDbProviders(formattedData)
      } else {
        console.error("Firmalar çekilirken hata:", error)
      }
      setLoading(false)
    }

    fetchProviders()
  }, [])

  const filteredProviders = useMemo(() => {
    let result = dbProviders

    // 1. Arama Filtresi
    if (searchQuery) {
      result = result.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 2. Sadece Onaylılar Filtresi
    if (verifiedOnly) {
      result = result.filter((provider) => provider.verified)
    }

    // 3. Sıralama İşlemleri
    switch (sortBy) {
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case "reviews":
        result = [...result].sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case "activities":
        result = [...result].sort((a, b) => b.activities.length - a.activities.length)
        break
      case "name":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [searchQuery, sortBy, verifiedOnly, dbProviders])

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">{t("providers.header") || "Firmalar"}</h1>
          <p className="mt-2 text-muted-foreground">{t("providers.headerDesc") || "En güvenilir aktivite sağlayıcılarını keşfedin"}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("providers.searchPlaceholder") || "Firma veya konum ara..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="verified"
                checked={verifiedOnly}
                onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
              />
              <Label htmlFor="verified" className="text-sm flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <BadgeCheck className="h-4 w-4 text-primary" />
                {t("providers.verifiedOnly") || "Sadece Onaylılar"}
              </Label>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("common.sort") || "Sırala"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">{t("providers.sortRating") || "Puana Göre"}</SelectItem>
                <SelectItem value="reviews">{t("providers.sortReviews") || "Yorum Sayısına Göre"}</SelectItem>
                <SelectItem value="activities">{t("providers.sortActivities") || "Aktivite Sayısına Göre"}</SelectItem>
                <SelectItem value="name">{t("providers.sortName") || "İsme Göre (A-Z)"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Firmalar yükleniyor...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {filteredProviders.length} {t("providers.found") || "firma bulundu"}
            </p>

            {filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
                <p className="text-lg font-medium text-foreground">{t("providers.notFound") || "Aradığınız kriterlerde firma bulunamadı."}</p>
                <p className="mt-2 text-muted-foreground">{t("providers.tryDifferent") || "Lütfen farklı bir arama yapmayı deneyin."}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}