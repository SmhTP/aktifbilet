"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, BadgeCheck } from "lucide-react"
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
import { providers } from "@/lib/data"
import { useI18n } from "@/lib/i18n"

export default function ProvidersPage() {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("rating")
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filteredProviders = useMemo(() => {
    let result = providers

    if (searchQuery) {
      result = result.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (verifiedOnly) {
      result = result.filter((provider) => provider.verified)
    }

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
  }, [searchQuery, sortBy, verifiedOnly])

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">{t("providers.header")}</h1>
          <p className="mt-2 text-muted-foreground">{t("providers.headerDesc")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("providers.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="verified"
                checked={verifiedOnly}
                onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
              />
              <Label htmlFor="verified" className="text-sm flex items-center gap-1 cursor-pointer">
                <BadgeCheck className="h-4 w-4 text-primary" />
                {t("providers.verifiedOnly")}
              </Label>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("common.sort")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">{t("providers.sortRating")}</SelectItem>
                <SelectItem value="reviews">{t("providers.sortReviews")}</SelectItem>
                <SelectItem value="activities">{t("providers.sortActivities")}</SelectItem>
                <SelectItem value="name">{t("providers.sortName")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {filteredProviders.length} {t("providers.found")}
        </p>

        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-foreground">{t("providers.notFound")}</p>
            <p className="mt-2 text-muted-foreground">{t("providers.tryDifferent")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
