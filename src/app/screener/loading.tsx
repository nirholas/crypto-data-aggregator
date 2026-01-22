export default function ScreenerLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="h-16 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-2" />
          <div className="h-5 w-80 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Controls skeleton */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="h-10 w-64 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
        </div>

        {/* Presets skeleton */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"
            />
          ))}
        </div>

        {/* Table skeleton */}
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <div className="h-12 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="h-14 border-t border-neutral-200 dark:border-neutral-700 flex items-center gap-4 px-4 animate-pulse"
            >
              <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
              <div className="w-8 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
              </div>
              <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-700 rounded ml-auto" />
              <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
              <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
