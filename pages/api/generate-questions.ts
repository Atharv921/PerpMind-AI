import type { NextApiRequest, NextApiResponse } from 'next'
import { generateQuestionsFromNotes } from '@/lib/anthropic'
import { canGenerateTest, incrementUsage } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { notes, questionCount = 10, userId } = req.body
  if (!notes || !userId) return res.status(400).json({ error: 'Missing required fields' })
  if (notes.length < 50) return res.status(400).json({ error: 'Notes too short. Add at least 50 characters.' })

  try {
    const { data: { user }, error: authErr } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (authErr || !user) return res.status(401).json({ error: 'Unauthorized' })

    const usageCheck = await canGenerateTest(userId)
    if (!usageCheck.allowed) {
      return res.status(429).json({
        error: `Daily limit reached. ${usageCheck.usageToday}/${usageCheck.limit} tests used today. Upgrade to Pro for unlimited tests.`,
        usageToday: usageCheck.usageToday,
        limit: usageCheck.limit,
      })
    }

    const maxQ       = usageCheck.isPro ? 20 : 10
    const finalCount = Math.min(Math.max(5, questionCount), maxQ)
    const questions  = await generateQuestionsFromNotes(notes, finalCount)
    if (!questions?.length) return res.status(500).json({ error: 'Failed to generate questions. Try again.' })

    await incrementUsage(userId)
    return res.status(200).json({ questions, count: questions.length })
  } catch (err: any) {
    console.error('[generate-questions]', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
