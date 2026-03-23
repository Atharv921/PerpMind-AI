import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Logo  from '@/components/Logo'

export const metadata: Metadata = {
  title: 'PrepMind AI — Smart Exam Prep',
  description: 'Turn your study notes into AI-powered MCQs, take timed tests, and discover exactly what to study next.',
}

export default function HomePage() {
  const features = [
    { icon: '📝', title: 'Paste Your Notes',     desc: 'Paste or upload any subject notes. AI understands the content instantly.',                         tag: 'Step 1', col: 'electric' },
    { icon: '🧠', title: 'AI Generates MCQs',    desc: 'Claude creates targeted multiple-choice questions at varied difficulty levels.',                     tag: 'Step 2', col: 'aurora'   },
    { icon: '✍️', title: 'Take a Timed Test',    desc: 'Attempt your personalised test in a focused, distraction-free interface.',                          tag: 'Step 3', col: 'neon'     },
    { icon: '📊', title: 'Analyse & Improve',    desc: 'See your score, weak topics, and personalised AI study recommendations.',                            tag: 'Step 4', col: 'electric' },
  ]

  const testimonials = [
    { name: 'Priya S.',  role: 'Medical Student',    text: 'PrepMind turned my 50-page anatomy notes into 20 perfect MCQs in seconds. My scores went up 30%.', initials: 'P' },
    { name: 'Rahul M.',  role: 'Engineering Student', text: 'The weak topic analysis is incredible. It showed me exactly what to study before my DSA exam.',    initials: 'R' },
    { name: 'Ananya K.', role: 'CA Aspirant',        text: 'Worth every rupee. One-time ₹199 and I get unlimited tests. My retention has improved massively.',  initials: 'A' },
  ]

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 pb-24 px-6">
        <div className="orb w-[480px] h-[480px] bg-[#6366F1]/18 top-10 -left-40" style={{ animationDelay:'0s' }} />
        <div className="orb w-[360px] h-[360px] bg-[#8B5CF6]/14 bottom-16 -right-24" style={{ animationDelay:'3s' }} />
        <div className="orb w-[280px] h-[280px] bg-[#22D3EE]/08 top-1/3 right-1/4"  style={{ animationDelay:'5s' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Hero logo */}
          <div className="flex justify-center mb-10 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 -m-4 rounded-full" style={{ background:'radial-gradient(ellipse at center,rgba(99,102,241,0.22) 0%,transparent 70%)', filter:'blur(16px)' }} />
              <Logo width={72} variant="icon" className="relative z-10" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#6366F1]/30 mb-7 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
            <span className="text-sm text-white/70">Powered by Claude AI · ₹199 one-time · No subscription</span>
          </div>

          <h1 className="section-title text-white mb-6 animate-slide-up delay-100"
            style={{ fontSize:'clamp(2.6rem,7vw,5.2rem)', letterSpacing:'-0.03em', lineHeight:1.06 }}>
            Turn Your Notes Into<br />
            <span className="gradient-text">Smart Exam Questions</span>
          </h1>

          <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-200">
            Paste your study notes. Get AI-generated MCQs instantly. Take tests, analyse your performance,
            and discover exactly what to study next.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-slide-up delay-300">
            <Link href="/signup"  className="btn-primary text-lg px-9 py-4">🚀 Start for Free</Link>
            <Link href="/pricing" className="btn-secondary text-lg px-9 py-4">See Pricing →</Link>
          </div>
          <p className="text-sm text-white/35 mb-16 animate-fade-in delay-400">Trusted by 10,000+ students · No credit card required</p>

          {/* App preview */}
          <div className="relative mx-auto max-w-3xl animate-slide-up delay-400">
            <div className="absolute -inset-px rounded-2xl" style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.4),rgba(139,92,246,0.3),rgba(34,211,238,0.25))', filter:'blur(1px)', zIndex:0 }} />
            <div className="relative glass rounded-2xl p-1 z-10">
              <div className="bg-[#111120] rounded-xl p-6 text-left">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-red-400/60" /><div className="w-3 h-3 rounded-full bg-yellow-400/60" /><div className="w-3 h-3 rounded-full bg-green-400/60" />
                  <div className="flex-1 mx-4 h-6 rounded-lg bg-white/[0.05] flex items-center px-3">
                    <span className="text-xs text-white/20" style={{ fontFamily:'monospace' }}>prepmind.app/test</span>
                  </div>
                  <Logo width={20} variant="icon" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="tag tag-electric">Cell Biology</span>
                  <span className="tag tag-aurora">Medium</span>
                </div>
                <div className="progress-bar mb-4"><div className="progress-fill" style={{ width:'40%' }} /></div>
                <p className="text-white/85 font-medium mb-4 text-sm leading-relaxed" style={{ fontFamily:'Sora,sans-serif' }}>
                  During which phase of the cell cycle does DNA replication occur?
                </p>
                <div className="space-y-2">
                  {['G1 Phase','S Phase ✓','G2 Phase','M Phase'].map((opt,i) => (
                    <div key={opt} className={`flex items-center gap-3 p-3 rounded-lg text-sm border ${i===1 ? 'border-[#6366F1]/40 bg-[#6366F1]/08 text-[#a5b4fc]' : 'border-white/[0.05] text-white/40'}`}>
                      <span className="w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center text-xs" style={{ fontFamily:'monospace' }}>{['A','B','C','D'][i]}</span>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-[#6366F1]/25 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[['10x','Faster prep'],['95%','Improve scores'],['20+','Subjects'],['₹199','One-time only']].map(([v,l]) => (
            <div key={l} className="text-center">
              <p className="text-4xl font-bold gradient-text mb-1" style={{ fontFamily:'Sora,sans-serif' }}>{v}</p>
              <p className="text-sm text-white/40">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="tag tag-electric mb-4 inline-flex">How It Works</span>
            <h2 className="section-title text-white mb-4">From Notes to Mastery<br /><span className="gradient-text">in 4 Steps</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f,i) => (
              <div key={f.title} className="glass glass-hover rounded-2xl p-8 relative overflow-hidden">
                <span className="absolute top-6 right-6 text-7xl font-black text-white/[0.03] select-none" style={{ fontFamily:'Sora,sans-serif', lineHeight:1 }}>{i+1}</span>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 flex items-center justify-center text-3xl mb-5 border border-white/[0.08]">{f.icon}</div>
                  <span className={`tag tag-${f.col} mb-3 inline-flex`}>{f.tag}</span>
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily:'Sora,sans-serif' }}>{f.title}</h3>
                  <p className="text-white/55 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title text-white mb-3">Students <span className="gradient-text">Love It</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="glass glass-hover rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background:'linear-gradient(135deg,#6366F1,#8B5CF6)', fontFamily:'Sora,sans-serif' }}>{t.initials}</div>
                  <div>
                    <p className="font-semibold text-white text-sm" style={{ fontFamily:'Sora,sans-serif' }}>{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
                <p className="text-white/65 text-sm leading-relaxed">"{t.text}"</p>
                <div className="flex gap-0.5 mt-4">
                  {[...Array(5)].map((_,i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#6366F1" opacity={1-i*0.06}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden border border-[#6366F1]/20">
            <div className="orb w-64 h-64 bg-[#6366F1]/18 -top-10 -left-10" />
            <div className="orb w-48 h-48 bg-[#8B5CF6]/14 -bottom-8 -right-8" />
            <div className="relative z-10">
              <div className="flex justify-center mb-6"><Logo width={48} variant="icon" /></div>
              <h2 className="section-title text-white mb-4">Ready to Study<br /><span className="gradient-text">Smarter?</span></h2>
              <p className="text-white/55 mb-4 max-w-md mx-auto">Start free. Upgrade for ₹199 — one-time, no subscription ever.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup"  className="btn-primary  text-lg px-10 py-4">🎓 Create Free Account</Link>
                <Link href="/pricing" className="btn-secondary text-lg px-10 py-4">View Pricing</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
