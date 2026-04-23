"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, Mountain, Waves, Compass, Palette, Landmark, TrendingUp, Shield, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ActivityCard } from "@/components/activity-card"
import { ProviderCard } from "@/components/provider-card"
import { supabase } from "@/lib/supabase"
import { useI18n } from "@/lib/i18n"

const categoryIcons: Record<string, React.ReactNode> = {
  "doga-sporlari": <Mountain className="h-6 w-6" />,
  "su-sporlari": <Waves className="h-6 w-6" />,
  "macera": <Compass className="h-6 w-6" />,
  "workshop": <Palette className="h-6 w-6" />,
  "kultur-sanat": <Landmark className="h-6 w-6" />,
}

const categories = [
  { slug: "macera", name: "Macera" },
  { slug: "su-sporlari", name: "Su Sporları" },
  { slug: "doga-sporlari", name: "Doğa Sporları" },
  { slug: "kultur-sanat", name: "Kültür & Sanat" },
  { slug: "workshop", name: "Workshop" }
]

export default function HomePage() {
  const { t } = useI18n()
  const [activities, setActivities] = useState<any[]>([])
  const [providers, setProviders] = useState<any[]>([])

  // GERÇEK VERİLERİ SUPABASE'DEN ÇEKİYORUZ
  useEffect(() => {
    async function fetchData() {
      // En son eklenen 4 aktiviteyi çek
      const { data: actData } = await supabase
        .from("activities")
        .select("*, providers(*)")
        .limit(4)
      
      if (actData) setActivities(actData)

      // En popüler 4 firmayı çek
      const { data: provData } = await supabase
        .from("providers")
        .select("*, activities(id)")
        .limit(4)
      
      if (provData) {
        const formattedProv = provData.map(p => ({
          ...p,
          reviewCount: p.review_count,
          activities: p.activities || []
        }))
        setProviders(formattedProv)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1920&h=1080&fit=crop"
            alt="Istanbul Manzarasi"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/70" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
            {t("hero.title") || "Maceraya Başlama Zamanı"}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed text-pretty">
            {t("hero.subtitle") || "AktifBilet ile Türkiye'nin en heyecan verici etkinliklerini keşfet ve hemen rezervasyon yap."}
          </p>
          
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-card/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("hero.searchPlaceholder") || "Nereye gitmek istersiniz?"}
                  className="pl-10 h-12 border-0 bg-secondary/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                {t("hero.searchButton") || "Arama Yap"}
              </Button>
            </div>
          </div>

          {/* SADECE MÜŞTERİ GİRİŞİ KALDI (Firma girişi aşağıya taşındı) */}
          <div className="mt-8 flex justify-center max-w-2xl mx-auto">
            <Link href="/kullanici/giris">
              <Button variant="outline" className="h-12 bg-background/20 hover:bg-background/40 border-white/30 text-white backdrop-blur-sm transition-all px-8">
                <User className="mr-2 h-4 w-4" />
                Kullanıcı Girişi Yap
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-sm text-white/70">Aktivite</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">20+</p>
              <p className="text-sm text-white/70">Güvenilir Firma</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">5000+</p>
              <p className="text-sm text-white/70">Mutlu Müşteri</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Kategoriler</h2>
            <p className="mt-2 text-muted-foreground">Size en uygun aktiviteyi seçin</p>
          </div>
          
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/aktiviteler?kategori=${category.slug}`}
                className="group flex flex-col items-center p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {categoryIcons[category.slug]}
                </div>
                <span className="mt-4 font-medium text-foreground text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gerçek Aktiviteler */}
      <section className="py-16 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Öne Çıkan Aktiviteler</h2>
              <p className="mt-2 text-muted-foreground">En çok tercih edilen turlar</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary/80">
              <Link href="/aktiviteler">
                Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.length > 0 ? activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            )) : <p className="text-muted-foreground">Aktiviteler yükleniyor...</p>}
          </div>
        </div>
      </section>

      {/* Gerçek Firmalar */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Popüler Firmalar</h2>
              <p className="mt-2 text-muted-foreground">Alanında uzman ekipler</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary/80">
              <Link href="/firmalar">
                Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.length > 0 ? providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            )) : <p className="text-muted-foreground">Firmalar yükleniyor...</p>}
          </div>
        </div>
      </section>

      {/* FOOTER (Firma Girişi Gizli Alanı) */}
      <footer className="bg-card border-t border-border py-8 mt-10">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 AktifBilet. Tüm Hakları Saklıdır.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/hakkimizda" className="text-muted-foreground hover:text-primary">Hakkımızda</Link>
            <Link href="/iletisim" className="text-muted-foreground hover:text-primary">İletişim</Link>
            {/* FİRMA GİRİŞİ ARTIK BURADA */}
            <Link href="/firma/giris" className="text-primary font-medium hover:underline border-l border-border pl-4">
              İş Ortaklarımız (Firma Girişi)
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}