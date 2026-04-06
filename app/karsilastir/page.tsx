"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ArrowUpDown, Check, X, Star, BadgeCheck, Clock, Users, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RatingStars } from "@/components/rating-stars"
import { activities, providers, getProvidersByActivity } from "@/lib/data"
import { useI18n } from "@/lib/i18n"

interface ComparisonRow {
  provider: (typeof providers)[0]
  providerActivity: NonNullable<(typeof providers)[0]["activities"][0]>
  activity: (typeof activities)[0]
}

const categoryTranslationKeys: Record<string, string> = {
  "doga-sporlari": "category.natureSports",
  "su-sporlari": "category.waterSports",
  "macera": "category.adventure",
  "workshop": "category.workshop",
  "kultur-sanat": "category.culturalArt",
}

export default function ComparePage() {
  const { t, locale } = useI18n()
  const currentLocale = locale as "tr" | "en"
  
  const [selectedActivityId, setSelectedActivityId] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("price-asc")

  const comparableActivities = useMemo(() => {
    return activities.filter((activity) => {
      const activityProviders = getProvidersByActivity(activity.id)
      return activityProviders.length > 1
    })
  }, [])

  const comparisonData = useMemo((): ComparisonRow[] => {
    if (!selectedActivityId) return []

    const activity = activities.find((a) => a.id === selectedActivityId)
    if (!activity) return []

    const activityProviders = getProvidersByActivity(selectedActivityId)
    
    const rows: ComparisonRow[] = activityProviders
      .map((provider) => {
        const providerActivity = provider.activities.find(
          (pa) => pa.activityId === selectedActivityId
        )
        if (!providerActivity) return null
        return { provider, providerActivity, activity }
      })
      .filter((row): row is ComparisonRow => row !== null)

    switch (sortBy) {
      case "price-asc":
        rows.sort((a, b) => a.providerActivity.price - b.providerActivity.price)
        break
      case "price-desc":
        rows.sort((a, b) => b.providerActivity.price - a.providerActivity.price)
        break
      case "rating":
        rows.sort((a, b) => b.provider.rating - a.provider.rating)
        break
      case "reviews":
        rows.sort((a, b) => b.provider.reviewCount - a.provider.reviewCount)
        break
    }

    return rows
  }, [selectedActivityId, sortBy])

  const lowestPrice = useMemo(() => {
    if (comparisonData.length === 0) return 0
    return Math.min(...comparisonData.map((row) => row.providerActivity.price))
  }, [comparisonData])

  const highestPrice = useMemo(() => {
    if (comparisonData.length === 0) return 0
    return Math.max(...comparisonData.map((row) => row.providerActivity.price))
  }, [comparisonData])

  const savings = highestPrice - lowestPrice

  const getActivityName = (activity: typeof activities[0]) => {
    return activity.name[currentLocale]
  }

  const getActivityCategory = (activity: typeof activities[0]) => {
    return t(categoryTranslationKeys[activity.categorySlug]) || activity.category
  }

  const getActivityShortDesc = (activity: typeof activities[0]) => {
    return activity.shortDescription[currentLocale]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">{t("compare.header")}</h1>
          <p className="mt-2 text-muted-foreground">{t("compare.headerDesc")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("compare.selectActivityLabel")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedActivityId} onValueChange={setSelectedActivityId}>
                <SelectTrigger className="w-full sm:w-[400px]">
                  <SelectValue placeholder={t("compare.selectPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {comparableActivities.map((activity) => {
                    const providerCount = getProvidersByActivity(activity.id).length
                    return (
                      <SelectItem key={activity.id} value={activity.id}>
                        {getActivityName(activity)} ({providerCount} {t("compare.providers")})
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {selectedActivityId && (
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={t("common.sort")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">{t("compare.sortLowest")}</SelectItem>
                    <SelectItem value="price-desc">{t("compare.sortHighest")}</SelectItem>
                    <SelectItem value="rating">{t("compare.sortRating")}</SelectItem>
                    <SelectItem value="reviews">{t("compare.sortReviews")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {!selectedActivityId ? (
          <div className="text-center py-16">
            <Search className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-6 text-xl font-medium text-foreground">
              {t("compare.selectActivityPrompt")}
            </h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              {t("compare.selectActivityPromptDesc")}
            </p>
          </div>
        ) : (
          <>
            {savings > 0 && (
              <Card className="mb-8 border-primary bg-primary/5">
                <CardContent className="py-4">
                  <div className="flex items-center justify-center gap-4">
                    <TrendingDown className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">{t("compare.savingsBetween")}</p>
                      <p className="text-2xl font-bold text-primary">{savings} TL {t("compare.savings")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {comparisonData.length > 0 && (
              <Card className="mb-8">
                <CardContent className="py-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="relative h-32 w-48 shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={comparisonData[0].activity.image}
                        alt={getActivityName(comparisonData[0].activity)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Badge className="mb-2 bg-primary text-primary-foreground">
                        {getActivityCategory(comparisonData[0].activity)}
                      </Badge>
                      <h2 className="text-2xl font-bold text-foreground">
                        {getActivityName(comparisonData[0].activity)}
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        {getActivityShortDesc(comparisonData[0].activity)}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-medium text-foreground">{comparisonData[0].activity.rating}</span>
                          <span>({comparisonData[0].activity.reviewCount} {t("common.reviews")})</span>
                        </div>
                        <span className="text-muted-foreground">|</span>
                        <span className="text-muted-foreground">
                          {comparisonData.length} {t("compare.comparing")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>{t("compare.providerComparison")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">{t("providers.header")}</TableHead>
                        <TableHead>{t("common.price")}</TableHead>
                        <TableHead>{t("common.duration")}</TableHead>
                        <TableHead>{t("compare.capacity")}</TableHead>
                        <TableHead>{t("common.rating")}</TableHead>
                        <TableHead>{t("common.includes")}</TableHead>
                        <TableHead className="text-right">{t("common.select")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonData.map((row, index) => (
                        <TableRow key={row.provider.id} className={index === 0 && sortBy === "price-asc" ? "bg-primary/5" : ""}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden">
                                <Image
                                  src={row.provider.logo}
                                  alt={row.provider.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <Link
                                    href={`/firmalar/${row.provider.slug}`}
                                    className="font-medium text-foreground hover:text-primary transition-colors"
                                  >
                                    {row.provider.name}
                                  </Link>
                                  {row.provider.verified && (
                                    <BadgeCheck className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                {index === 0 && sortBy === "price-asc" && (
                                  <Badge className="mt-1 text-xs bg-primary text-primary-foreground">
                                    {t("compare.bestValue")}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {row.providerActivity.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through mr-2">
                                  {row.providerActivity.originalPrice} TL
                                </span>
                              )}
                              <span className={`text-lg font-bold ${
                                row.providerActivity.price === lowestPrice ? "text-primary" : "text-foreground"
                              }`}>
                                {row.providerActivity.price} TL
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {row.providerActivity.duration}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {row.providerActivity.minParticipants}-{row.providerActivity.maxParticipants}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <RatingStars rating={row.provider.rating} size="sm" />
                              <span className="text-sm text-muted-foreground">
                                ({row.provider.reviewCount})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              {row.providerActivity.includes.slice(0, 3).map((item, i) => (
                                <Badge key={i} variant="outline" className="mr-1 mb-1 text-xs">
                                  {item}
                                </Badge>
                              ))}
                              {row.providerActivity.includes.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{row.providerActivity.includes.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                              <Link href={`/rezervasyon/${row.activity.slug}?firma=${row.provider.slug}`}>
                                {t("common.select")}
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t("compare.detailedComparison")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">{t("compare.feature")}</TableHead>
                        {comparisonData.map((row) => (
                          <TableHead key={row.provider.id} className="text-center">
                            {row.provider.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{t("compare.verifiedProvider")}</TableCell>
                        {comparisonData.map((row) => (
                          <TableCell key={row.provider.id} className="text-center">
                            {row.provider.verified ? (
                              <Check className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t("compare.pricePerPerson")}</TableCell>
                        {comparisonData.map((row) => (
                          <TableCell key={row.provider.id} className="text-center font-semibold">
                            {row.providerActivity.price} TL
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t("common.duration")}</TableCell>
                        {comparisonData.map((row) => (
                          <TableCell key={row.provider.id} className="text-center">
                            {row.providerActivity.duration}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t("compare.minParticipants")}</TableCell>
                        {comparisonData.map((row) => (
                          <TableCell key={row.provider.id} className="text-center">
                            {row.providerActivity.minParticipants} {t("common.person")}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t("compare.maxParticipants")}</TableCell>
                        {comparisonData.map((row) => (
                          <TableCell key={row.provider.id} className="text-center">
                            {row.providerActivity.maxParticipants} {t("common.person")}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t("compare.providerRating")}</TableCell>
                        {comparisonData.map((row) => (
                          <TableCell key={row.provider.id} className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              {row.provider.rating}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t("compare.reviewCount")}</TableCell>
                        {comparisonData.map((row) => (
                          <TableCell key={row.provider.id} className="text-center">
                            {row.provider.reviewCount}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t("compare.experience")}</TableCell>
                        {comparisonData.map((row) => (
                          <TableCell key={row.provider.id} className="text-center">
                            {new Date().getFullYear() - row.provider.founded} {t("compare.years")}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}