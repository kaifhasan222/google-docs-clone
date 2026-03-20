'use client'

import { FileText, Layers3, Users } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export function DashboardNav() {
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')

  return (
    <nav className="grid gap-2 text-sm font-medium">
      <Link
        href="/dashboard"
        className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-all hover:bg-secondary/80 hover:text-primary ${
          !filter ? "bg-secondary text-primary shadow-sm" : "text-muted-foreground"
        }`}
      >
        <FileText className="h-4 w-4" />
        <span className="flex-1">My documents</span>
        {!filter && <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Active</span>}
      </Link>
      <Link
        href="/dashboard?filter=shared"
        className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-all hover:bg-secondary/80 hover:text-primary ${
          filter === 'shared' ? "bg-secondary text-primary shadow-sm" : "text-muted-foreground"
        }`}
      >
        <Users className="h-4 w-4" />
        <span className="flex-1">Shared with me</span>
        {filter === 'shared' && <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Active</span>}
      </Link>
      <div className="mt-3 rounded-2xl border border-dashed border-border bg-background p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Layers3 className="h-3.5 w-3.5 text-primary" />
          Structure
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sidebar, canvas, and status areas are separated so the editor feels closer to a document app than a generic dashboard.
        </p>
      </div>
    </nav>
  )
}
