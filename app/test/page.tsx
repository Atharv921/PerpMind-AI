'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import Navbar       from '@/components/Navbar'
import QuestionCard from '@/components/QuestionCard'
import { PageLoader } from '@/components/Loader'

export default function TestPage() {
  const [test, setTest]             = useState<any>(null)
  const [idx, setIdx]               = useState(0)
  const [answers, setAnswers]       = useState<Record<string,string>>({})
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [elapsed, setElapsed]       = useState(0)
  const [showExpl, setShowExpl]     = useState(false)
  const [confirming, setConfirming] = useState(false)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createBrowserClient()

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) { router.push('/dashboard'); return }
    fetchTest(id)
  }, [])

  useEffect(() => {
    if (!test || submitting) return
    const t = setInterval(() => setElapsed(e => e+1), 1000)
    return () => clearInterval(t)
  }, [test, submitting])

  const fetchTest = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data, error } = await supabase.from('tests').select('*').eq('id', id).eq('user_id', user.id).single()
    if (error || !data) { router.push('/dashboard'); return }
    if (data.score !== null) { router.push(`/result?id=${id}`); return }
    setTest(data); setLoading(false)
  }

  const handleAnswer = (answer: string) => { setAnswers(prev => ({ ...prev, [test.questions[idx].id]: answer })); setShowExpl(true) }
  const handleNext   = () => { setShowExpl(false); if (idx < test.questions.length-1) setIdx(i => i+1); else setConfirming(true) }

  const handleSubmit = async () => {
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    try {
      const res = await fetch('/api/analyze-results', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ testId:test.id, userId:user.id, questions:test.questions, answers, timeTaken:elapsed }) })
      if (!res.ok) throw new Error('Analysis failed')
      router.push(`/result?id=${test.id}`)
    } catch { setSubmitting(false); alert('Failed to submit. Please try again.') }
  }

  const fmt = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`

  if (loading) return <PageLoader message="Loading your test..." />
  if (!test)   return null

  const qs       = test.questions
  const cq       = qs[idx]
  const answered = Object.keys(answers).length

  if (confirming) return (
    <div className="min-h-screen"><Navbar />
      <div className="page-container max-w-2xl">
        <div className="glass rounded-2xl p-10 text-center animate-slide-up">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily:'Sora,sans-serif' }}>Ready to Submit?</h2>
          <p className="text-white/55 mb-6">
            Answered <strong className="text-white">{answered}</strong> of <strong className="text-white">{qs.length}</strong>.
            {qs.length-answered > 0 && <span className="text-yellow-400"> ({qs.length-answered} unanswered)</span>}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { setConfirming(false); setIdx(qs.findIndex((q: any) => !answers[q.id]) ?? idx) }} className="btn-secondary">← Review</button>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
              {submitting ? <span className="inline-flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analysing...</span> : '🏁 Submit & Get Results'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen"><Navbar />
      <div className="page-container max-w-2xl">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="font-bold text-white text-lg truncate max-w-xs" style={{ fontFamily:'Sora,sans-serif' }}>{test.title}</h1>
            <p className="text-xs text-white/40 mt-0.5">{answered}/{qs.length} answered</p>
          </div>
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
            <span className="text-sm font-bold text-white" style={{ fontFamily:'JetBrains Mono,monospace' }}>{fmt(elapsed)}</span>
          </div>
        </div>
        <div className="progress-bar mb-8 animate-fade-in"><div className="progress-fill" style={{ width:`${(answered/qs.length)*100}%` }} /></div>

        <div key={idx} className="animate-slide-up">
          <QuestionCard question={cq} questionNumber={idx+1} totalQuestions={qs.length} onAnswer={handleAnswer} selectedAnswer={answers[cq.id]} showResult={showExpl} />
        </div>

        {answers[cq.id] ? (
          <div className="mt-6 flex items-center justify-between animate-slide-up">
            <button onClick={() => { setShowExpl(false); setIdx(i => Math.max(0,i-1)) }} disabled={idx===0} className="btn-secondary text-sm disabled:opacity-30">← Prev</button>
            <div className="flex items-center gap-2">
              {qs.map((_: any, i: number) => (
                <button key={i} onClick={() => { setShowExpl(false); setIdx(i) }}
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{ background: i===idx ? '#6366F1' : answers[qs[i].id] ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)', transform: i===idx ? 'scale(1.25)' : 'scale(1)' }} />
              ))}
            </div>
            <button onClick={handleNext} className="btn-primary text-sm">{idx===qs.length-1 ? '🏁 Finish' : 'Next →'}</button>
          </div>
        ) : (
          <div className="mt-4 text-center"><p className="text-sm text-white/30">Select an answer to continue</p></div>
        )}
      </div>
    </div>
  )
}
