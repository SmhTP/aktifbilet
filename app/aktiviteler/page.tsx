"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { ActivityCard } from "@/components/activity-card"
import { activities, categories } from "@/lib/data"
import { useI18n } from "@/lib/i18n"

const categoryTranslationKeys: Record<string, string> = {
  "doga-sporlari": "category.natureSports",
  "su-sporlari": "category.waterSports",
  "macera": "category.adventure",
  "workshop": "category.workshop",
  "kultur-sanat": "category.culturalArt",
}

// useSearchParams kullanımı için Suspense sarmalayıcısı gereklidir
function ActivitiesContent() {
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const currentLocale = locale as "tr" | "en"
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popular")
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000])

  // URL'den gelen ?kategori=slug parametresini yakalayıp filtreyi güncelliyoruz
  useEffect(() => {
    const categoryFromUrl = searchParams.get("kategori")
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [searchParams])

  const filteredActivities = useMemo(() => {
    let result = activities

    if (searchQuery) {
      result = result.filter(
        (activity) =>
          activity.name[currentLocale].toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description[currentLocale].toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      result = result.filter((activity) => activity.categorySlug === selectedCategory)
    }

    result = result.filter(
      (activity) => activity.minPrice >= priceRange[0] && activity.minPrice <= priceRange[1]
    )

    // Sıralama Mantığı
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
  }, [searchQuery, selectedCategory, sortBy, priceRange, currentLocale])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("popular")
    setPriceRange([0, 1000])
  }

  const getCategoryName = (category: typeof categories[0]) => {
    return t(categoryTranslationKeys[category.slug]) || category.name
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">{t("activities.header")}</h1>
          <p className="mt-2 text-muted-foreground">{t("activities.headerDesc")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol Kenar Çubuğu - Filtreler */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">{t("section.categories")}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === "all"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    {t("activities.allCategories")}
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
                <h3 className="font-semibold text-foreground mb-3">{t("activities.priceRange")}</h3>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={50}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0]} TL</span>
                    <span>{priceRange[1]} TL</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={clearFilters} className="w-full">
                {t("activities.clearFilters")}
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
                  placeholder={t("activities.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t("common.sort")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">{t("activities.sortPopular")}</SelectItem>
                    <SelectItem value="rating">{t("activities.sortRating")}</SelectItem>
                    <SelectItem value="price-asc">{t("activities.sortPriceLow")}</SelectItem>
                    <SelectItem value="price-desc">{t("activities.sortPriceHigh")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              {filteredActivities.length} {t("activities.found")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Ana sayfa bileşeni
export default function ActivitiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivitiesContent />
    </Suspense>
  )
}