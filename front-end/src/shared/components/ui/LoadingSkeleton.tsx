export function LoadingSkeleton() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div
          className="h-24 rounded-xl animate-pulse"
          style={{ backgroundColor: "var(--color-surface)" }}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl animate-pulse"
              style={{ backgroundColor: "var(--color-surface)" }}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl animate-pulse"
              style={{ backgroundColor: "var(--color-surface)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
