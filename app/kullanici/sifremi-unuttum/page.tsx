"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Kullanıcıya şifre sıfırlama linki gönderiyoruz. Tıklayınca 'yeni-sifre' sayfasına gidecek.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/kullanici/yeni-sifre`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
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
          <CardTitle className="text-2xl font-bold">Şifremi Unuttum</CardTitle>
          <CardDescription className="text-base">
            E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="bg-green-500/10 p-4 rounded-full inline-block">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="font-bold text-lg">E-posta Gönderildi!</h3>
              <p className="text-sm text-muted-foreground">
                Lütfen gelen kutunuzu (veya spam klasörünü) kontrol edin. Şifrenizi sıfırlamak için oradaki bağlantıya tıklayın.
              </p>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/kullanici/giris">Giriş Sayfasına Dön</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
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

              <Button type="submit" className="w-full h-12 text-lg font-semibold mt-4 shadow-lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sıfırlama Linki Gönder"}
              </Button>
              
              <Button asChild variant="ghost" className="w-full mt-2">
                <Link href="/kullanici/giris" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Girişe Dön
                </Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}