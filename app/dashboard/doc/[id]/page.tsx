import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PlateEditor } from '@/components/editor/PlateEditor'
import { TitleInput } from '@/components/editor/TitleInput'
import { PresenceIndicator } from '@/components/editor/PresenceIndicator'
import { ShareButton } from '@/components/editor/ShareButton'

export default async function DocumentPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: document, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !document) {
    redirect('/dashboard')
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="rounded-[1.75rem] border bg-background/85 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <TitleInput documentId={document.id} initialTitle={document.title} />
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              ID <span className="font-mono text-foreground">{document.id.split('-')[0]}</span>
            </div>
            <PresenceIndicator documentId={document.id} userEmail={user.email ?? ''} />
            <ShareButton
              documentId={document.id}
              isPublic={document.is_public ?? false}
              isOwner={document.user_id === user.id}
              ownerEmail={user.email ?? ''}
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
