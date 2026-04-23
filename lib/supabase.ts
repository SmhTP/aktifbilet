import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Kodun tarayıcıda (browser) mı yoksa sunucuda mı (server) çalıştığını kontrol ediyoruz
const isBrowser = typeof window !== 'undefined'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,     // Oturumu kalıcı yap
    autoRefreshToken: true,   // Süresi biten bileti otomatik yenile
    detectSessionInUrl: true,
    // Sadece tarayıcıdaysak localStorage kullan, değilse hata verme
    storage: isBrowser ? window.localStorage : undefined 
  }
})