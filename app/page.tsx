import Link from "next/link"
import { ArrowRight, FileText, Languages, LockKeyhole, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

const highlights = [
  {
    title: "Paper-first editor",
    description: "A calm writing surface with a Google Docs-style rhythm: toolbar, canvas, and status chips in one line.",
  },
  {
    title: "Realtime collaboration",
    description: "Track who is active, sync edits quickly, and keep the shared workspace readable while people type.",
  },
  {
    title: "Document workspace",
    description: "Cards, filters, and quick actions are arranged like a lightweight docs dashboard instead of a generic admin panel.",
  },
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-80">
        <div className="absolute left-[-8rem] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-[12rem] h-[20rem] w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-0 docs-grid opacity-[0.18]" />
      </div>

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Mini Google Docs clone rebuilt for clarity
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                A document workspace that feels calm, fast, and familiar.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Mini Google Docs Clone keeps the Google Docs mental model, but sharpens the hierarchy:
                focused writing canvas, clean sidebar, subtle collaboration status, and a more editorial interface.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="h-12 rounded-full px-6 text-sm font-medium shadow-lg shadow-primary/20">
                  Open workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="h-12 rounded-full px-6 text-sm font-medium">
                  Create account
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Autosave", value: "2-3s debounce" },
                { label: "Collab", value: "Presence + realtime" },
                { label: "Access", value: "Owner / editor / view" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border bg-background/75 p-4 shadow-sm backdrop-blur">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 translate-y-8 rounded-[2rem] bg-primary/10 blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border bg-background/85 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b bg-muted/40 px-5 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="ml-3 h-2.5 w-32 rounded-full bg-muted-foreground/20" />
              </div>

              <div className="grid gap-4 p-5 sm:p-6">
                <div className="rounded-3xl border bg-gradient-to-br from-background to-secondary/50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Current document</p>
                      <h2 className="mt-2 text-2xl font-semibold text-foreground">Product roadmap notes</h2>
                    </div>
                    <div className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-emerald-600">
                      Saving...
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-dashed border-primary/25 bg-background p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      Rich text canvas
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="h-3 w-11/12 rounded-full bg-foreground/85" />
                      <div className="h-3 w-9/12 rounded-full bg-foreground/55" />
                      <div className="h-3 w-10/12 rounded-full bg-foreground/70" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      3 collaborators online
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Presence chips stay visible without taking over the writing surface.
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <LockKeyhole className="h-4 w-4 text-primary" />
                      Share controls
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Owners can keep documents private or open link access in one click.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-3xl border bg-background/80 p-6 shadow-sm backdrop-blur">
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Languages className="h-4 w-4 text-primary" />
          Built for a clean desktop-first editor, but responsive enough for smaller screens.
        </div>
      </section>
    </main>
  )
}
