'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { PageLoader } from '@/components/Loader'

function timeOfDay() {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
}

export default function DashboardPage() {
  const [data, setData]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createBrowserClient()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const today = new Date().toISOString().split('T')[0]
    const [testsRes, userRow, usageRes] = await Promise.all([
      supabase.from('tests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('users').select('is_pro,payment_provider,pro_activated_at').eq('id', user.id).single(),
      supabase.from('usage').select('tests_generated').eq('user_id', user.id).eq('date', today).single(),
    ])

    const tests = testsRes.data || []
    const done  = tests.filter((t: any) => t.score !== null)
    const avg   = done.length ? Math.round(done.reduce((a: number, t: any) => a + t.score/t.total_questions*100, 0) / done.length) : 0
    const best  = done.length ? Math.round(Math.max(...done.map((t: any) => t.score/t.total_questions*100))) : 0

    let isPro = userRow.data?.is_pro || false
    if (!isPro) {
      const { data: sub } = await supabase.from('subscriptions').select('plan,status').eq('user_id', user.id).single()
      isPro = sub?.plan === 'pro' && sub?.status === 'active'
    }

    setData({
      user, tests, isPro,
      paymentProvider: userRow.data?.payment_provider,
      proActivatedAt:  userRow.data?.pro_activated_at,
      usageToday: usageRes.data?.tests_generated || 0,
      stats: { totalTests: tests.length, avgScore: avg, bestScore: best, totalQuestions: tests.reduce((a: number, t: any) => a + (t.total_questions||0), 0) },
    })
    setLoading(false)
  }

  if (loading) return <PageLoader message="Loading your dashboard..." />

  const FREE_LIMIT = 2
  const usagePct   = data.isPro ? 100 : Math.min((data.usageToday / FREE_LIMIT) * 100, 100)

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-container">

        {searchParams.get('upgraded') && (
          <div className="mb-6 p-4 rounded-xl border border-[#6366F1]/30 flex items-center gap-3 animate-slide-up"
            style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))' }}>
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-white" style={{ fontFamily:'Sora,sans-serif' }}>Welcome to Pro!</p>
              <p className="text-sm text-white/60">Unlimited tests unlocked. Happy studying!</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily:'Sora,sans-serif' }}>
                Good {timeOfDay()}, {data.user?.user_metadata?.full_name?.split(' ')[0] || 'Student'} 👋
              </h1>
              {data.isPro && <span className="tag tag-electric font-bold">✨ PRO</span>}
            </div>
            <p className="text-white/50">Ready to study smarter today?</p>
          </div>
          <Link href="/upload" className="btn-primary">✨ New Test</Link>
        </div>

        {data.isPro ? (
          <div className="glass rounded-2xl p-5 mb-8 border border-[#6366F1]/25 animate-slide-up delay-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))' }}>✨</div>
                <div>
                  <p className="font-semibold text-white" style={{ fontFamily:'Sora,sans-serif' }}>Pro Plan Active</p>
                  <p className="text-xs text-white/40">
                    Unlimited tests · Paid via {data.paymentProvider === 'razorpay' ? 'Razorpay' : 'Stripe'}
                    {data.proActivatedAt && ` on ${new Date(data.proActivatedAt).toLocaleDateString('en-IN',{ day:'numeric',month:'short',year:'numeric' })}`}
                  </p>
                </div>
              </div>
              <span className="tag tag-success">Lifetime Access</span>
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl p-5 mb-8 border border-[#6366F1]/15 flex flex-col md:flex-row items-start md:items-center gap-4 animate-slide-up delay-100">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="tag tag-electric">Free Plan</span>
                <span className="text-sm text-white/50">{data.usageToday}/{FREE_LIMIT} tests today</span>
              </div>
              <div className="progress-bar max-w-xs"><div className="progress-fill" style={{ width:`${usagePct}%` }} /></div>
            </div>
            <Link href="/pricing" className="btn-primary text-sm py-2.5 flex-shrink-0">⚡ Upgrade — ₹199 one-time</Link>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up delay-200">
          {[['📋','Tests Taken',data.stats.totalTests],['📊','Avg Score',`${data.stats.avgScore}%`],['🏆','Best Score',`${data.stats.bestScore}%`],['❓','Questions',data.stats.totalQuestions]].map(([icon,label,val]) => (
            <div key={label as string} className="glass glass-hover rounded-2xl p-5">
              <span className="text-2xl block mb-2">{icon}</span>
              <p className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily:'Sora,sans-serif' }}>{val}</p>
              <p className="text-xs text-white/40">{label}</p>
            </div>
          ))}
        </div>

        <div className="animate-slide-up delay-300">
          <h2 className="text-xl font-bold text-white mb-5" style={{ fontFamily:'Sora,sans-serif' }}>Recent Tests</h2>
          {data.tests.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily:'Sora,sans-serif' }}>No tests yet</h3>
              <p className="text-white/50 mb-6">Generate your first test from your study notes.</p>
              <Link href="/upload" className="btn-primary">✨ Create First Test</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.tests.map((test: any) => {
                const done = test.score !== null
                const pct  = done ? Math.round(test.score / test.total_questions * 100) : null
                const col  = !pct ? '' : pct>=80 ? 'text-green-400' : pct>=60 ? 'text-yellow-400' : 'text-red-400'
                return (
                  <div key={test.id} className="glass glass-hover rounded-xl p-5 flex items-center gap-4 cursor-pointer"
                    onClick={() => router.push(done ? `/result?id=${test.id}` : `/test?id=${test.id}`)}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg" style={{ background:'rgba(99,102,241,0.15)' }}>
                      {done ? '✅' : '📝'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate" style={{ fontFamily:'Sora,sans-serif' }}>{test.title || 'Untitled Test'}</p>
                      <p className="text-xs text-white/40 mt-0.5">{test.total_questions} questions · {new Date(test.created_at).toLocaleDateString('en-IN',{ day:'numeric',month:'short',year:'numeric' })}</p>
                    </div>
                    {done ? <span className={`text-lg font-bold ${col}`} style={{ fontFamily:'Sora,sans-serif' }}>{pct}%</span>
                           : <span className="tag tag-aurora text-xs">Continue →</span>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
