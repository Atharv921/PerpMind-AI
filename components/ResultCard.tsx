'use client'
interface Analysis { overall_performance:string; score_percentage:number; strong_topics:string[]; weak_topics:string[]; recommendations:string[]; detailed_feedback:string }
interface Props { score:number; totalQuestions:number; timeTaken:number; analysis?:Analysis }

export default function ResultCard({ score, totalQuestions, timeTaken, analysis }: Props) {
  const pct = Math.round((score/totalQuestions)*100)
  const m   = Math.floor(timeTaken/60)
  const s   = timeTaken%60
  const grade = () => {
    if (pct>=90) return { g:'A+', label:'Outstanding',  color:'#22D3EE', emoji:'🏆' }
    if (pct>=80) return { g:'A',  label:'Excellent',    color:'#6366F1', emoji:'⭐' }
    if (pct>=70) return { g:'B',  label:'Good',         color:'#8B5CF6', emoji:'👍' }
    if (pct>=60) return { g:'C',  label:'Average',      color:'#f59e0b', emoji:'📚' }
    return             { g:'D',  label:'Needs Work',   color:'#ef4444', emoji:'💪' }
  }
  const gr = grade()
  const R  = 54, C = 2*Math.PI*R, offset = C-(pct/100)*C

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative flex-shrink-0">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
              <circle cx="70" cy="70" r={R} fill="none" stroke={gr.color} strokeWidth="10"
                strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round"
                transform="rotate(-90 70 70)" style={{ transition:'stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)' }}/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ fontFamily:'Sora,sans-serif', color:gr.color }}>{pct}%</span>
              <span className="text-xs text-white/40">{score}/{totalQuestions}</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
              <span className="text-4xl">{gr.emoji}</span>
              <div><p className="text-2xl font-bold" style={{ fontFamily:'Sora,sans-serif', color:gr.color }}>Grade {gr.g}</p><p className="text-white/50 text-sm">{gr.label}</p></div>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">{analysis?.overall_performance || `You answered ${score} of ${totalQuestions} correctly.`}</p>
            <div className="flex gap-4 justify-center md:justify-start">
              {[['Correct',score],['Wrong',totalQuestions-score],['Time',`${m}:${s.toString().padStart(2,'0')}`]].map(([l,v],i,arr) => (
                <div key={l as string} className="flex items-center gap-4">
                  <div className="text-center"><p className="text-lg font-bold text-white" style={{ fontFamily:'Sora,sans-serif' }}>{v}</p><p className="text-xs text-white/40">{l}</p></div>
                  {i < arr.length-1 && <div className="w-px h-8 bg-white/10"/>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {analysis && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {analysis.strong_topics?.length>0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2" style={{ fontFamily:'Sora,sans-serif' }}>✅ Strong Topics</h3>
                <div className="flex flex-wrap gap-2">{analysis.strong_topics.map(t=><span key={t} className="tag tag-success">{t}</span>)}</div>
              </div>
            )}
            {analysis.weak_topics?.length>0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2" style={{ fontFamily:'Sora,sans-serif' }}>⚠️ Needs Review</h3>
                <div className="flex flex-wrap gap-2">{analysis.weak_topics.map(t=><span key={t} className="tag tag-danger">{t}</span>)}</div>
              </div>
            )}
          </div>
          {analysis.recommendations?.length>0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily:'Sora,sans-serif' }}>🎯 Study Recommendations</h3>
              <div className="space-y-3">{analysis.recommendations.map((rec,i)=>(
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6366F1]/20 text-[#818CF8] text-xs font-bold flex items-center justify-center mt-0.5" style={{ fontFamily:'JetBrains Mono,monospace' }}>{i+1}</span>
                  <p className="text-sm text-white/70 leading-relaxed">{rec}</p>
                </div>
              ))}</div>
            </div>
          )}
          {analysis.detailed_feedback && (
            <div className="glass rounded-2xl p-6 border border-[#6366F1]/20">
              <h3 className="font-semibold text-[#818CF8] mb-2 flex items-center gap-2" style={{ fontFamily:'Sora,sans-serif' }}>🤖 AI Feedback</h3>
              <p className="text-white/70 leading-relaxed">{analysis.detailed_feedback}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
