import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 — Page Not Found' }

export default function NotFound() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-6">
      <div className="text-center animate-slide-up">
        {/* Big 404 */}
        <p className="text-[8rem] font-black leading-none gradient-text select-none" style={{ fontFamily: 'Sora,sans-serif' }}>
          404
        </p>
        <h1 className="text-2xl font-bold text-white mt-2 mb-3" style={{ fontFamily: 'Sora,sans-serif' }}>
          Page not found
        </h1>
        <p className="text-white/50 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"         className="btn-primary  px-8 py-3">← Go Home</Link>
          <Link href="/dashboard" className="btn-secondary px-8 py-3">Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
