import type { NextApiRequest, NextApiResponse } from 'next'
import { analyzeTestResults } from '@/lib/anthropic'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { testId, userId, questions, answers, timeTaken } = req.body
  if (!testId || !userId || !questions || !answers) return res.status(400).json({ error: 'Missing required fields' })

  try {
    const { data: { user }, error: authErr } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (authErr || !user) return res.status(401).json({ error: 'Unauthorized' })

    const { data: test, error: testErr } = await supabaseAdmin
      .from('tests').select('*').eq('id', testId).eq('user_id', userId).single()
    if (testErr || !test) return res.status(404).json({ error: 'Test not found' })

    let score = 0
    for (const q of questions) { if (answers[q.id] === q.correct_answer) score++ }

    const analysis = await analyzeTestResults(questions, answers, score, questions.length)

    const { data: savedResult, error: saveErr } = await supabaseAdmin
      .from('test_results')
      .upsert({ test_id: testId, user_id: userId, answers, score, total_questions: questions.length, time_taken: timeTaken || 0, analysis })
      .select().single()
    if (saveErr) throw saveErr

    await supabaseAdmin.from('tests').update({ score, completed_at: new Date().toISOString() }).eq('id', testId)
    return res.status(200).json({ score, totalQuestions: questions.length, analysis, resultId: savedResult.id })
  } catch (err: any) {
    console.error('[analyze-results]', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
