/**
 * DeFi Page Loading Skeleton
 */

export default function DefiLoading() {
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
        <div className="mb-8">
          <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
          <div className="h-5 w-80 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-3" />
              <div className="h-8 w-40 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Protocol list skeleton */}
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-6" />

          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-white dark:bg-black rounded-lg border border-neutral-100 dark:border-neutral-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
                  <div>
                    <div className="h-5 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-1" />
                    <div className="h-3 w-20 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-1" />
                  <div className="h-3 w-16 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
