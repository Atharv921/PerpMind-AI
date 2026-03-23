import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY! })

export interface GeneratedQuestion {
  id: string; question: string; options: string[]
  correct_answer: string; topic: string
  difficulty: 'easy' | 'medium' | 'hard'; explanation: string
}

export interface AnalysisResult {
  overall_performance: string; score_percentage: number
  strong_topics: string[]; weak_topics: string[]
  recommendations: string[]; detailed_feedback: string
}

export async function generateQuestionsFromNotes(notes: string, count = 10): Promise<GeneratedQuestion[]> {
  const prompt = `You are an expert exam question generator. Analyze these study notes and generate ${count} high-quality multiple-choice questions.

NOTES:
${notes.slice(0, 4000)}

Generate exactly ${count} questions. Return ONLY a valid JSON array:
[
  {
    "id": "q1",
    "question": "Question text?",
    "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correct_answer": "A) Option 1",
    "topic": "Topic name",
    "difficulty": "medium",
    "explanation": "Brief explanation"
  }
]
Rules: 30% easy, 50% medium, 20% hard. Return ONLY the JSON array.`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5', max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })
  const text  = response.content[0].type === 'text' ? response.content[0].text : ''
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Failed to parse generated questions')
  return JSON.parse(match[0])
}

export async function analyzeTestResults(
  questions: GeneratedQuestion[], userAnswers: Record<string, string>,
  score: number, totalQuestions: number
): Promise<AnalysisResult> {
  const pct          = Math.round((score / totalQuestions) * 100)
  const wrongTopics  = questions.filter(q => userAnswers[q.id] !== q.correct_answer).map(q => q.topic)
  const correctTopics = questions.filter(q => userAnswers[q.id] === q.correct_answer).map(q => q.topic)

  const prompt = `Analyze this student's exam result.
Score: ${score}/${totalQuestions} (${pct}%)
Wrong topics: ${wrongTopics.join(', ')}
Correct topics: ${correctTopics.join(', ')}

Return ONLY valid JSON:
{
  "overall_performance": "One encouraging sentence",
  "score_percentage": ${pct},
  "strong_topics": ["topic1"],
  "weak_topics": ["topic1"],
  "recommendations": ["Tip 1", "Tip 2", "Tip 3"],
  "detailed_feedback": "2-3 sentences of actionable feedback"
}`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5', max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })
  const text  = response.content[0].type === 'text' ? response.content[0].text : ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Failed to parse analysis')
  try { return JSON.parse(match[0]) } catch {
    return {
      overall_performance: pct >= 70 ? 'Good performance! Keep studying.' : "Keep practising — you'll improve!",
      score_percentage: pct,
      strong_topics:  [...new Set(correctTopics)].slice(0, 3),
      weak_topics:    [...new Set(wrongTopics)].slice(0, 3),
      recommendations: ['Review weak topics', 'Focus on concepts not memorisation', 'Retake a test to track progress'],
      detailed_feedback: `You scored ${pct}%. Focus on your weak areas and keep practising.`,
    }
  }
}

export default anthropic
