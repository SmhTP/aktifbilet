"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, Mountain, Waves, Compass, Palette, Landmark, TrendingUp, Shield, Clock, User, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ActivityCard } from "@/components/activity-card"
import { ProviderCard } from "@/components/provider-card"
import { getFeaturedActivities, getTopProviders, categories } from "@/lib/data"
import { useI18n } from "@/lib/i18n"

const categoryIcons: Record<string, React.ReactNode> = {
  "doga-sporlari": <Mountain className="h-6 w-6" />,
  "su-sporlari": <Waves className="h-6 w-6" />,
  "macera": <Compass className="h-6 w-6" />,
  "workshop": <Palette className="h-6 w-6" />,
  "kultur-sanat": <Landmark className="h-6 w-6" />,
}

const categoryTranslationKeys: Record<string, string> = {
  "doga-sporlari": "category.natureSports",
  "su-sporlari": "category.waterSports",
  "macera": "category.adventure",
  "workshop": "category.workshop",
  "kultur-sanat": "category.culturalArt",
}

export default function HomePage() {
  const featuredActivities = getFeaturedActivities()
  const topProviders = getTopProviders()
  const { t } = useI18n()

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
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed text-pretty">
            {t("hero.subtitle")}
          </p>
          
          {/* Search Box */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-card/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("hero.searchPlaceholder")}
                  className="pl-10 h-12 border-0 bg-secondary/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                {t("hero.searchButton")}
              </Button>
            </div>
          </div>

          {/* YENİ EKLENEN GİRİŞ BUTONLARI BURADA BAŞLIYOR */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
            <Link href="/kullanici/giris" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 bg-background/20 hover:bg-background/40 border-white/30 text-white backdrop-blur-sm transition-all">
                <User className="mr-2 h-4 w-4" />
                Kullanıcı Girişi
              </Button>
            </Link>
            
            <Link href="/firma/giris" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 bg-background/20 hover:bg-background/40 border-white/30 text-white backdrop-blur-sm transition-all">
                <Building2 className="mr-2 h-4 w-4" />
                Firma Girişi
              </Button>
            </Link>
          </div>
          {/* YENİ EKLENEN GİRİŞ BUTONLARI BURADA BİTİYOR */}

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-sm text-white/70">{t("hero.stats.activities")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">20+</p>
              <p className="text-sm text-white/70">{t("hero.stats.providers")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">5000+</p>
              <p className="text-sm text-white/70">{t("hero.stats.customers")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">{t("section.categories")}</h2>
            <p className="mt-2 text-muted-foreground">{t("section.categoriesDesc")}</p>
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
                  {t(categoryTranslationKeys[category.slug])}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Activities Section */}
      <section className="py-16 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{t("section.featuredActivities")}</h2>
              <p className="mt-2 text-muted-foreground">{t("section.featuredActivitiesDesc")}</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary/80">
              <Link href="/aktiviteler">
                {t("section.viewAll")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredActivities.slice(0, 4).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/aktiviteler">
                {t("section.viewAllActivities")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Top Providers Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{t("section.topProviders")}</h2>
              <p className="mt-2 text-muted-foreground">{t("section.topProvidersDesc")}</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary/80">
              <Link href="/firmalar">
                {t("section.viewAll")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {topProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/firmalar">
                {t("section.viewAllProviders")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">{t("section.whyUs")}</h2>
            <p className="mt-2 text-muted-foreground">{t("section.whyUsDesc")}</p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{t("feature.priceCompare")}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {t("feature.priceCompareDesc")}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{t("feature.verified")}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {t("feature.verifiedDesc")}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{t("feature.instant")}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {t("feature.instantDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground text-balance">
            {t("cta.title")}
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-card text-foreground hover:bg-card/90">
              <Link href="/aktiviteler">
                {t("cta.explore")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/firmalar">
                {t("cta.providers")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}