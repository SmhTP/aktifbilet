"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, BadgeCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Provider } from "@/lib/data"
import { useI18n } from "@/lib/i18n"

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const { t, locale } = useI18n()
  
  // TypeScript'in güvende hissetmesi için locale tipini belirtiyoruz
  const currentLocale = locale as "tr" | "en"

  return (
    <Link href={`/firmalar/${provider.slug}`}>
      <Card className="group overflow-hidden border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={provider.logo}
                alt={provider.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                  {provider.name}
                </h3>
                {provider.verified && (
                  <BadgeCheck className="h-5 w-5 text-primary shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium text-foreground">{provider.rating}</span>
                <span className="text-muted-foreground text-sm">({provider.reviewCount} {t("common.reviews")})</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{provider.location}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
            {/* Dinamik dile göre açıklama çekiliyor */}
            {provider.description[currentLocale]}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {provider.activities.length} {t("common.activities")}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currentLocale === "en" ? `Since ${provider.founded}` : `${provider.founded}'den beri`}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}