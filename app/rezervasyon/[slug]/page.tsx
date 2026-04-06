"use client"

import { use, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
  Check,
  ChevronRight,
  Minus,
  Plus,
  BadgeCheck,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { getActivityBySlug, getProviderBySlug, providers } from "@/lib/data"
import { useI18n } from "@/lib/i18n"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function BookingPage({ params }: PageProps) {
  const { t, locale } = useI18n()
  const { slug } = use(params)
  const searchParams = useSearchParams()
  const providerSlug = searchParams.get("firma")
  
  // TypeScript için locale tipi
  const currentLocale = locale as "tr" | "en"

  const activity = getActivityBySlug(slug)
  const provider = providerSlug ? getProviderBySlug(providerSlug) : providers[0]

  if (!activity) {
    notFound()
  }

  const providerActivity = provider?.activities.find(
    (pa) => pa.activityId === activity.id
  )

  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [participants, setParticipants] = useState(
    providerActivity?.minParticipants || 1
  )
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const totalPrice = (providerActivity?.price || 0) * participants

  // Dinamik aktivite adı
  const activityName = activity.name[currentLocale]

  const handleSubmit = () => {
    setStep(4)
  }

  if (!provider || !providerActivity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">{t("booking.noProviderFound")}</p>
          <Button asChild className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={`/aktiviteler/${slug}`}>{t("booking.returnToActivity")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">{t("booking.breadcrumbHome")}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/aktiviteler" className="hover:text-foreground transition-colors">{t("booking.breadcrumbActivities")}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/aktiviteler/${slug}`} className="hover:text-foreground transition-colors">{activityName}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{t("booking.header")}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: t("booking.step1Label") },
              { num: 2, label: t("booking.step2Label") },
              { num: 3, label: t("booking.step3Label") },
              { num: 4, label: t("booking.step4Label") },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      step >= s.num
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                  </div>
                  <span className="mt-2 text-xs text-muted-foreground hidden sm:block">
                    {s.label}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`h-1 w-16 sm:w-24 mx-2 ${
                      step > s.num ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("booking.selectDateParticipants")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t("booking.selectDateLabel")}
                    </Label>
                    <RadioGroup
                      value={selectedDate}
                      onValueChange={setSelectedDate}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                    >
                      {providerActivity.availableDates.map((date) => (
                        <div key={date}>
                          <RadioGroupItem
                            value={date}
                            id={date}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={date}
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <span className="text-sm font-medium">
                              {new Date(date).toLocaleDateString(currentLocale === "en" ? "en-US" : "tr-TR", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(date).toLocaleDateString(currentLocale === "en" ? "en-US" : "tr-TR", {
                                weekday: "short",
                              })}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t("booking.participantCount")}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setParticipants(Math.max(providerActivity.minParticipants, participants - 1))
                        }
                        disabled={participants <= providerActivity.minParticipants}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-bold text-foreground w-12 text-center">
                        {participants}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setParticipants(Math.min(providerActivity.maxParticipants, participants + 1))
                        }
                        disabled={participants >= providerActivity.maxParticipants}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("booking.min")}: {providerActivity.minParticipants}, {t("booking.max")}: {providerActivity.maxParticipants} {t("common.person")}
                    </p>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                    disabled={!selectedDate}
                    onClick={() => setStep(2)}
                  >
                    {t("booking.continue")}
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("booking.contactInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("booking.fullName")}</Label>
                    <Input
                      id="name"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      placeholder={t("booking.namePlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("profile.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder={t("booking.emailPlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("profile.phone")}</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      placeholder={t("booking.phonePlaceholder")}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      {t("booking.back")}
                    </Button>
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
                      onClick={() => setStep(3)}
                    >
                      {t("booking.continue")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("booking.paymentInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">{t("booking.cardNumber")}</Label>
                    <Input id="cardNumber" placeholder={t("booking.cardNumberPlaceholder")} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">{t("booking.expiry")}</Label>
                      <Input id="expiry" placeholder={t("booking.expiryPlaceholder")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">{t("booking.cvv")}</Label>
                      <Input id="cvv" placeholder={t("booking.cvvPlaceholder")} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">{t("booking.cardName")}</Label>
                    <Input id="cardName" placeholder={t("booking.cardNamePlaceholder")} />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      {t("booking.back")}
                    </Button>
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleSubmit}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {totalPrice} TL {t("booking.pay")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card className="border-primary">
                <CardContent className="pt-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary mx-auto">
                    <Check className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-foreground">{t("booking.confirmed")}</h2>
                  <p className="mt-2 text-muted-foreground">{t("booking.confirmationEmail")}</p>
                  <div className="mt-8 space-y-4 text-left bg-secondary/50 rounded-lg p-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("booking.bookingNo")}</span>
                      <span className="font-mono font-medium text-foreground">#RZV-{Date.now().toString().slice(-6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("booking.activity")}</span>
                      <span className="font-medium text-foreground">{activityName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("booking.date")}</span>
                      <span className="font-medium text-foreground">
                        {new Date(selectedDate).toLocaleDateString(currentLocale === "en" ? "en-US" : "tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("booking.participant")}</span>
                      <span className="font-medium text-foreground">{participants} {t("common.person")}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("booking.total")}</span>
                      <span className="text-lg font-bold text-primary">{totalPrice} TL</span>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link href="/etkinliklerim">{t("booking.goToMyEvents")}</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/aktiviteler">{t("booking.browseOther")}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t("booking.summaryTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={activity.image}
                      alt={activityName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{activityName}</h3>
                    {/* Dinamik lokasyon alanı */}
                    <p className="text-sm text-muted-foreground">{activity.location[currentLocale]}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground">{provider.name}</span>
                      {provider.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span className="text-sm text-muted-foreground">{provider.rating}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("booking.date")}</span>
                      <span className="font-medium text-foreground">
                        {new Date(selectedDate).toLocaleDateString(currentLocale === "en" ? "en-US" : "tr-TR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("common.duration")}</span>
                    <span className="font-medium text-foreground">{providerActivity.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("booking.participant")}</span>
                    <span className="font-medium text-foreground">{participants} {t("common.person")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("common.perPerson")}</span>
                    <span className="font-medium text-foreground">{providerActivity.price} TL</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{t("booking.total")}</span>
                  <span className="text-2xl font-bold text-primary">{totalPrice} TL</span>
                </div>

                <div className="pt-2">
                  <p className="text-sm font-medium text-foreground mb-2">{t("booking.includedItems")}</p>
                  <ul className="space-y-1">
                    {providerActivity.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}