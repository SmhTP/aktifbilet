"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ActivityCard } from "@/components/activity-card"
import { categories } from "@/lib/data"
import { useI18n } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"

const categoryTranslationKeys: Record<string, string> = {
  "doga-sporlari": "category.natureSports",
  "su-sporlari": "category.waterSports",
  "macera": "category.adventure",
  "workshop": "category.workshop",
  "kultur-sanat": "category.culturalArt",
}

// Gelen veriyi her koşulda güvenli bir çoklu dil objesine çeviren Zırhlı Fonksiyon
const safeJson = (val: any) => {
  if (!val) return { tr: "", en: "" }
  if (typeof val === "string") {
    try {
      return JSON.parse(val)
    } catch (e) {
      return { tr: val, en: val }
    }
  }
  return val
}

function ActivitiesContent() {
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const currentLocale = locale as "tr" | "en"
  
  const [dbActivities, setDbActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popular")
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000])

  useEffect(() => {
    async function fetchActivities() {
      const { data, error } = await supabase
        .from("activities")
        .select(`
          *,
          providers (
            rating,
            review_count
          )
        `)

      if (data) {
        const formattedData = data.map((item) => ({
          id: item.id,
          slug: item.slug,
          name: safeJson(item.name),
          description: safeJson(item.description),
          minPrice: item.price || 0,
          image: item.image || "/placeholder.jpg",
          location: safeJson(item.location),
          duration: item.duration || "",
          categorySlug: item.category || "all",
          rating: item.providers?.rating || 0,
          reviewCount: item.providers?.review_count || 0,
        }))
        setDbActivities(formattedData)
      } else if (error) {
        console.error("Veri çekme hatası:", error)
      }
      setIsLoading(false)
    }

    fetchActivities()
  }, [])

  useEffect(() => {
    const categoryFromUrl = searchParams.get("kategori")
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [searchParams])

  const filteredActivities = useMemo(() => {
    let result = dbActivities

    if (searchQuery) {
      result = result.filter((activity) => {
        const nameText = activity.name?.[currentLocale] || ""
        const descText = activity.description?.[currentLocale] || ""
        return (
          nameText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          descText.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    if (selectedCategory !== "all") {
      result = result.filter((activity) => activity.categorySlug === selectedCategory)
    }

    result = result.filter(
      (activity) => activity.minPrice >= priceRange[0] && activity.minPrice <= priceRange[1]
    )

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.minPrice - b.minPrice)
        break
      case "price-desc":
        result = [...result].sort((a, b) => b.minPrice - a.minPrice)
        break
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case "popular":
      default:
        result = [...result].sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }

    return result
  }, [searchQuery, selectedCategory, sortBy, priceRange, currentLocale, dbActivities])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("popular")
    setPriceRange([0, 50000])
  }

  const getCategoryName = (category: any) => {
    const key = categoryTranslationKeys[category.slug]
    if (key) {
      const translated = t(key)
      if (translated) return translated
    }
    return typeof category.name === 'string' ? category.name : "Kategori"
  }

  // EKSİK OLAN RETURN KISMI BURASIYDI, EKLENDİ!
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">{t("activities.header") || "Aktiviteler"}</h1>
          <p className="mt-2 text-muted-foreground">{t("activities.headerDesc") || "Tüm aktiviteleri keşfedin"}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol Kenar Çubuğu - Filtreler */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">{t("section.categories") || "Kategoriler"}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === "all"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    {t("activities.allCategories") || "Tüm Kategoriler"}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.slug
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      {getCategoryName(category)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">{t("activities.priceRange") || "Fiyat Aralığı"}</h3>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    step={100}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0]} TL</span>
                    <span>{priceRange[1]} TL</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={clearFilters} className="w-full">
                {t("activities.clearFilters") || "Filtreleri Temizle"}
              </Button>
            </div>
          </aside>

          {/* Ana İçerik Alanı */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("activities.searchPlaceholder") || "Aktivite ara..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t("common.sort") || "Sırala"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">{t("activities.sortPopular") || "Popüler"}</SelectItem>
                    <SelectItem value="rating">{t("activities.sortRating") || "Puana Göre"}</SelectItem>
                    <SelectItem value="price-asc">{t("activities.sortPriceLow") || "Artan Fiyat"}</SelectItem>
                    <SelectItem value="price-desc">{t("activities.sortPriceHigh") || "Azalan Fiyat"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Aktiviteler yükleniyor...</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  {filteredActivities.length} {t("activities.found") || "sonuç bulundu"}
                </p>

                {filteredActivities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredActivities.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-secondary/20 rounded-lg">
                    <p className="text-muted-foreground">Aradığınız kriterlere uygun aktivite bulunamadı.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ActivitiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ActivitiesContent />
    </Suspense>
  )
}