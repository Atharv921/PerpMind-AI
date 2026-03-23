'use client'
import { useState } from 'react'

interface Q { id:string; question:string; options:string[]; correct_answer:string; topic?:string; difficulty?:string; explanation?:string }
interface Props { question:Q; questionNumber:number; totalQuestions:number; onAnswer:(a:string)=>void; selectedAnswer?:string; showResult?:boolean }

export default function QuestionCard({ question:q, questionNumber, totalQuestions, onAnswer, selectedAnswer, showResult=false }: Props) {
  const [hovered, setHovered] = useState<string|null>(null)

  const optStyle = (o: string) => {
    if (!selectedAnswer) return hovered===o ? 'border-[#6366F1]/50 bg-[#6366F1]/10 scale-[1.01]' : 'border-white/8 hover:border-white/20 hover:bg-white/[0.03]'
    if (!showResult) return selectedAnswer===o ? 'border-[#6366F1]/60 bg-[#6366F1]/15' : 'border-white/8 opacity-60'
    if (o===q.correct_answer) return 'border-green-400/60 bg-green-400/10'
    if (o===selectedAnswer) return 'border-red-400/60 bg-red-400/10'
    return 'border-white/5 opacity-40'
  }
  const optIcon = (o: string) => {
    if (!showResult || !selectedAnswer) return null
    if (o===q.correct_answer) return '✓'
    if (o===selectedAnswer && o!==q.correct_answer) return '✗'
    return null
  }

  const diffMap: Record<string,{label:string;cls:string}> = {
    easy:   { label:'Easy',   cls:'tag-success' },
    medium: { label:'Medium', cls:'tag-aurora'  },
    hard:   { label:'Hard',   cls:'tag-danger'  },
  }
  const diff = diffMap[q.difficulty as string] || diffMap.medium

  return (
    <div className="glass rounded-2xl p-6 md:p-8 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40" style={{ fontFamily:'JetBrains Mono,monospace' }}>Q{questionNumber}/{totalQuestions}</span>
          {q.topic && <span className="tag tag-electric">{q.topic}</span>}
        </div>
        <span className={`tag ${diff.cls}`}>{diff.label}</span>
      </div>
      <div className="progress-bar mb-6"><div className="progress-fill" style={{ width:`${(questionNumber/totalQuestions)*100}%` }} /></div>
      <h3 className="text-lg md:text-xl font-semibold text-white/90 mb-6 leading-relaxed" style={{ fontFamily:'Sora,sans-serif' }}>{q.question}</h3>
      <div className="space-y-3">
        {q.options.map(o => {
          const icon = optIcon(o)
          return (
            <button key={o} onClick={() => !selectedAnswer && onAnswer(o)}
              onMouseEnter={() => !selectedAnswer && setHovered(o)} onMouseLeave={() => setHovered(null)}
              disabled={!!selectedAnswer}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${optStyle(o)}`}>
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                selectedAnswer===o&&!showResult ? 'bg-[#6366F1] text-white' :
                icon==='✓' ? 'bg-green-400/20 text-green-400' :
                icon==='✗' ? 'bg-red-400/20 text-red-400' : 'bg-white/5 text-white/40'
              }`} style={{ fontFamily:'JetBrains Mono,monospace' }}>
                {icon || o.charAt(0)}
              </span>
              <span className="text-sm md:text-base text-white/80">{o.slice(3)}</span>
            </button>
          )
        })}
      </div>
      {showResult && q.explanation && (
        <div className="mt-6 p-4 rounded-xl bg-[#22D3EE]/5 border border-[#22D3EE]/20">
          <p className="text-xs font-semibold text-[#67e8f9] mb-1.5" style={{ fontFamily:'Sora,sans-serif' }}>💡 EXPLANATION</p>
          <p className="text-sm text-white/70 leading-relaxed">{q.explanation}</p>
        </div>
      )}
    </div>
  )
}
