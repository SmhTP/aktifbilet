"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MapPin, Loader2, Mail, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function UserLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const [loading, setLoading] = useState(true) // Sayfa açılış kontrolü
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Oturum kontrolü
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Eğer giriş yapılmışsa doğrudan ana sayfaya yönlendir
        router.push("/")
      } else {
        setLoading(false)
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.")
      setLoginLoading(false)
      return
    }

    // Başarılı giriş
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
          <CardTitle className="text-2xl font-bold">Hoş Geldiniz</CardTitle>
          <CardDescription className="text-base">
            Maceraya kaldığınız yerden devam edin.
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
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" type="email" placeholder="ornek@email.com" required 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link href="/kullanici/sifremi-unuttum" className="text-sm font-medium text-primary hover:underline">
  Şifremi Unuttum
</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" type="password" required 
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-semibold mt-4 shadow-lg" disabled={loginLoading}>
              {loginLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                <>Giriş Yap <LogIn className="ml-2 h-5 w-5" /></>
              )}
            </Button>
            
          </form>
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground">
        Henüz hesabınız yok mu? <Link href="/kullanici/kayit" className="text-primary font-medium hover:underline">Ücretsiz Kayıt Olun</Link>
      </p>
    </div>
  )
}