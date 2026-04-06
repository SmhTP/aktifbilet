"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "@/lib/data"
import { useI18n } from "@/lib/i18n"

interface ActivityCardProps {
  activity: Activity
  variant?: "default" | "compact"
}

const categoryTranslationKeys: Record<string, string> = {
  "doga-sporlari": "category.natureSports",
  "su-sporlari": "category.waterSports",
  "macera": "category.adventure",
  "workshop": "category.workshop",
  "kultur-sanat": "category.culturalArt",
}

export function ActivityCard({ activity, variant = "default" }: ActivityCardProps) {
  // locale bilgisini çekiyoruz. (Context'te 'tr' veya 'en' dönüyor)
  const { t, locale } = useI18n()
  
  // TypeScript'in kızmaması için locale'i açıkça belirtiyoruz
  const currentLocale = locale as "tr" | "en"

  return (
    <Link href={`/aktiviteler/${activity.slug}`}>
      <Card className="group overflow-hidden border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={activity.image}
            alt={activity.name[currentLocale]}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground">
              {t(categoryTranslationKeys[activity.categorySlug]) || activity.category}
            </Badge>
          </div>
          {activity.featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                {currentLocale === "en" ? "Featured" : "Önerilen"}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {/* Dinamik Dilden Gelen Veri */}
            {activity.name[currentLocale]}
          </h3>
          {variant === "default" && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {/* Dinamik Dilden Gelen Açıklama */}
              {activity.shortDescription[currentLocale]}
            </p>
          )}
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {/* Dinamik Lokasyon */}
              <span className="line-clamp-1">{activity.location[currentLocale]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {/* Dinamik Süre (Saat/Hours) */}
              <span>{activity.duration[currentLocale]}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium text-foreground">{activity.rating}</span>
              <span className="text-muted-foreground">({activity.reviewCount})</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">{t("common.from")}</span>
              <p className="font-bold text-primary">{activity.minPrice} {t("common.tl")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}