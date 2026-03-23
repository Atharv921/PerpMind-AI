interface LogoProps {
  width?: number
  variant?: 'full' | 'icon' | 'wordmark'
  showTagline?: boolean
  className?: string
}

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <defs>
        <linearGradient id="pm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#6366F1" />
          <stop offset="55%"  stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <radialGradient id="pm-glow" cx="35%" cy="25%" r="60%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#pm-bg)" />
      <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#pm-glow)" />
      <g stroke="white" strokeLinecap="round" opacity="0.28">
        <line x1="21.8" y1="10.2" x2="27.5" y2="13.5" strokeWidth="1" />
        <line x1="29"   y1="16"   x2="29"   y2="24"   strokeWidth="1" />
        <line x1="27.5" y1="26.5" x2="21.8" y2="29.8" strokeWidth="1" />
        <line x1="18.2" y1="29.8" x2="12.5" y2="26.5" strokeWidth="1" />
        <line x1="11"   y1="24"   x2="11"   y2="16"   strokeWidth="1" />
        <line x1="12.5" y1="13.5" x2="18.2" y2="10.2" strokeWidth="1" />
      </g>
      <g stroke="white" strokeLinecap="round" opacity="0.65">
        <line x1="20"   y1="17.2" x2="20"   y2="11.5" strokeWidth="1.5" />
        <line x1="22.5" y1="18.6" x2="27.2" y2="15.7" strokeWidth="1.5" />
        <line x1="22.5" y1="21.4" x2="27.2" y2="24.3" strokeWidth="1.5" />
        <line x1="20"   y1="22.8" x2="20"   y2="28.5" strokeWidth="1.5" />
        <line x1="17.5" y1="21.4" x2="12.8" y2="24.3" strokeWidth="1.5" />
        <line x1="17.5" y1="18.6" x2="12.8" y2="15.7" strokeWidth="1.5" />
      </g>
      <g fill="white">
        <circle cx="20" cy="9.5"  r="2.2" opacity="0.88" />
        <circle cx="29" cy="14.5" r="2"   opacity="0.82" />
        <circle cx="29" cy="25.5" r="2"   opacity="0.78" />
        <circle cx="20" cy="30.5" r="2.2" opacity="0.75" />
        <circle cx="11" cy="25.5" r="2"   opacity="0.78" />
        <circle cx="11" cy="14.5" r="2"   opacity="0.82" />
      </g>
      <circle cx="20" cy="20" r="3.4" fill="white" />
      <circle cx="20" cy="20" r="5.5" fill="none" stroke="white" strokeWidth="0.8" opacity="0.25" />
    </svg>
  )
}

export default function Logo({ width = 160, variant = 'full', showTagline = false, className = '' }: LogoProps) {
  const iconSize = variant === 'full' ? Math.round(width * 0.225) : width
  const fontSize = Math.round(width * 0.125)
  const gap      = Math.round(width * 0.055)

  if (variant === 'icon') return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <LogoMark size={width} />
    </span>
  )

  if (variant === 'wordmark') return (
    <span className={`${className} flex flex-col`} style={{ display: 'inline-flex', flexDirection: 'column' }}>
      <span style={{ fontFamily: 'Sora,sans-serif', fontSize, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
        PrepMind{' '}
        <span style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6,#22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 800 }}>AI</span>
      </span>
      {showTagline && <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: Math.round(fontSize * 0.62), color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', marginTop: 2 }}>Smarter Exam Prep</span>}
    </span>
  )

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <LogoMark size={iconSize} />
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: 'Sora,sans-serif', fontSize, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
          PrepMind{' '}
          <span style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6,#22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 800 }}>AI</span>
        </span>
        {showTagline && <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: Math.round(fontSize * 0.62), color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', marginTop: 2 }}>Smarter Exam Prep</span>}
      </span>
    </span>
  )
}
