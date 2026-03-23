import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'PrepMind AI — Smart Exam Prep', template: '%s | PrepMind AI' },
  description: 'Transform your study notes into AI-generated MCQs. Take tests, analyse performance, discover weak topics. Pay ₹199 once, study forever.',
  keywords:    ['exam prep', 'AI study', 'MCQ generator', 'PrepMind AI'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: { title: 'PrepMind AI — Smart Exam Prep', description: 'Transform your notes into AI-generated MCQs instantly.', type: 'website', siteName: 'PrepMind AI' },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg', apple: '/favicon.svg' },
  themeColor: '#6366F1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#6366F1" />
      </head>
      <body className="mesh-bg min-h-screen" suppressHydrationWarning>{children}</body>
    </html>
  )
}
