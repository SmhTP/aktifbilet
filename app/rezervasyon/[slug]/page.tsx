"use client"

import { use, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Calendar, Clock, Users, CreditCard, Check, ChevronRight, Minus, Plus, BadgeCheck, Star, Loader2, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import { useI18n } from "@/lib/i18n"

interface PageProps {
  params: Promise<{ slug: string }>
}

// ÇÖKME KORUMASI: JSON okuyucu
const getText = (obj: any, locale: string, fallback = "") => {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  return obj[locale] || obj['tr'] || fallback;
}

export default function BookingPage({ params }: PageProps) {
  const { t, locale } = useI18n()
  const currentLocale = locale as "tr" | "en"
  const router = useRouter()
  const { slug } = use(params)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [user, setUser] = useState<any>(null)
  const [activity, setActivity] = useState<any>(null)
  const [provider, setProvider] = useState<any>(null)

  // Rezervasyon Form State'leri
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("10:00") // Saat seçimi eklendi
  const [participants, setParticipants] = useState(1)
  
  // İletişim Bilgileri (Adım 2)
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    async function fetchData() {
      // 1. Kullanıcı Kontrolü
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/kullanici/giris")
        return
      }
      setUser(user)
      setContactInfo({
        name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
      })

      // 2. Aktivite ve Firma Bilgisini Çek
      const { data: actData } = await supabase
        .from("activities")
        .select("*, providers(*)")
        .eq("slug", slug)
        .single()

      if (actData) {
        setActivity(actData)
        setProvider(actData.providers)
      }
      setLoading(false)
    }
    fetchData()
  }, [slug, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center">
        <h2 className="text-2xl font-bold mb-4">Aktivite Bulunamadı</h2>
        <Button asChild><Link href="/aktiviteler">Aktivitelere Dön</Link></Button>
      </div>
    )
  }

  const activityName = getText(activity.name, currentLocale, "İsimsiz Aktivite")
  const location = getText(activity.location, currentLocale, "Konum Belirtilmemiş")
  const duration = typeof activity.duration === 'string' ? activity.duration : getText(activity.duration, currentLocale, "Belirtilmemiş")
  
  const totalPrice = (activity.price || 0) * participants
  const todayDate = new Date().toISOString().split('T')[0]

  // GERÇEK REZERVASYON İŞLEMİ (Adım 3'ten 4'e geçerken)
  const handleSubmit = async () => {
    setSubmitting(true)
    
    const { error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        activity_id: activity.id,
        booking_date: selectedDate,
        booking_time: selectedTime,
        guest_count: participants,
        total_price: totalPrice,
        status: "onaylandi" 
      })

    if (error) {
      alert("Rezervasyon sırasında hata oluştu: " + error.message)
      setSubmitting(false)
    } else {
      setStep(4) // İşlem başarılıysa son ekrana (Onay ekranına) geç
      setSubmitting(false)
    }
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
            <Link href={`/aktiviteler/${slug}`} className="hover:text-foreground transition-colors line-clamp-1 max-w-[200px]">{activityName}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{t("booking.header")}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* İLERLEME ÇUBUĞU */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
              { num: 1, label: t("booking.step1Label") },
              { num: 2, label: t("booking.step2Label") },
              { num: 3, label: t("booking.step3Label") },
              { num: 4, label: t("booking.step4Label") },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center w-full">
                <div className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      step >= s.num ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-muted-foreground"
                    }`}>
                    {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                  </div>
                  <span className="mt-2 text-xs font-medium text-muted-foreground hidden sm:block whitespace-nowrap">
                    {s.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`h-1 flex-1 mx-2 sm:mx-4 rounded-full transition-colors ${
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
            
            {/* ADIM 1: TARİH VE KİŞİ SAYISI */}
            {step === 1 && (
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle>{t("booking.selectDateParticipants")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Tarih Seçin</Label>
                      <Input 
                        type="date" required min={todayDate}
                        value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Saat Seçin</Label>
                      <Input 
                        type="time" required
                        value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t("booking.participantCount")}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setParticipants(Math.max(1, participants - 1))} disabled={participants <= 1}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-3xl font-bold text-foreground w-16 text-center">{participants}</span>
                      <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setParticipants(Math.min(20, participants + 1))} disabled={participants >= 20}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full h-12 text-lg" disabled={!selectedDate || !selectedTime} onClick={() => setStep(2)}>
                    {t("booking.continue")} <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* ADIM 2: İLETİŞİM BİLGİLERİ */}
            {step === 2 && (
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle>{t("booking.contactInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("booking.fullName")}</Label>
                    <Input id="name" value={contactInfo.name} onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("profile.email")}</Label>
                    <Input id="email" type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("profile.phone")}</Label>
                    <Input id="phone" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} className="h-12" />
                  </div>
                  
                  <div className="flex gap-3 pt-6 border-t border-border">
                    <Button variant="outline" className="h-12 px-6" onClick={() => setStep(1)}>{t("booking.back")}</Button>
                    <Button className="flex-1 h-12 text-lg" disabled={!contactInfo.name || !contactInfo.email} onClick={() => setStep(3)}>
                      {t("booking.continue")} <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ADIM 3: ÖDEME (Supabase Kaydı Burada Olur) */}
            {step === 3 && (
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle>{t("booking.paymentInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-6">
                    <p className="text-sm text-foreground/80">Test aşamasında olduğumuz için ödeme adımını atlayarak güvenli rezervasyon yapabilirsiniz.</p>
                  </div>

                  <div className="space-y-2 opacity-50 pointer-events-none">
                    <Label>{t("booking.cardNumber")}</Label>
                    <Input placeholder="**** **** **** ****" className="h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 opacity-50 pointer-events-none">
                    <div className="space-y-2">
                      <Label>{t("booking.expiry")}</Label>
                      <Input placeholder="AA/YY" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("booking.cvv")}</Label>
                      <Input placeholder="***" className="h-12" />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-6 border-t border-border">
                    <Button variant="outline" className="h-12 px-6" onClick={() => setStep(2)} disabled={submitting}>{t("booking.back")}</Button>
                    <Button className="flex-1 h-12 text-lg font-bold" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <CreditCard className="mr-2 h-5 w-5" />}
                      {totalPrice} TL {t("booking.pay")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ADIM 4: ONAY EKRANI */}
            {step === 4 && (
              <Card className="border-primary shadow-lg overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                <CardContent className="pt-12 pb-8 text-center px-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-6">
                    <Check className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">{t("booking.confirmed")}</h2>
                  <p className="mt-2 text-muted-foreground">{t("booking.confirmationEmail")}</p>
                  
                  <div className="mt-8 space-y-4 text-left bg-secondary/30 border border-border rounded-xl p-6 max-w-md mx-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t("booking.bookingNo")}</span>
                      <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">#RZV-{Date.now().toString().slice(-6)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("booking.activity")}</span>
                      <span className="font-medium text-foreground text-right max-w-[200px] truncate">{activityName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("booking.date")}</span>
                      <span className="font-medium text-foreground">
                        {new Date(selectedDate).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("booking.participant")}</span>
                      <span className="font-medium text-foreground">{participants} {t("common.person")}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-foreground">{t("booking.total")}</span>
                      <span className="text-xl font-bold text-primary">{totalPrice} TL</span>
                    </div>
                  </div>
                  
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="h-12 px-8 text-base">
                      <Link href="/etkinliklerim">{t("booking.goToMyEvents")}</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 px-8 text-base">
                      <Link href="/aktiviteler">{t("booking.browseOther")}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* SAĞ PANEL: Özet Kartı */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-border shadow-sm">
              <CardHeader className="bg-secondary/30 border-b border-border">
                <CardTitle>{t("booking.summaryTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden shadow-sm">
                    <Image src={activity.image || "/placeholder.jpg"} alt={activityName} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight">{activityName}</h3>
                    <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{location}</span>
                    </div>
                  </div>
                </div>

                {provider && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-primary">
                        {provider.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-foreground">{provider.name}</span>
                          <BadgeCheck className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium">{provider.rating || 5.0}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  {selectedDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Tarih</span>
                      <span className="font-medium text-foreground bg-secondary px-2 py-1 rounded">{new Date(selectedDate).toLocaleDateString("tr-TR")}</span>
                    </div>
                  )}
                  {selectedTime && (
                     <div className="flex justify-between items-center">
                     <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Saat</span>
                     <span className="font-medium text-foreground">{selectedTime}</span>
                   </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-muted-foreground">{t("booking.participant")}</span>
                    <span className="font-medium text-foreground">{participants} {t("common.person")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("common.perPerson")}</span>
                    <span className="font-medium text-foreground">{activity.price} TL</span>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-xl p-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground text-lg">{t("booking.total")}</span>
                    <span className="text-2xl font-black text-primary">{totalPrice} TL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  )
}