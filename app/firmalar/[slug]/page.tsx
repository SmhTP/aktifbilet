"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  BadgeCheck,
  ChevronRight,
  Clock,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RatingStars } from "@/components/rating-stars"
import { getProviderBySlug, activities, reviews } from "@/lib/data"
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

export default function ProviderDetailPage({ params }: PageProps) {
  const { t, locale } = useI18n()
  const { slug } = use(params)
  const provider = getProviderBySlug(slug)
  
  // TypeScript için locale tipi
  const currentLocale = locale as "tr" | "en"

  if (!provider) {
    notFound()
  }

  const providerActivities = provider.activities.map((pa) => {
    const activity = activities.find((a) => a.id === pa.activityId)
    return { ...pa, activity }
  }).filter((pa) => pa.activity)

  const providerReviews = reviews.filter((r) => r.providerId === provider.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t("booking.breadcrumbHome")}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/firmalar" className="hover:text-foreground transition-colors">
              {t("providers.header")}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{provider.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative h-32 w-32 shrink-0 rounded-2xl overflow-hidden">
            <Image
              src={provider.logo}
              alt={provider.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-foreground">{provider.name}</h1>
              {provider.verified && (
                <Badge className="bg-primary text-primary-foreground gap-1">
                  <BadgeCheck className="h-4 w-4" />
                  {t("providerDetail.verifiedCompany")}
                </Badge>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <RatingStars rating={provider.rating} />
                <span className="font-semibold text-foreground ml-1">{provider.rating}</span>
                <span>({provider.reviewCount} {t("common.reviews")})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span>{provider.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-5 w-5" />
                <span>{provider.founded} {t("providerDetail.servingSince")}</span>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
              {/* Dinamik Provider Açıklaması */}
              {provider.description[currentLocale]}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="activities" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="activities">
                  {t("providerDetail.activities")} ({providerActivities.length})
                </TabsTrigger>
                <TabsTrigger value="reviews">{t("providerDetail.reviews")} ({providerReviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="activities" className="mt-6">
                <div className="space-y-4">
                  {providerActivities.map(({ activity, ...providerActivity }) => (
                    <Card key={providerActivity.activityId} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-40 shrink-0">
                          <Image
                            src={activity!.image}
                            alt={activity!.name[currentLocale]}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-4">
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <Link
                                    href={`/aktiviteler/${activity!.slug}`}
                                    className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
                                  >
                                    {/* Dinamik Aktivite Adı */}
                                    {activity!.name[currentLocale]}
                                  </Link>
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {t(categoryTranslationKeys[activity!.categorySlug]) || activity!.category}
                                  </Badge>
                                </div>
                                <div className="text-right shrink-0">
                                  {providerActivity.originalPrice && (
                                    <p className="text-sm text-muted-foreground line-through">
                                      {providerActivity.originalPrice} TL
                                    </p>
                                  )}
                                  <p className="text-xl font-bold text-primary">
                                    {providerActivity.price} TL
                                  </p>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {/* Dinamik Kısa Açıklama */}
                                {activity!.shortDescription[currentLocale]}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {providerActivity.duration}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Users className="h-3 w-3 mr-1" />
                                  {providerActivity.minParticipants}-{providerActivity.maxParticipants} {t("common.person")}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Link
                                  href={`/rezervasyon/${activity!.slug}?firma=${provider.slug}`}
                                >
                                  {t("common.book")}
                                </Link>
                              </Button>
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/aktiviteler/${activity!.slug}`}>
                                  {t("common.details")}
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {providerReviews.length > 0 ? (
                    providerReviews.map((review) => (
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
                      {t("providerDetail.noReviews")}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("providerDetail.contact")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("provider.phone")}</p>
                      <a
                        href={`tel:${provider.phone}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {provider.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("provider.email")}</p>
                      <a
                        href={`mailto:${provider.email}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {provider.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("provider.website")}</p>
                      <a
                        href={`https://${provider.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {provider.website}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("common.location")}</p>
                      <p className="font-medium text-foreground">{provider.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("providerDetail.stats")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-secondary/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{provider.rating}</p>
                      <p className="text-sm text-muted-foreground">{t("providerDetail.avgRating")}</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{provider.reviewCount}</p>
                      <p className="text-sm text-muted-foreground">{t("providerDetail.reviews2")}</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{provider.activities.length}</p>
                      <p className="text-sm text-muted-foreground">{t("providerDetail.activity")}</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{new Date().getFullYear() - provider.founded}</p>
                      <p className="text-sm text-muted-foreground">{t("providerDetail.yearsExp")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}