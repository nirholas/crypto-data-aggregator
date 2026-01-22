export default function CalculatorLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="h-16 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-2" />
          <div className="h-5 w-80 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
        <div className="space-y-8">
          <div className="h-48 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
          <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
        </div>
      </main>
    </div>
  );
}
