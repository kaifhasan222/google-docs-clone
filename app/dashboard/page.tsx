import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { createDocument, deleteDocument } from "@/app/dashboard/actions"
import Link from "next/link"
import { Clock3, FileText, Plus, Sparkles, Trash2, Users } from "lucide-react"

interface Document {
  id: string
  title: string
  updated_at: string
  user_id: string
  is_public: boolean
}

function formatUpdatedAt(updatedAt: string) {
  const date = new Date(updatedAt)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export default async function DashboardPage(props: {
  searchParams: Promise<{ filter?: string }>
}) {
  const searchParams = await props.searchParams
  const filter = searchParams.filter

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: ownedDocs } = await supabase
    .from("documents")
    .select("id, title, updated_at, user_id, is_public")
    .eq("user_id", user.id)

  const { data: collabDocs } = await supabase
    .from("document_collaborators")
    .select("document:documents(id, title, updated_at, user_id, is_public)")
    .eq("email", user.email ?? "")
    .eq("role", "editor")

  const sharedDocs = (collabDocs || [])
    .map((c) => c.document as unknown as Document)
    .filter(Boolean)

  const isSharedFilter = filter === "shared"
  let displayDocs: Document[] = isSharedFilter ? sharedDocs : ownedDocs || []

  displayDocs = displayDocs
    .filter((doc, index, self) => index === self.findIndex((t) => t.id === doc.id))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  const totalDocs = (ownedDocs?.length ?? 0) + (sharedDocs.length ?? 0)

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border bg-gradient-to-br from-background via-background to-secondary/50 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Workspace overview
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {isSharedFilter ? "Shared documents" : "My documents"}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage drafts, revisit recent edits, and open the editor in a layout that feels closer to Google Docs.
            </p>
          </div>

          <form action={createDocument}>
            <Button type="submit" className="h-11 rounded-full px-5 shadow-lg shadow-primary/15">
              <Plus className="h-4 w-4" />
              New document
            </Button>
          </form>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total docs", value: String(totalDocs || 0), icon: FileText },
            { label: "Shared", value: String(sharedDocs.length), icon: Users },
            { label: "Last view", value: displayDocs[0] ? formatUpdatedAt(displayDocs[0].updated_at) : "No recent doc", icon: Clock3 },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border bg-background/85 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <item.icon className="h-3.5 w-3.5 text-primary" />
                {item.label}
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {displayDocs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {displayDocs.map((doc) => {
            const isOwner = doc.user_id === user.id
            return (
              <article
                key={doc.id}
                className="group overflow-hidden rounded-[1.75rem] border bg-background/85 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="border-b bg-gradient-to-br from-secondary/45 to-transparent p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-background shadow-sm">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        isOwner
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      }`}
                    >
                      {isOwner ? "Owner" : "Shared"}
                    </span>
                  </div>
                  <Link href={isOwner ? `/dashboard/doc/${doc.id}` : `/shared/${doc.id}`} className="mt-4 block">
                    <h2 className="line-clamp-2 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {doc.title}
                    </h2>
                  </Link>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Open the document editor, review the latest content, and keep collaboration flowing.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 p-5">
                  <div className="text-xs text-muted-foreground">
                    Updated {formatUpdatedAt(doc.updated_at)}
                  </div>

                  {isOwner ? (
                    <form action={deleteDocument.bind(null, doc.id)}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        type="submit"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete {doc.title}</span>
                      </Button>
                    </form>
                  ) : (
                    <Link href={`/shared/${doc.id}`} className="text-sm font-medium text-primary hover:underline">
                      View document
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] border border-dashed bg-background/70 p-8 text-center shadow-sm">
          <div className="max-w-md space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border bg-secondary/60">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">No documents yet</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Create your first document to start writing in the cleaner Google Docs-style workspace.
            </p>
            <form action={createDocument} className="pt-2">
              <Button type="submit" className="h-11 rounded-full px-5">
                <Plus className="h-4 w-4" />
                Add document
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
