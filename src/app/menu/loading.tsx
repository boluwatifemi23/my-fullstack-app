// app/menu/loading.tsx
export default function MenuLoading() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-8">
        <div className="h-10 w-64 bg-gradient-to-r from-orange-300 to-amber-400 rounded-lg animate-pulse" />
        <div className="mt-3 h-4 w-80 bg-white/10 rounded animate-pulse" />
      </header>

      {/* categories skeleton */}
      <section className="mb-12">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="min-w-[160px] h-24 rounded-2xl bg-gradient-to-r from-[#2a0a00] via-[#5a1f00] to-[#f59e0b]/20 animate-pulse" />
          ))}
        </div>
      </section>

      {/* featured skeleton grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/5 p-4 h-64 animate-pulse" />
          ))}
        </div>
      </section>
    </main>
  );
}
