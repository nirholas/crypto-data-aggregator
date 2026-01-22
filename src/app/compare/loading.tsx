/**
 * Compare Page Loading Skeleton
 */

export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header skeleton */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title skeleton */}
        <div className="text-center mb-8">
          <div className="h-10 w-64 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mx-auto mb-2" />
          <div className="h-5 w-80 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse mx-auto" />
        </div>

        {/* Search bar skeleton */}
        <div className="mb-8">
          <div className="h-12 w-full max-w-xl mx-auto bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 animate-pulse" />
        </div>

        {/* Selected coins skeleton */}
        <div className="flex justify-center gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-full"
            >
              <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
              <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Comparison table skeleton */}
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Table rows */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-4 gap-4 p-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
            >
              <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mx-auto"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
