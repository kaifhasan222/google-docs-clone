import { DashboardNav } from "./dashboard-nav"
import type { ReactNode } from "react"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-8 pt-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="space-y-4">
        <div className="rounded-[1.5rem] border bg-background/80 p-4 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
          <div className="mt-3 space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Your documents</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Browse personal docs and shared files without losing the main writing focus.
            </p>
          </div>
        </div>
        <div className="rounded-[1.5rem] border bg-background/80 p-3 shadow-sm backdrop-blur">
          <DashboardNav />
        </div>
        <div className="rounded-[1.5rem] border bg-gradient-to-br from-secondary/70 to-background p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tip</p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            New docs open with autosave and sharing controls already prepared, so the page feels closer to Google Docs.
          </p>
        </div>
      </aside>

      <div className="min-w-0 space-y-6">
        {children}
      </div>
    </div>
  )
}
