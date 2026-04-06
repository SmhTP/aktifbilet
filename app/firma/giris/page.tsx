"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Lock, Mail, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function ProviderLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    // Supabase Kimlik Doğrulama İsteği
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setErrorMsg("Giriş başarısız. E-posta veya şifre hatalı.")
      setIsLoading(false)
    } else {
      // Giriş başarılıysa firma paneline yönlendir
      router.push("/firma/panel")
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Firma Paneli Girişi
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Aktivitelerinizi ve rezervasyonlarınızı yönetmek için giriş yapın
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Hata Mesajı Alanı */}
            {errorMsg && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md p-3">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground">
                E-posta Adresi
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="firma@ornek.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">
                Şifre
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              &larr; Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}