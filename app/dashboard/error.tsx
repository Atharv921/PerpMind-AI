'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error('[Dashboard Error]', error) }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass rounded-2xl p-10 text-center max-w-md animate-slide-up">
        <div className="text-4xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Sora,sans-serif' }}>
          Dashboard failed to load
        </h2>
        <p className="text-white/50 text-sm mb-6">
          {error.message || 'Could not load your dashboard. Please try again.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary  px-6 py-2.5 text-sm">Retry</button>
          <Link   href="/"   className="btn-secondary px-6 py-2.5 text-sm">Go Home</Link>
        </div>
      </div>
    </div>
  )
}
