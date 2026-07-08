export default function ProyectosLoading() {
  return (
    <div className="min-h-screen relative bg-surface">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[10%] w-[50vw] h-[50vw] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Skeleton hero */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-20">
          <div className="flex-1 w-full space-y-6">
            <div className="h-6 w-28 rounded-full bg-border-color/30 animate-shimmer" />
            <div className="space-y-3">
              <div className="h-16 w-3/4 rounded-xl bg-border-color/30 animate-shimmer" />
              <div className="h-16 w-1/2 rounded-xl bg-border-color/20 animate-shimmer" />
            </div>
            <div className="h-5 w-96 rounded bg-border-color/20 animate-shimmer" />
          </div>
          <div className="flex-1 w-full">
            <div className="aspect-[4/3] rounded-2xl bg-border-color/10 animate-shimmer" />
          </div>
        </div>

        {/* Skeleton tabs */}
        <div className="flex items-center justify-center mb-14">
          <div className="h-12 w-80 rounded-full bg-border-color/20 animate-shimmer" />
        </div>

        {/* Skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(400px,auto)]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[1.5rem] bg-card-bg border border-border-subtle p-8 flex flex-col justify-end animate-shimmer">
              <div className="mb-auto pb-8">
                <div className="flex gap-2 mb-4">
                  <div className="h-5 w-20 rounded-full bg-border-color/40" />
                  <div className="h-5 w-16 rounded-full bg-border-color/30" />
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="h-8 w-8 rounded-full bg-border-color/30" />
                  <div className="h-8 w-8 rounded-full bg-border-color/30" />
                </div>
              </div>
              <div className="h-8 w-3/4 rounded-lg bg-border-color/40 mb-3" />
              <div className="space-y-2 mb-6">
                <div className="h-4 w-full rounded bg-border-color/30" />
                <div className="h-4 w-2/3 rounded bg-border-color/30" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded bg-border-color/30" />
                <div className="h-6 w-20 rounded bg-border-color/30" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
