"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MapPin, Loader2, User, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function UserRegister() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Supabase ile kayıt işlemi
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Başarılı Kayıt
    setSuccess(true)
    setLoading(false)
    
    // 2 saniye sonra giriş sayfasına veya ana sayfaya yönlendir
    setTimeout(() => {
      router.push("/kullanici/giris")
    }, 2000)
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
          <CardTitle className="text-2xl font-bold">Aramıza Katıl</CardTitle>
          <CardDescription className="text-base">
            Binlerce maceraya ilk adımı atmak için hesap oluştur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="bg-green-500/15 text-green-600 p-6 rounded-xl text-center border border-green-500/20 space-y-3">
              <h3 className="font-bold text-lg">Kayıt Başarılı! 🎉</h3>
              <p className="text-sm">Hesabınız oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...</p>
              <Loader2 className="animate-spin h-6 w-6 mx-auto mt-2" />
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-lg text-center border border-destructive/20">
                  {error === "User already registered" ? "Bu e-posta adresi zaten kullanılıyor." : error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="name" type="text" placeholder="Adınız Soyadınız" required 
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

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
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" type="password" placeholder="En az 6 karakter" required minLength={6}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold mt-4 shadow-lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                  <>Kayıt Ol <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground">
        Zaten hesabınız var mı? <Link href="/kullanici/giris" className="text-primary font-medium hover:underline">Giriş Yapın</Link>
      </p>
    </div>
  )
}