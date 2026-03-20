import Link from "next/link"
import { FileText, Sparkles } from "lucide-react"
import type { ReactNode } from "react"

type AuthShellProps = {
  title: string
  description: string
  eyebrow: string
  children: ReactNode
}

export function AuthShell({ title, description, eyebrow, children }: AuthShellProps) {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-background via-background to-secondary/50 p-8 shadow-xl sm:p-10">
          <div className="absolute inset-0 docs-grid opacity-[0.18]" />
          <div className="absolute right-0 top-0 h-56 w-56 translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border bg-background shadow-sm">
                  <FileText className="h-4 w-4 text-primary" />
                </span>
                Mini Google Docs Clone
              </Link>

              <div className="inline-flex items-center gap-2 rounded-full border bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {eyebrow}
              </div>

              <div className="max-w-xl space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                  {description}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Focused writing",
                "Shared editing",
                "Fast autosave",
              ].map((item) => (
                <div key={item} className="rounded-2xl border bg-background/75 p-4 shadow-sm backdrop-blur">
                  <p className="text-sm font-medium text-foreground">{item}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Designed to stay calm while the document gets busy.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center rounded-[2rem] border bg-background/90 p-4 shadow-xl backdrop-blur sm:p-8">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  )
}
