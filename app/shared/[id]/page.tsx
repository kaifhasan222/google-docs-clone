import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { PlateEditor } from "@/components/editor/PlateEditor"
import { ShareButton } from "@/components/editor/ShareButton"
import { RequestAccessButton } from "@/components/editor/RequestAccessButton"
import { LockKeyhole, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function SharedDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: document, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single()

  let isCollaborator = false
  let isOwner = false

  if (user && document) {
    isOwner = document.user_id === user.id
    if (!isOwner) {
      const { data: collab } = await supabase
        .from("document_collaborators")
        .select("role")
        .eq("document_id", id)
        .eq("email", user.email ?? "")
        .single()
      isCollaborator = collab?.role === "editor"
    }
  }

  const canEdit = isOwner || isCollaborator
  const canView = canEdit || (document && document.is_public)

  if (error || !document || !canView) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-[2rem] border bg-background/90 p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border bg-secondary/60">
            <LockKeyhole className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-foreground">
            {!document ? "Document not found" : "Access Denied"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {!document
              ? "This document may no longer exist, or the link is invalid."
              : "This document is private. You need an invite to view or edit it."}
          </p>
          {!user && (
            <Link href="/login" className="mt-5 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline">
              Log in to view your workspace
            </Link>
          )}
        </div>
      </div>
    )
  }

  if (user && canEdit) {
    return (
      <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border bg-background/85 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Public document
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{document.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                {isOwner ? "Owner" : "Editor"}
              </span>
              <ThemeToggle />
              <ShareButton
                documentId={document.id}
                isPublic={document.is_public ?? false}
                isOwner={isOwner}
                ownerEmail={user.email ?? ""}
                ownerId={document.user_id}
              />
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <PlateEditor documentId={document.id} initialContent={document.content} />
        </div>
      </div>
    )
  }

  if (user && !canEdit) {
    return (
      <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          You can preview this document, but editing requires access.
        </div>

        <div className="rounded-[1.75rem] border bg-background/85 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <LockKeyhole className="h-3.5 w-3.5 text-primary" />
                View only
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{document.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              <RequestAccessButton documentId={document.id} userEmail={user.email ?? ""} userId={user.id} />
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto rounded-[1.75rem] border bg-background/85 p-4 shadow-sm">
          <div className="mx-auto max-w-[8.5in] rounded-[1.5rem] border bg-background px-5 py-6 shadow-sm sm:px-8 sm:py-10">
            <ReadOnlyDocument content={document.content} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="rounded-[1.75rem] border border-sky-500/20 bg-sky-500/10 p-4 text-sm text-sky-700 dark:text-sky-300">
        This document is public. Log in to request edit access.
      </div>

      <div className="rounded-[1.75rem] border bg-background/85 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Public preview
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{document.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-[1.75rem] border bg-background/85 p-4 shadow-sm">
        <div className="mx-auto max-w-[8.5in] rounded-[1.5rem] border bg-background px-5 py-6 shadow-sm sm:px-8 sm:py-10">
          <ReadOnlyDocument content={document.content} />
        </div>
      </div>
    </div>
  )
}

function ReadOnlyDocument({ content }: { content: ReadOnlyNode[] | unknown }) {
  return content && Array.isArray(content) ? (
    <div className="prose max-w-none prose-slate dark:prose-invert prose-headings:tracking-tight prose-p:my-3 prose-li:my-1">
      {content.map((node: ReadOnlyNode, index: number) => (
        <RenderNode key={index} node={node} />
      ))}
    </div>
  ) : (
    <p className="text-sm italic text-muted-foreground">This document is empty.</p>
  )
}

type ReadOnlyNode = {
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  type?: string
  children?: ReadOnlyNode[]
}

function RenderNode({ node }: { node: ReadOnlyNode }) {
  if (!node) return null
  if (node.text !== undefined) {
    let content: React.ReactNode = node.text
    if (node.bold) content = <strong>{content}</strong>
    if (node.italic) content = <em>{content}</em>
    if (node.underline) content = <u>{content}</u>
    return <>{content}</>
  }

  const children = node.children?.map((child, i) => <RenderNode key={i} node={child} />)

  switch (node.type) {
    case "h1":
      return <h1>{children}</h1>
    case "h2":
      return <h2>{children}</h2>
    case "h3":
      return <h3>{children}</h3>
    case "ul":
      return <ul>{children}</ul>
    case "ol":
      return <ol>{children}</ol>
    case "li":
      return <li>{children}</li>
    case "lic":
      return <>{children}</>
    case "p":
    default:
      return <p>{children}</p>
  }
}
