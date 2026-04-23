"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MapPin, Loader2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function ProviderLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  
  const [loading, setLoading] = useState(true) // Sayfa ilk açılış yüklemesi
  const [loginLoading, setLoginLoading] = useState(false) // Butona basılma yüklemesi
  const [error, setError] = useState<string | null>(null)

  // AKILLI KONTROL: Sayfa açılır açılmaz oturum var mı diye bakıyoruz
  useEffect(() => {
    async function checkExistingSession() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Eğer zaten giriş yapmışsa, formu hiç göstermeden direkt Panele fırlat!
        router.push("/firma/panel")
      } else {
        // Giriş yapmamışsa formu göster
        setLoading(false)
      }
    }
    checkExistingSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError(null)

    // Supabase ile giriş yap
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.")
      setLoginLoading(false)
      return
    }

    // Başarılı girişten sonra panele yönlendir
    router.push("/firma/panel")
  }

  // Oturum kontrolü yapılırken beyaz ekran yerine şık bir yükleme simgesi
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Oturumunuz kontrol ediliyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-secondary/20 p-4">
      
      <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
          <MapPin className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-3xl font-extrabold text-foreground tracking-tight">AktifBilet</span>
      </Link>

      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">İş Ortağı Girişi</CardTitle>
          <CardDescription className="text-base">
            Firma panelinize erişmek için bilgilerinizi girin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-lg text-center border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="firma@aktifbilet.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                  Şifremi Unuttum
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>

            {/* BENİ HATIRLA SEÇENEĞİ */}
            <div className="flex items-center gap-2 pt-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer text-muted-foreground font-normal">
                Beni Hatırla
              </Label>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-semibold mt-4 shadow-lg shadow-primary/20" disabled={loginLoading}>
              {loginLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Giriş Yap"}
            </Button>
            
          </form>
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground">
        Henüz iş ortağımız değil misiniz? <Link href="/iletisim" className="text-primary font-medium hover:underline">Bizimle iletişime geçin.</Link>
      </p>
      
    </div>
  )
}