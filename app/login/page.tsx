'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Logo  from '@/components/Logo'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createBrowserClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push(searchParams.get('redirect') || '/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-24 relative">
        <div className="orb w-80 h-80 bg-[#6366F1]/15 -top-10 -left-20" />
        <div className="orb w-64 h-64 bg-[#8B5CF6]/10 bottom-10 right-0" />
        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6 outline-none" aria-label="PrepMind AI">
              <Logo width={160} variant="full" />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily:'Sora,sans-serif' }}>Welcome back</h1>
            <p className="text-white/50 text-sm">Log in to continue your exam prep</p>
          </div>
          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠️ {error}</div>}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2" style={{ fontFamily:'Sora,sans-serif' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2" style={{ fontFamily:'Sora,sans-serif' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2">
                {loading ? <span className="inline-flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Logging in...</span> : '→ Log In'}
              </button>
            </form>
            <div className="relative my-6"><div className="h-px bg-white/8" /><span className="absolute inset-0 flex items-center justify-center"><span className="bg-[#111120] px-3 text-xs text-white/30">or</span></span></div>
            <p className="text-center text-sm text-white/50">Don't have an account?{' '}<Link href="/signup" className="text-[#6366F1] hover:text-[#818CF8] transition-colors font-medium">Sign up free</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
