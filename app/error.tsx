'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error('[PrepMind Error]', error) }, [error])

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-6">
      <div className="text-center animate-slide-up max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Sora,sans-serif' }}>
          Something went wrong
        </h1>
        <p className="text-white/50 mb-2">
          {error.message || 'An unexpected error occurred.'}
        </p>
        {error.digest && (
          <p className="text-white/25 text-xs mb-6 font-mono">Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary  px-8 py-3">Try Again</button>
          <Link   href="/"   className="btn-secondary px-8 py-3">Go Home</Link>
        </div>
      </div>
    </div>
  )
}
