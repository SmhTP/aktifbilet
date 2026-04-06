"use client"

import Link from "next/link"
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AktifBilet</span>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/70 hover:text-background transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/aktiviteler" className="text-sm text-background/70 hover:text-background transition-colors">
                  {t("footer.allActivities")}
                </Link>
              </li>
              <li>
                <Link href="/firmalar" className="text-sm text-background/70 hover:text-background transition-colors">
                  {t("footer.providers")}
                </Link>
              </li>
              <li>
                <Link href="/karsilastir" className="text-sm text-background/70 hover:text-background transition-colors">
                  {t("footer.priceCompare")}
                </Link>
              </li>
              <li>
                <Link href="/etkinliklerim" className="text-sm text-background/70 hover:text-background transition-colors">
                  {t("footer.myEvents")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.categories")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/aktiviteler?kategori=doga-sporlari" className="text-sm text-background/70 hover:text-background transition-colors">
                  {t("category.natureSports")}
                </Link>
              </li>
              <li>
                <Link href="/aktiviteler?kategori=su-sporlari" className="text-sm text-background/70 hover:text-background transition-colors">
                  {t("category.waterSports")}
                </Link>
              </li>
              <li>
                <Link href="/aktiviteler?kategori=macera" className="text-sm text-background/70 hover:text-background transition-colors">
                  {t("footer.adventureSports")}
                </Link>
              </li>
              <li>
                <Link href="/aktiviteler?kategori=workshop" className="text-sm text-background/70 hover:text-background transition-colors">
                  {t("category.workshop")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="h-4 w-4" />
                destek@AktifBilet.com
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4" />
                +90 212 555 0123
              </li>
              <li className="flex items-start gap-2 text-sm text-background/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                Besiktas, Istanbul, Turkiye
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/70">
              2024 AktifBilet. {t("footer.rights")}
            </p>
            <div className="flex gap-6">
              <Link href="/gizlilik" className="text-sm text-background/70 hover:text-background transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="/kullanim-kosullari" className="text-sm text-background/70 hover:text-background transition-colors">
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
