'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { HandHelping, Check, Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RequestAccessButtonProps {
  documentId: string
  userEmail: string
  userId: string
}

export function RequestAccessButton({ documentId, userEmail, userId }: RequestAccessButtonProps) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'approved' | 'denied' | 'sending'>('idle')
  const supabase = createClient()

  useEffect(() => {
    async function checkExistingRequest() {
      const { data } = await supabase
        .from('edit_requests')
        .select('status')
        .eq('document_id', documentId)
        .eq('requester_email', userEmail)
        .single()

      if (data) {
        setStatus(data.status as 'pending' | 'approved' | 'denied')
      }
    }

    checkExistingRequest()
  }, [documentId, supabase, userEmail])

  const sendRequest = async () => {
    setStatus('sending')
    const { error } = await supabase
      .from('edit_requests')
      .insert({
        document_id: documentId,
        requester_email: userEmail,
        requester_id: userId,
        status: 'pending',
      })

    if (error) {
      if (error.code === '23505') {
        setStatus('pending')
      } else {
        setStatus('idle')
      }
    } else {
      setStatus('pending')
    }
  }

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-600 dark:text-amber-400">
        <Clock className="h-3.5 w-3.5" />
        Request Pending
      </div>
    )
  }

  if (status === 'approved') {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400">
        <Check className="h-3.5 w-3.5" />
        Access granted - refresh page
      </div>
    )
  }

  if (status === 'denied') {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
        <X className="h-3.5 w-3.5" />
        Request Denied
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 rounded-full border bg-background text-xs shadow-sm"
      onClick={sendRequest}
      disabled={status === 'sending'}
    >
      <HandHelping className="h-3.5 w-3.5" />
      {status === 'sending' ? 'Sending...' : 'Request Edit Access'}
    </Button>
  )
}
