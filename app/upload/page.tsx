'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import Navbar     from '@/components/Navbar'
import UploadBox  from '@/components/UploadBox'
import Loader     from '@/components/Loader'

export default function UploadPage() {
  const [notes, setNotes]                 = useState('')
  const [title, setTitle]                 = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [loading, setLoading]             = useState(false)
  const [stage, setStage]                 = useState<'idle'|'generating'|'saving'>('idle')
  const [error, setError]                 = useState('')
  const router   = useRouter()
  const supabase = createBrowserClient()

  const handleGenerate = async () => {
    if (!notes.trim() || notes.length < 50) { setError('Please add at least 50 characters of notes.'); return }
    setLoading(true); setError(''); setStage('generating')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const res  = await fetch('/api/generate-questions', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ notes, questionCount, userId:user.id }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to generate questions.'); setLoading(false); setStage('idle'); return }

      setStage('saving')
      const { data: test, error: saveErr } = await supabase.from('tests').insert({
        user_id: user.id,
        title: title.trim() || `Test — ${new Date().toLocaleDateString('en-IN')}`,
        notes_content: notes.slice(0, 5000),
        questions: data.questions,
        total_questions: data.questions.length,
      }).select().single()
      if (saveErr) throw saveErr
      router.push(`/test?id=${test.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
      setLoading(false); setStage('idle')
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-container">
        <div className="mb-10 animate-slide-up">
          <span className="tag tag-electric mb-4 inline-flex">Generate Test</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily:'Sora,sans-serif' }}>Paste Your Notes</h1>
          <p className="text-white/50 max-w-xl">AI will generate targeted exam questions instantly.</p>
        </div>

        {loading ? (
          <div className="glass rounded-2xl py-20 text-center animate-fade-in">
            <Loader size="lg" message={stage==='generating' ? '🧠 AI is analysing your notes...' : '💾 Saving your test...'} />
            <p className="text-white/30 text-sm mt-4">This usually takes 10–20 seconds</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 animate-slide-up delay-100">
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-start gap-3">
                  <span className="flex-shrink-0">⚠️</span>
                  <div>
                    <p>{error}</p>
                    {error.includes('Daily limit') && <Link href="/pricing" className="text-[#6366F1] hover:text-[#818CF8] font-medium mt-1 inline-block">Upgrade to Pro →</Link>}
                  </div>
                </div>
              )}
              <UploadBox notes={notes} onNotesChange={setNotes} />
            </div>

            <div className="space-y-5">
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-white mb-4" style={{ fontFamily:'Sora,sans-serif' }}>Test Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide" style={{ fontFamily:'Sora,sans-serif' }}>Title (optional)</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chapter 3 Biology" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-3 uppercase tracking-wide" style={{ fontFamily:'Sora,sans-serif' }}>Number of Questions</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[5,10,15].map(n => (
                        <button key={n} onClick={() => setQuestionCount(n)}
                          className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${questionCount===n ? 'text-white border-transparent' : 'border-white/10 text-white/50 hover:text-white'}`}
                          style={questionCount===n ? { background:'linear-gradient(135deg,#6366F1,#8B5CF6)', fontFamily:'Sora,sans-serif' } : { fontFamily:'Sora,sans-serif' }}>{n}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={handleGenerate} disabled={!notes.trim() || loading} className="btn-primary w-full justify-center py-4 text-base">🚀 Generate Test</button>
              <div className="glass rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide" style={{ fontFamily:'Sora,sans-serif' }}>How it works</h4>
                {['AI reads your notes','Generates smart MCQs','You take the test','Get analysed results'].map((step,i) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#6366F1]/20 text-[#818CF8] text-xs font-bold flex items-center justify-center" style={{ fontFamily:'JetBrains Mono,monospace' }}>{i+1}</span>
                    <span className="text-sm text-white/55">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
