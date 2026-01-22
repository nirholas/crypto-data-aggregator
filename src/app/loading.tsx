/**
 * Homepage Loading Skeleton
 */

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Price ticker skeleton */}
      <div className="bg-black dark:bg-white h-10 flex items-center">
        <div className="flex gap-8 px-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-12 bg-neutral-800 dark:bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-neutral-700 dark:bg-neutral-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Header skeleton */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category pills skeleton */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 bg-neutral-100 dark:bg-neutral-900 rounded-full animate-pulse flex-shrink-0"
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main content skeleton */}
          <div>
            {/* Featured article skeleton */}
            <div className="mb-8">
              <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse mb-4" />
              <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-1/2 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
            </div>

            {/* Article grid skeleton */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
                >
                  <div className="h-40 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                  <div className="p-4">
                    <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
                    <div className="h-5 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-1" />
                    <div className="h-5 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-3" />
                    <div className="h-3 w-24 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            {/* Market stats skeleton */}
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Trending skeleton */}
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-1" />
                      <div className="h-3 w-1/2 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
