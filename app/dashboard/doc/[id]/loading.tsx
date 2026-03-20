export default function DocLoading() {
  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="rounded-[1.75rem] border bg-background/80 p-4 shadow-sm">
        <div className="h-3 w-32 rounded-full bg-muted" />
        <div className="mt-4 h-10 w-2/3 rounded-2xl bg-muted" />
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-8 w-20 rounded-full bg-muted" />
          <div className="h-8 w-24 rounded-full bg-muted" />
          <div className="h-8 w-28 rounded-full bg-muted" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[1.75rem] border bg-background/80 shadow-sm">
        <div className="border-b bg-muted/20 px-4 py-3">
          <div className="h-3 w-24 rounded-full bg-muted" />
        </div>
        <div className="flex items-center gap-1 border-b px-3 py-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-9 w-9 rounded-full bg-muted" />
          ))}
        </div>
        <div className="docs-grid min-h-full bg-muted/10 p-6">
          <div className="mx-auto h-full w-full max-w-[8.5in] rounded-[1.5rem] border bg-background p-6 shadow-sm">
            <div className="space-y-4">
              <div className="h-4 w-2/3 rounded-full bg-muted" />
              <div className="h-4 w-full rounded-full bg-muted" />
              <div className="h-4 w-11/12 rounded-full bg-muted" />
              <div className="h-4 w-4/5 rounded-full bg-muted" />
              <div className="h-4 w-5/6 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
