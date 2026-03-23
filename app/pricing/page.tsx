'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import Navbar         from '@/components/Navbar'
import Footer         from '@/components/Footer'
import UpgradeButton  from '@/components/UpgradeButton'

export default function PricingPage() {
  const [user, setUser]         = useState<any>(null)
  const [isPro, setIsPro]       = useState(false)
  const [upgraded, setUpgraded] = useState(false)
  const [payError, setPayError] = useState('')
  const router   = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => { fetchStatus() }, [])

  const fetchStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (!user) return
    const { data } = await supabase.from('users').select('is_pro').eq('id', user.id).single()
    setIsPro(!!data?.is_pro)
  }

  const handleSuccess = () => { setUpgraded(true); setIsPro(true); setTimeout(() => router.push('/dashboard?upgraded=true'), 2200) }

  if (upgraded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-slide-up">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily:'Sora,sans-serif' }}>You're now <span className="gradient-text">Pro!</span></h1>
        <p className="text-white/60 mb-8">Redirecting to your dashboard...</p>
        <div className="w-8 h-8 border-2 border-white/30 border-t-[#6366F1] rounded-full animate-spin mx-auto" />
      </div>
    </div>
  )

  const faq = [
    { q: 'Is this a subscription?', a: '₹199 is a one-time payment. You get Pro access forever with no recurring charges.' },
    { q: 'What payment methods are accepted?', a: 'All major credit/debit cards, UPI, NetBanking, and Wallets — all via Razorpay.' },
    { q: 'Can I get a refund?', a: "Yes, within 7 days if you've generated fewer than 5 tests. Contact support." },
    { q: 'What subjects does it support?', a: 'Any subject — science, math, history, law, medicine, engineering. Any text-based notes work.' },
    { q: 'Is my data safe?', a: 'Yes. Notes are processed by Claude AI. Payments go through Razorpay — we never see your card details.' },
  ]

  const proFeatures = ['Unlimited tests per day','Up to 20 questions per test','Advanced AI analysis','Weak topic identification','Personalised study recommendations','Detailed question explanations','Full test history','Priority support']
  const freeFeatures = ['2 tests per day','Up to 10 questions per test','Performance score','Score tracking']
  const notFree = ['AI recommendations','Detailed explanations']

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="relative pt-28 pb-24 px-6">
        <div className="orb w-80 h-80 bg-[#6366F1]/15 top-0 left-0" />
        <div className="orb w-72 h-72 bg-[#8B5CF6]/12 bottom-0 right-0" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <span className="tag tag-electric mb-4 inline-flex">Pricing</span>
            <h1 className="section-title text-white mb-4">One payment. <span className="gradient-text">Unlimited prep.</span></h1>
            <p className="text-white/55 max-w-lg mx-auto">No subscriptions. No monthly fees. Pay once, study forever.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12 animate-slide-up delay-100">
            {/* FREE */}
            <div className="glass rounded-2xl p-8 border border-white/8 flex flex-col">
              <p className="text-xs font-semibold tracking-widest text-white/40 mb-2 uppercase" style={{ fontFamily:'Sora,sans-serif' }}>Free</p>
              <div className="flex items-end gap-2 mb-1"><span className="text-4xl font-bold text-white" style={{ fontFamily:'Sora,sans-serif' }}>₹0</span><span className="text-white/40 text-sm mb-1.5">/forever</span></div>
              <p className="text-sm text-white/50 mb-6">Perfect to get started</p>
              <div className="flex-1 space-y-3 mb-8">
                {freeFeatures.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/></svg></div>
                    <span className="text-sm text-white/70">{f}</span>
                  </div>
                ))}
                {notFree.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 9l6-6M9 9L3 3" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"/></svg></div>
                    <span className="text-sm text-white/30 line-through">{f}</span>
                  </div>
                ))}
              </div>
              <div className="text-center py-3 rounded-xl bg-white/5 border border-white/10"><span className="text-sm text-white/40">Free Forever</span></div>
            </div>

            {/* PRO */}
            <div className="relative glass rounded-2xl p-8 border-2 border-[#6366F1]/40 flex flex-col" style={{ boxShadow:'0 0 40px rgba(99,102,241,0.2)' }}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="text-white text-xs font-bold px-4 py-1.5 rounded-full" style={{ background:'linear-gradient(135deg,#6366F1,#8B5CF6)', fontFamily:'Sora,sans-serif' }}>✨ ONE-TIME PAYMENT</span>
              </div>
              <p className="text-xs font-semibold tracking-widest text-[#818CF8] mb-2 uppercase" style={{ fontFamily:'Sora,sans-serif' }}>Pro</p>
              <div className="flex items-end gap-2 mb-1"><span className="text-4xl font-bold gradient-text" style={{ fontFamily:'Sora,sans-serif' }}>₹199</span><span className="text-white/40 text-sm mb-1.5">one-time</span></div>
              <p className="text-sm text-white/50 mb-6">Unlock everything, forever</p>
              <div className="flex-1 space-y-3 mb-8">
                {proFeatures.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#6366F1]/20 flex items-center justify-center flex-shrink-0"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/></svg></div>
                    <span className="text-sm text-white/70">{f}</span>
                  </div>
                ))}
              </div>
              {isPro ? (
                <div className="text-center py-3.5 rounded-xl border border-green-400/30 bg-green-400/10">
                  <span className="text-sm font-semibold text-green-400" style={{ fontFamily:'Sora,sans-serif' }}>✓ Pro Unlocked — Lifetime</span>
                </div>
              ) : !user ? (
                <button onClick={() => router.push('/signup')} className="btn-primary w-full justify-center py-3.5">🎓 Sign Up to Upgrade</button>
              ) : (
                <>
                  <UpgradeButton userId={user.id} userEmail={user.email} userName={user.user_metadata?.full_name} onSuccess={handleSuccess} onError={setPayError} />
                  {payError && <p className="text-xs text-red-400 text-center mt-2">⚠️ {payError}</p>}
                </>
              )}
              <p className="text-xs text-white/30 text-center mt-3">Secured by Razorpay · UPI, Cards, NetBanking</p>
            </div>
          </div>

          {/* Trust */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 text-sm text-white/40">
            {['🔒 Secured by Razorpay','🎯 One-time payment','♾️ Lifetime access','📱 UPI & Cards accepted'].map(b => <span key={b}>{b}</span>)}
          </div>

          {/* Comparison */}
          <div className="glass rounded-2xl overflow-hidden mb-16">
            <div className="p-6 border-b border-white/8"><h2 className="font-bold text-white text-xl text-center" style={{ fontFamily:'Sora,sans-serif' }}>Full Comparison</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-white/5">
                  <th className="text-left p-4 text-white/40 text-sm font-medium" style={{ fontFamily:'Sora,sans-serif' }}>Feature</th>
                  <th className="p-4 text-white/40 text-sm font-medium text-center">Free</th>
                  <th className="p-4 text-[#6366F1] text-sm font-medium text-center">Pro</th>
                </tr></thead>
                <tbody>
                  {[['Daily test limit','2/day','Unlimited'],['Questions per test','Up to 10','Up to 20'],['AI question generation','✓','✓'],['Performance score','✓','✓'],['Weak topic analysis','—','✓'],['AI recommendations','—','✓'],['Detailed explanations','—','✓'],['Payment','Free forever','₹199 one-time']].map(([f,fr,pr]) => (
                    <tr key={f} className="border-b border-white/4 hover:bg-white/[0.02]">
                      <td className="p-4 text-sm text-white/70">{f}</td>
                      <td className="p-4 text-center text-sm text-white/40">{fr}</td>
                      <td className="p-4 text-center text-sm text-[#6366F1] font-medium">{pr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily:'Sora,sans-serif' }}>FAQ</h2>
            <div className="space-y-4">
              {faq.map(item => (
                <div key={item.q} className="glass rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-2" style={{ fontFamily:'Sora,sans-serif' }}>{item.q}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
