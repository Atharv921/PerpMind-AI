'use client'
import { useState, useRef, useCallback } from 'react'

interface Props { onNotesChange: (n: string) => void; notes: string }

export default function UploadBox({ onNotesChange, notes }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [tab, setTab]           = useState<'paste'|'upload'>('paste')
  const fileRef                 = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type === 'text/plain') { const r = new FileReader(); r.onload = ev => onNotesChange(ev.target?.result as string); r.readAsText(f) }
  }, [onNotesChange])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { const r = new FileReader(); r.onload = ev => onNotesChange(ev.target?.result as string); r.readAsText(f) }
  }

  const words = notes.trim() ? notes.trim().split(/\s+/).length : 0

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 glass rounded-xl w-fit">
        {(['paste','upload'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === t ? { background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontFamily: 'Sora,sans-serif' } : { color: 'rgba(255,255,255,0.5)', fontFamily: 'Sora,sans-serif' }}>
            {t === 'paste' ? '✍️ Paste Notes' : '📁 Upload .txt'}
          </button>
        ))}
      </div>

      {tab === 'paste' ? (
        <div className="relative">
          <textarea value={notes} onChange={e => onNotesChange(e.target.value)} rows={14}
            placeholder="Paste your study notes here..." className="input-field resize-none" style={{ lineHeight: 1.7 }} />
          <div className="absolute bottom-3 right-3 text-xs text-white/30 flex gap-3" style={{ fontFamily: 'JetBrains Mono,monospace' }}>
            <span>{words} words</span><span>{notes.length} chars</span>
          </div>
        </div>
      ) : (
        <div onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onClick={() => fileRef.current?.click()}
          className={`glass rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all border-2 border-dashed ${dragOver ? 'border-[#6366F1]/60 bg-[#6366F1]/5' : 'border-white/10 hover:border-[#6366F1]/30'}`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${dragOver ? 'bg-[#6366F1]/20' : 'bg-white/5'}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dragOver ? '#6366F1' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="font-medium text-white/70" style={{ fontFamily: 'Sora,sans-serif' }}>{dragOver ? 'Drop it!' : 'Drop .txt file or click to browse'}</p>
          <input ref={fileRef} type="file" accept=".txt" onChange={handleFile} className="hidden" />
        </div>
      )}

      {tab === 'upload' && notes && (
        <div className="glass rounded-xl p-4">
          <p className="text-sm text-white/60 line-clamp-3" style={{ lineHeight: 1.7 }}>{notes}</p>
          <button onClick={() => onNotesChange('')} className="mt-2 text-xs text-red-400/70 hover:text-red-400 transition-colors">Clear ✕</button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {['Min 100 words recommended','Any subject works','More detail = better questions'].map(t => (
          <span key={t} className="tag tag-electric">{t}</span>
        ))}
      </div>
    </div>
  )
}
