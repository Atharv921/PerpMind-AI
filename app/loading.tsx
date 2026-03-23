export default function Loading() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-full border-2 border-white/10" />
          <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[#6366F1] border-r-[#8B5CF6] absolute inset-0 animate-spin"
            style={{ animationDuration: '0.8s' }} />
        </div>
        <p className="text-white/40 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
