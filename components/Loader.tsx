interface LoaderProps { message?: string; size?: 'sm' | 'md' | 'lg' }
const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' }

export default function Loader({ message = 'Loading...', size = 'md' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-2 border-white/10`} />
        <div className={`${sizes[size]} rounded-full border-2 border-transparent border-t-[#6366F1] border-r-[#8B5CF6] absolute inset-0 animate-spin`} style={{ animationDuration: '0.8s' }} />
      </div>
      {message && <p className="text-white/50 text-sm animate-pulse">{message}</p>}
    </div>
  )
}

export function PageLoader({ message }: { message?: string }) {
  return <div className="min-h-screen flex items-center justify-center"><Loader message={message} size="lg" /></div>
}
