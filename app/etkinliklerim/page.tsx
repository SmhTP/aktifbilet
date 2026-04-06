"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RatingStars } from "@/components/rating-stars"
import { activities, providers } from "@/lib/data"
import { useI18n } from "@/lib/i18n"

const mockBookings = [
  {
    id: "1",
    activityId: "1",
    providerId: "1",
    date: "2024-12-25",
    time: "10:00",
    participants: 4,
    totalPrice: 1400,
    status: "confirmed" as const,
    createdAt: "2024-12-10",
  },
  {
    id: "2",
    activityId: "3",
    providerId: "3",
    date: "2024-12-28",
    time: "09:00",
    participants: 2,
    totalPrice: 360,
    status: "pending" as const,
    createdAt: "2024-12-15",
  },
  {
    id: "3",
    activityId: "2",
    providerId: "2",
    date: "2024-11-20",
    time: "14:00",
    participants: 8,
    totalPrice: 1600,
    status: "completed" as const,
    createdAt: "2024-11-10",
    reviewed: false,
  },
  {
    id: "4",
    activityId: "4",
    providerId: "4",
    date: "2024-11-15",
    time: "15:00",
    participants: 2,
    totalPrice: 640,
    status: "completed" as const,
    createdAt: "2024-11-05",
    reviewed: true,
  },
  {
    id: "5",
    activityId: "7",
    providerId: "5",
    date: "2024-10-20",
    time: "10:00",
    participants: 3,
    totalPrice: 750,
    status: "cancelled" as const,
    createdAt: "2024-10-10",
  },
]

export default function MyActivitiesPage() {
  const { t, locale } = useI18n()
  const currentLocale = locale as "tr" | "en" // TypeScript için locale tipini belirliyoruz

  const [selectedTab, setSelectedTab] = useState("upcoming")
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  const statusConfig = {
    pending: { label: t("myEvents.status.pending"), variant: "secondary" as const },
    confirmed: { label: t("myEvents.status.confirmed"), variant: "default" as const },
    completed: { label: t("myEvents.status.completed"), variant: "outline" as const },
    cancelled: { label: t("myEvents.status.cancelled"), variant: "destructive" as const },
  }

  const upcomingBookings = mockBookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  )
  const pastBookings = mockBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  )

  const handleReviewSubmit = (bookingId: string) => {
    console.log("Review submitted:", { bookingId, rating: reviewRating, text: reviewText })
    setReviewRating(0)
    setReviewText("")
  }

  // Fonksiyonu yeni dinamik yapıya güncelledik
  const getActivityName = (activity: typeof activities[0]) => {
    return activity.name[currentLocale]
  }

  const BookingCard = ({ booking }: { booking: (typeof mockBookings)[0] }) => {
    const activity = activities.find((a) => a.id === booking.activityId)
    const provider = providers.find((p) => p.id === booking.providerId)
    const status = statusConfig[booking.status]

    if (!activity || !provider) return null

    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-40 shrink-0">
            <Image
              src={activity.image}
              alt={getActivityName(activity)}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>
          <CardContent className="flex-1 p-4">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/aktiviteler/${activity.slug}`}
                      className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
                    >
                      {getActivityName(activity)}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      <Link
                        href={`/firmalar/${provider.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {provider.name}
                      </Link>
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary shrink-0">{booking.totalPrice} TL</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(booking.date).toLocaleDateString(currentLocale === "en" ? "en-US" : "tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{booking.participants} {t("common.person")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {/* activity.location objesi currentLocale ile güncellendi */}
                    <span>{activity.location[currentLocale]}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {booking.status === "confirmed" && (
                  <>
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link href={`/rezervasyon/${booking.id}`}>{t("myEvents.viewDetails")}</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                      {t("myEvents.cancelBooking")}
                    </Button>
                  </>
                )}
                {booking.status === "pending" && (
                  <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                    {t("myEvents.cancelBooking")}
                  </Button>
                )}
                {booking.status === "completed" && !("reviewed" in booking && booking.reviewed) && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Star className="mr-2 h-4 w-4" />
                        {t("myEvents.rate")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("myEvents.rateExperience")}</DialogTitle>
                        <DialogDescription>
                          {getActivityName(activity)} - {provider.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-sm text-muted-foreground">{t("myEvents.yourRating")}</p>
                          <RatingStars
                            rating={reviewRating}
                            size="lg"
                            interactive
                            onRatingChange={setReviewRating}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            {t("myEvents.yourComment")}
                          </label>
                          <Textarea
                            placeholder={t("myEvents.shareExperience")}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          disabled={reviewRating === 0}
                          onClick={() => handleReviewSubmit(booking.id)}
                        >
                          {t("myEvents.submitReview")}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {booking.status === "completed" && "reviewed" in booking && booking.reviewed && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="mr-1 h-3 w-3" />
                    {t("myEvents.rated")}
                  </Badge>
                )}
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/aktiviteler/${activity.slug}`}>
                    {t("myEvents.bookAgain")}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">{t("myEvents.header")}</h1>
          <p className="mt-2 text-muted-foreground">{t("myEvents.headerDesc")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{mockBookings.length}</p>
                <p className="text-sm text-muted-foreground">{t("myEvents.total")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{upcomingBookings.length}</p>
                <p className="text-sm text-muted-foreground">{t("myEvents.upcoming2")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {mockBookings.filter((b) => b.status === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">{t("myEvents.completed")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {mockBookings.filter((b) => b.status === "completed" && "reviewed" in b && b.reviewed).length}
                </p>
                <p className="text-sm text-muted-foreground">{t("myEvents.evaluated")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              {t("myEvents.upcomingEvents")} ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              {t("myEvents.pastEvents")} ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {t("myEvents.noUpcomingEvents")}
                </h3>
                <p className="mt-2 text-muted-foreground">{t("myEvents.newAdventure")}</p>
                <Button asChild className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/aktiviteler">{t("myEvents.discoverActivities")}</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {t("myEvents.noPastEvents")}
                </h3>
                <p className="mt-2 text-muted-foreground">{t("myEvents.bookFirstActivity")}</p>
                <Button asChild className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/aktiviteler">{t("myEvents.discoverActivities")}</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}