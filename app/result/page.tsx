'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import Navbar     from '@/components/Navbar'
import ResultCard from '@/components/ResultCard'
import { PageLoader } from '@/components/Loader'

export default function ResultPage() {
  const [test, setTest]       = useState<any>(null)
  const [result, setResult]   = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createBrowserClient()

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) { router.push('/dashboard'); return }
    fetchResult(id)
  }, [])

  const fetchResult = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const [testRes, resultRes] = await Promise.all([
      supabase.from('tests').select('*').eq('id', id).eq('user_id', user.id).single(),
      supabase.from('test_results').select('*').eq('test_id', id).eq('user_id', user.id).single(),
    ])
    if (testRes.error || !testRes.data) { router.push('/dashboard'); return }
    setTest(testRes.data); setResult(resultRes.data); setLoading(false)
  }

  if (loading) return <PageLoader message="Loading your results..." />
  if (!test)   return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-container max-w-3xl">
        <div className="mb-8 animate-slide-up">
          <span className="tag tag-neon mb-3 inline-flex">Test Complete</span>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily:'Sora,sans-serif' }}>{test.title || 'Test Results'}</h1>
          <p className="text-white/50 text-sm">Completed on {new Date(test.completed_at || test.created_at).toLocaleDateString('en-IN',{ day:'numeric',month:'long',year:'numeric' })}</p>
        </div>

        <div className="animate-slide-up delay-100">
          <ResultCard score={test.score||0} totalQuestions={test.total_questions||0} timeTaken={result?.time_taken||0} analysis={result?.analysis} />
        </div>

        {result?.answers && test.questions?.length>0 && (
          <div className="mt-8 animate-slide-up delay-200">
            <h2 className="text-xl font-bold text-white mb-5" style={{ fontFamily:'Sora,sans-serif' }}>Question Review</h2>
            <div className="space-y-4">
              {test.questions.map((q: any, i: number) => {
                const ua = result.answers[q.id]
                const ok = ua === q.correct_answer
                return (
                  <div key={q.id} className={`glass rounded-xl p-5 border ${ok ? 'border-green-400/15' : 'border-red-400/15'}`}>
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${ok ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                        {ok ? '✓' : '✗'}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white mb-2" style={{ fontFamily:'Sora,sans-serif' }}>Q{i+1}. {q.question}</p>
                        {!ok && <div className="space-y-1 mb-2"><p className="text-xs text-red-400">Your answer: {ua || 'Not answered'}</p><p className="text-xs text-green-400">Correct: {q.correct_answer}</p></div>}
                        {q.explanation && <p className="text-xs text-white/40 leading-relaxed">💡 {q.explanation}</p>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-slide-up delay-300">
          <Link href="/upload"    className="btn-primary  flex-1 justify-center py-4">✨ New Test</Link>
          <Link href="/dashboard" className="btn-secondary flex-1 justify-center py-4">← Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
