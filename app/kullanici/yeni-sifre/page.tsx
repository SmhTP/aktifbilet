"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MapPin, Loader2, Lock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function UpdatePassword() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Linkteki doğrulama token'ı ile geldiğini teyit ediyoruz
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        console.log("Şifre sıfırlama modu aktif")
      }
    })
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Şifreniz en az 6 karakter olmalıdır.")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      // 2 saniye sonra profil veya ana sayfaya yönlendir
      setTimeout(() => {
        router.push("/profil")
      }, 2000)
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
          <CardTitle className="text-2xl font-bold">Yeni Şifre Belirle</CardTitle>
          <CardDescription className="text-base">
            Lütfen hesabınız için yeni bir şifre girin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
             <div className="text-center space-y-4">
               <div className="bg-green-500/10 p-4 rounded-full inline-block">
                 <CheckCircle2 className="h-12 w-12 text-green-500" />
               </div>
               <h3 className="font-bold text-lg">Şifreniz Güncellendi!</h3>
               <p className="text-sm text-muted-foreground">Hesabınıza güvenle yönlendiriliyorsunuz...</p>
             </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-lg text-center border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Yeni Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" type="password" placeholder="En az 6 karakter" required 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold mt-4 shadow-lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Şifreyi Güncelle"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}