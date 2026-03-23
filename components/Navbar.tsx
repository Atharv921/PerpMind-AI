'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import Logo from '@/components/Logo'

export default function Navbar() {
  const [user, setUser]         = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const router   = useRouter()
  const pathname = usePathname()
  const supabase = createBrowserClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
    const { data: l } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => l.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const signOut  = async () => { await supabase.auth.signOut(); router.push('/') }
  const linkCls  = (p: string) => `text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] ${pathname === p ? 'text-white' : 'text-white/55 hover:text-white'}`

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#09090f]/90 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-[64px] flex items-center justify-between gap-4">

        <Link href="/" className="flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/60 rounded-lg" aria-label="PrepMind AI">
          <span className="hidden sm:block"><Logo width={152} variant="full" /></span>
          <span className="sm:hidden"><Logo width={34} variant="icon" /></span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {!user ? (
            <><Link href="/#features" className={linkCls('/#features')}>Features</Link><Link href="/pricing" className={linkCls('/pricing')}>Pricing</Link></>
          ) : (
            <><Link href="/dashboard" className={linkCls('/dashboard')}>Dashboard</Link><Link href="/upload" className={linkCls('/upload')}>New Test</Link></>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', fontFamily: 'Sora,sans-serif' }} title={user.email}>
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <button onClick={signOut} className="btn-secondary text-sm py-2 px-4">Sign Out</button>
            </div>
          ) : (
            <><Link href="/login"  className="btn-secondary text-sm py-2 px-4">Log In</Link><Link href="/signup" className="btn-primary text-sm py-2 px-4">Get Started</Link></>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors" aria-label="Toggle menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></> : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>}
          </svg>
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#0d0d1a]/97 backdrop-blur-xl border-t border-white/[0.06] px-5 pt-3 pb-5 flex flex-col gap-1">
          <div className="pb-3 mb-1 border-b border-white/[0.07]"><Logo width={132} variant="full" /></div>
          {user ? (
            <>
              <Link href="/dashboard" className="text-white/70 hover:text-white text-sm font-medium px-2 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link href="/upload"    className="text-white/70 hover:text-white text-sm font-medium px-2 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors" onClick={() => setOpen(false)}>New Test</Link>
              <div className="pt-2 mt-1 border-t border-white/[0.06]"><button onClick={signOut} className="btn-secondary text-sm w-full justify-center py-2.5">Sign Out</button></div>
            </>
          ) : (
            <>
              <Link href="/#features" className="text-white/70 hover:text-white text-sm font-medium px-2 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors" onClick={() => setOpen(false)}>Features</Link>
              <Link href="/pricing"   className="text-white/70 hover:text-white text-sm font-medium px-2 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors" onClick={() => setOpen(false)}>Pricing</Link>
              <div className="flex flex-col gap-2 pt-2 mt-1 border-t border-white/[0.06]">
                <Link href="/login"  className="btn-secondary text-sm justify-center py-2.5" onClick={() => setOpen(false)}>Log In</Link>
                <Link href="/signup" className="btn-primary  text-sm justify-center py-2.5" onClick={() => setOpen(false)}>Get Started Free</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
