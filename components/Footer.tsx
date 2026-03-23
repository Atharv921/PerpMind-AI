import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-24 py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Logo width={148} variant="full" showTagline />
            <p className="text-xs text-white/30 max-w-[220px] text-center md:text-left leading-relaxed">
              AI-powered exam prep. Turn notes into tests, master your weak spots.
            </p>
          </div>
          <div className="flex items-center gap-8 text-sm text-white/40">
            <Link href="/pricing" className="hover:text-white/70 transition-colors">Pricing</Link>
            <Link href="/login"   className="hover:text-white/70 transition-colors">Login</Link>
            <Link href="/signup"  className="hover:text-white/70 transition-colors">Sign Up</Link>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-white/25">© {new Date().getFullYear()} PrepMind AI</p>
            <p className="text-xs text-white/20 mt-1">Powered by Claude AI</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
