'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Logo  from '@/components/Logo'

export default function SignupPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const router   = useRouter()
  const supabase = createBrowserClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return }
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user && !data.session) { setSuccess(true) }
    else if (data.session) { router.push('/dashboard') }
    setLoading(false)
  }

  if (success) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center animate-slide-up">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily:'Sora,sans-serif' }}>Check your inbox!</h1>
          <p className="text-white/55 mb-6">Confirmation sent to <span className="text-white font-medium">{email}</span></p>
          <Link href="/login" className="btn-secondary">Back to Login</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-24 relative">
        <div className="orb w-80 h-80 bg-[#8B5CF6]/15 -top-10 -right-20" />
        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6 outline-none" aria-label="PrepMind AI">
              <Logo width={160} variant="full" />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily:'Sora,sans-serif' }}>Create your PrepMind account</h1>
            <p className="text-white/50 text-sm">Your AI exam prep starts here, for free</p>
          </div>
          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSignup} className="space-y-5">
              {error && <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠️ {error}</div>}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2" style={{ fontFamily:'Sora,sans-serif' }}>Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2" style={{ fontFamily:'Sora,sans-serif' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2" style={{ fontFamily:'Sora,sans-serif' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8} className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2">
                {loading ? <span className="inline-flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span> : '🎓 Create Free Account'}
              </button>
            </form>
            <div className="relative my-6"><div className="h-px bg-white/8" /></div>
            <p className="text-center text-sm text-white/50">Already have an account?{' '}<Link href="/login" className="text-[#6366F1] hover:text-[#818CF8] transition-colors font-medium">Log in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
