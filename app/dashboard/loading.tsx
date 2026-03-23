export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      {/* Navbar skeleton */}
      <div className="fixed top-0 left-0 right-0 h-[64px] bg-[#09090f]/90 backdrop-blur-xl border-b border-white/[0.06] z-50" />

      <div className="page-container pt-24 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-8 w-56 bg-white/[0.06] rounded-xl" />
            <div className="h-4 w-32 bg-white/[0.04] rounded-lg" />
          </div>
          <div className="h-10 w-28 bg-white/[0.06] rounded-xl" />
        </div>

        {/* Plan banner skeleton */}
        <div className="h-16 bg-white/[0.04] rounded-2xl mb-8 border border-white/[0.06]" />

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 space-y-2">
              <div className="h-7 w-7 bg-white/[0.06] rounded-lg" />
              <div className="h-7 w-16 bg-white/[0.06] rounded-lg" />
              <div className="h-3 w-20 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>

        {/* Test list skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-white/[0.06] rounded" />
                <div className="h-3 w-32 bg-white/[0.04] rounded" />
              </div>
              <div className="h-6 w-12 bg-white/[0.06] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
