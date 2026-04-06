"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n"

interface ActivityCardProps {
  activity: any // Supabase'den gelen dinamik veri formatı için any yapıyoruz
  variant?: "default" | "compact"
}

const categoryTranslationKeys: Record<string, string> = {
  "doga-sporlari": "category.natureSports",
  "su-sporlari": "category.waterSports",
  "macera": "category.adventure",
  "workshop": "category.workshop",
  "kultur-sanat": "category.culturalArt",
}

// Güvenli metin okuyucu (Eğer JSON değilse veya eksikse çökmeyi engeller)
const getText = (obj: any, locale: string, fallback = "") => {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  return obj[locale] || obj['tr'] || fallback;
}

export function ActivityCard({ activity, variant = "default" }: ActivityCardProps) {
  const { t, locale } = useI18n()
  const currentLocale = locale as "tr" | "en"

  // Çökmeyi engellemek için verileri güvenli şekilde alıyoruz
  const name = getText(activity.name, currentLocale, "İsimsiz Aktivite")
  const description = getText(activity.description, currentLocale, "")
  const locationText = getText(activity.location, currentLocale, "Konum belirtilmemiş")
  // Süre veritabanımızda JSON değil, düz metin ('2 Saat') olarak kayıtlı
  const durationText = typeof activity.duration === 'string' ? activity.duration : getText(activity.duration, currentLocale, "")

  return (
    <Link href={`/aktiviteler/${activity.slug || '#'}`}>
      <Card className="group overflow-hidden border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
          <Image
            src={activity.image || "/placeholder.jpg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground">
              {t(categoryTranslationKeys[activity.categorySlug]) || activity.categorySlug || "Kategori"}
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
            {name}
          </h3>
          {variant === "default" && description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{locationText}</span>
            </div>
            {durationText && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{durationText}</span>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium text-foreground">{activity.rating || 0}</span>
              <span className="text-muted-foreground">({activity.reviewCount || 0})</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">{t("common.from") || "Başlayan fiyatlarla"}</span>
              <p className="font-bold text-primary">{activity.minPrice || 0} TL</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}