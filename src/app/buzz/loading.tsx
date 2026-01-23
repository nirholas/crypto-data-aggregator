export default function BuzzLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="h-16 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 w-40 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-2" />
          <div className="h-5 w-80 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-700 mb-6">
          <div className="h-10 w-28 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-10 w-36 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Items skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
