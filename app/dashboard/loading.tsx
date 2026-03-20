export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-[2rem] border bg-background/80 p-6 shadow-sm">
        <div className="h-4 w-36 rounded-full bg-muted" />
        <div className="mt-4 h-10 w-2/3 rounded-2xl bg-muted" />
        <div className="mt-3 h-4 w-1/2 rounded-full bg-muted" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-3xl border bg-muted/40" />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="overflow-hidden rounded-[1.75rem] border bg-background/80 shadow-sm">
            <div className="h-32 bg-muted/60" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 rounded-full bg-muted" />
              <div className="h-4 w-full rounded-full bg-muted" />
              <div className="h-4 w-5/6 rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
