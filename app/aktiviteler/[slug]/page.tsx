"use client"

import { use, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, MapPin, Clock, Users, BadgeCheck, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RatingStars } from "@/components/rating-stars"
import { getActivityBySlug, getProvidersByActivity, reviews } from "@/lib/data"
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

export default function ActivityDetailPage({ params }: PageProps) {
  const { t, locale } = useI18n()
  const { slug } = use(params)
  const activity = getActivityBySlug(slug)
  
  // TypeScript için aktif dil tipi
  const currentLocale = locale as "tr" | "en"

  if (!activity) {
    notFound()
  }

  const activityProviders = getProvidersByActivity(activity.id)
  const activityReviews = reviews.filter((r) => r.activityId === activity.id)

  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    activityProviders[0]?.id || null
  )

  const selectedProvider = activityProviders.find((p) => p.id === selectedProviderId)
  const selectedProviderActivity = selectedProvider?.activities.find(
    (a) => a.activityId === activity.id
  )

  // Yeni veri yapısına göre atamalar
  const activityName = activity.name[currentLocale]
  const activityCategory = t(categoryTranslationKeys[activity.categorySlug]) || activity.category
  const activityDescription = activity.description[currentLocale]

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">{t("booking.breadcrumbHome")}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/aktiviteler" className="hover:text-foreground transition-colors">{t("activities.header")}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{activityName}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
              <Image
                src={activity.image}
                alt={activityName}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground">
                  {activityCategory}
                </Badge>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground">{activityName}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">{activity.rating}</span>
                  <span>({activity.reviewCount} {t("common.reviews")})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>{activity.location[currentLocale]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>{activity.duration[currentLocale]}</span>
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
                  <p className="text-muted-foreground leading-relaxed">{activityDescription}</p>
                </div>
              </TabsContent>

              <TabsContent value="providers" className="mt-6">
                <div className="space-y-4">
                  {activityProviders.map((provider) => {
                    const providerActivity = provider.activities.find(
                      (a) => a.activityId === activity.id
                    )
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
                          <div className="flex items-start gap-4">
                            <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden">
                              <Image
                                src={provider.logo}
                                alt={provider.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{provider.name}</h3>
                                {provider.verified && (
                                  <BadgeCheck className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <RatingStars rating={provider.rating} size="sm" />
                                <span className="text-sm text-muted-foreground">
                                  ({provider.reviewCount})
                                </span>
                              </div>
                              {providerActivity && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {providerActivity.duration}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    <Users className="h-3 w-3 mr-1" />
                                    {providerActivity.minParticipants}-{providerActivity.maxParticipants} {t("common.person")}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              {providerActivity?.originalPrice && (
                                <p className="text-sm text-muted-foreground line-through">
                                  {providerActivity.originalPrice} TL
                                </p>
                              )}
                              <p className="text-xl font-bold text-primary">
                                {providerActivity?.price} TL
                              </p>
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
                <div className="space-y-6">
                  {activityReviews.length > 0 ? (
                    activityReviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden">
                              <Image
                                src={review.userAvatar}
                                alt={review.userName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-foreground">{review.userName}</h4>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                              <RatingStars rating={review.rating} size="sm" />
                              <p className="mt-2 text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {t("activityDetail.noReviews")}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{t("activityDetail.booking")}</span>
                    {selectedProviderActivity?.originalPrice && (
                      <Badge variant="destructive" className="text-xs">
                        %{Math.round(
                          ((selectedProviderActivity.originalPrice - selectedProviderActivity.price) /
                            selectedProviderActivity.originalPrice) *
                            100
                        )}{" "}
                        {t("activityDetail.discount")}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedProvider && selectedProviderActivity ? (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={selectedProvider.logo}
                            alt={selectedProvider.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{selectedProvider.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            <span className="text-sm text-muted-foreground">
                              {selectedProvider.rating}
                            </span>
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
                          {selectedProviderActivity.includes.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-primary" />
                              {item}
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
                            <span className="text-2xl font-bold text-primary">
                              {selectedProviderActivity.price} TL
                            </span>
                            <span className="text-sm text-muted-foreground"> {t("common.perPerson")}</span>
                          </div>
                        </div>
                      </div>

                      <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
                        <Link href={`/rezervasyon/${activity.slug}?firma=${selectedProvider.slug}`}>
                          {t("common.book")}
                        </Link>
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
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
                  <Link
                    href={`/karsilastir?aktivite=${activity.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
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