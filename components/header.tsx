"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation" // YENİ EKLENDİ
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Menu, X, User, MapPin, Calendar, ChevronDown } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useI18n()
  
  // YENİ EKLENDİ: Mevcut sayfanın adresini alıyoruz
  const pathname = usePathname()

  // YENİ EKLENDİ: Eğer adres "/firma" ile başlıyorsa (giriş veya panel fark etmez), 
  // Header'ı hiç çizme, doğrudan null döndür.
  if (pathname?.startsWith('/firma')) {
    return null
  }

  const categories = [
    { name: t("category.natureSports"), href: "/aktiviteler?kategori=doga-sporlari" },
    { name: t("category.waterSports"), href: "/aktiviteler?kategori=su-sporlari" },
    { name: t("category.adventure"), href: "/aktiviteler?kategori=macera" },
    { name: t("category.workshop"), href: "/aktiviteler?kategori=workshop" },
    { name: t("category.culturalArt"), href: "/aktiviteler?kategori=kultur-sanat" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AktifBilet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/aktiviteler" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.activities")}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t("nav.categories")}
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link href={category.href}>{category.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/firmalar" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.providers")}
            </Link>
            <Link href="/karsilastir" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.compare")}
            </Link>
          </nav>

          {/* Search & User Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dil Seçici Masaüstü */}
            <LanguageSwitcher />
            
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-5 w-5" />
              <span className="sr-only">{t("nav.search")}</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t("nav.myAccount")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profil">{t("nav.myProfile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/etkinliklerim">{t("nav.myEvents")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/kullanici/giris">{t("nav.login")}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/aktiviteler">
                <Calendar className="mr-2 h-4 w-4" />
                {t("nav.book")}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Dil Seçici Mobil */}
            <LanguageSwitcher />
            
            <button
              className="p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">{t("nav.menu")}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="/aktiviteler" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                {t("nav.activities")}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-sm text-muted-foreground pl-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link href="/firmalar" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                {t("nav.providers")}
              </Link>
              <Link href="/karsilastir" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                {t("nav.compare")}
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link href="/profil" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
                  {t("nav.myProfile")}
                </Link>
                <Link href="/etkinliklerim" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
                  {t("nav.myEvents")}
                </Link>
                <Button asChild className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/aktiviteler" onClick={() => setMobileMenuOpen(false)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {t("nav.book")}
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}