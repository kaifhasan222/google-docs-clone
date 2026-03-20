'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  Share2,
  Link2,
  Check,
  Globe,
  Lock,
  UserPlus,
  Mail,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Collaborator {
  id: string
  email: string
  role: string
}

interface EditRequest {
  id: string
  requester_email: string
  requester_id: string
  status: string
  created_at: string
}

interface ShareButtonProps {
  documentId: string
  isPublic: boolean
  isOwner: boolean
  ownerEmail?: string
  ownerId?: string
}

export function ShareButton({ documentId, isPublic: initialPublic, isOwner, ownerEmail, ownerId }: ShareButtonProps) {
  const [isPublic, setIsPublic] = useState(initialPublic)
  const [copied, setCopied] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [addingEmail, setAddingEmail] = useState(false)
  const [error, setError] = useState('')
  const [editRequests, setEditRequests] = useState<EditRequest[]>([])
  const supabase = createClient()

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/shared/${documentId}` : ''

  const loadCollaborators = useCallback(async () => {
    const { data } = await supabase
      .from('document_collaborators')
      .select('*')
      .eq('document_id', documentId)
      .order('added_at', { ascending: true })

    if (data) setCollaborators(data)
  }, [documentId, supabase])

  const loadEditRequests = useCallback(async () => {
    const { data } = await supabase
      .from('edit_requests')
      .select('*')
      .eq('document_id', documentId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (data) setEditRequests(data)
  }, [documentId, supabase])

  useEffect(() => {
    if (showPanel && isOwner) {
      const timer = window.setTimeout(() => {
        void loadCollaborators()
        void loadEditRequests()
      }, 0)

      return () => window.clearTimeout(timer)
    }
  }, [showPanel, isOwner, loadCollaborators, loadEditRequests])

  const approveRequest = async (request: EditRequest) => {
    await supabase
      .from('document_collaborators')
      .upsert({ document_id: documentId, email: request.requester_email, role: 'editor', owner_id: ownerId })

    await supabase.from('edit_requests').update({ status: 'approved' }).eq('id', request.id)
    setEditRequests((prev) => prev.filter((r) => r.id !== request.id))
    loadCollaborators()
  }

  const denyRequest = async (request: EditRequest) => {
    await supabase.from('edit_requests').update({ status: 'denied' }).eq('id', request.id)
    setEditRequests((prev) => prev.filter((r) => r.id !== request.id))
  }

  const togglePublic = async () => {
    const newValue = !isPublic
    setIsPublic(newValue)
    await supabase.from('documents').update({ is_public: newValue }).eq('id', documentId)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const addCollaborator = async () => {
    if (!newEmail.trim()) return
    if (!newEmail.includes('@')) {
      setError('Valid email required')
      return
    }

    setAddingEmail(true)
    setError('')

    const { error: insertError } = await supabase
      .from('document_collaborators')
      .insert({ document_id: documentId, email: newEmail.trim().toLowerCase(), role: 'editor', owner_id: ownerId })

    if (insertError) {
      setError(insertError.code === '23505' ? 'Already added' : 'Failed to add')
    } else {
      setNewEmail('')
      loadCollaborators()
    }

    setAddingEmail(false)
  }

  const removeCollaborator = async (id: string) => {
    await supabase.from('document_collaborators').delete().eq('id', id)
    setCollaborators((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <Dialog open={showPanel} onOpenChange={setShowPanel}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border bg-background text-xs shadow-sm"
          />
        }
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-[calc(100%-1.5rem)] overflow-hidden rounded-[1.5rem] p-0 sm:max-w-[34rem]" showCloseButton>
        <DialogHeader className="border-b bg-muted/30 px-4 py-3">
          <DialogTitle className="text-sm font-semibold">Share document</DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(85vh-3.5rem)] space-y-4 overflow-auto p-4">
              {isOwner && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Add people
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={newEmail}
                        onChange={(e) => {
                          setNewEmail(e.target.value)
                          setError('')
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && addCollaborator()}
                        className="h-10 w-full rounded-2xl border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <Button size="sm" onClick={addCollaborator} disabled={addingEmail} className="h-10 rounded-2xl">
                      <UserPlus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
              )}

              <section className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  People with access
                </label>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {(ownerEmail || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{ownerEmail}</p>
                      <p className="text-[11px] text-muted-foreground">Owner</p>
                    </div>
                  </div>

                  {collaborators.map((collab) => (
                    <div key={collab.id} className="group flex items-center gap-2 rounded-2xl border bg-background px-3 py-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                        {collab.email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{collab.email}</p>
                        <p className="text-[11px] text-muted-foreground">Editor</p>
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => removeCollaborator(collab.id)}
                          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {collaborators.length === 0 && (
                    <p className="rounded-2xl border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">
                      No collaborators yet
                    </p>
                  )}
                </div>
              </section>

              {isOwner && editRequests.length > 0 && (
                <section className="space-y-2 border-t pt-3">
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
                    Pending requests
                  </label>
                  <div className="space-y-2">
                    {editRequests.map((req) => (
                      <div key={req.id} className="flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300">
                          {req.requester_email[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{req.requester_email}</p>
                          <p className="text-[11px] text-muted-foreground">wants to edit</p>
                        </div>
                        <button onClick={() => approveRequest(req)} className="text-emerald-500 hover:text-emerald-600" title="Approve">
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button onClick={() => denyRequest(req)} className="text-destructive hover:text-destructive/80" title="Deny">
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="space-y-2 border-t pt-3">
                <label className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Link sharing
                </label>

                {isOwner ? (
                  <div className="flex items-center justify-between rounded-2xl border bg-background px-3 py-2">
                    <div className="flex items-center gap-2">
                      {isPublic ? <Globe className="h-4 w-4 text-emerald-500" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                      <p className="text-xs font-medium">{isPublic ? 'Anyone with link can view' : 'Restricted'}</p>
                    </div>
                    <button
                      onClick={togglePublic}
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
                        isPublic ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                      }`}
                    >
                      <span
                        className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                          isPublic ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-2">
                    <Globe className="h-4 w-4 text-emerald-500" />
                    <p className="text-xs font-medium">Public link</p>
                  </div>
                )}

                {isPublic && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="h-10 flex-1 rounded-2xl border bg-background px-3 text-xs font-mono text-muted-foreground outline-none"
                    />
                    <Button size="sm" variant="secondary" className="h-10 rounded-2xl gap-1" onClick={copyLink}>
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Link2 className="h-3.5 w-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                )}
              </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
