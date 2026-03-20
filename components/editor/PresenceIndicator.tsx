'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Users } from 'lucide-react'

export function PresenceIndicator({ documentId, userEmail }: { documentId: string; userEmail: string }) {
  const [activeUsers, setActiveUsers] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel(`presence-${documentId}`, {
      config: { presence: { key: userEmail } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.keys(state)
        setActiveUsers(users)
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            email: userEmail,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [documentId, userEmail, supabase])

  if (activeUsers.length <= 1) return null

  return (
    <div className="flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
      <Users className="h-3 w-3" />
      <div className="flex items-center -space-x-1.5">
        {activeUsers.slice(0, 3).map((email) => (
          <div
            key={email}
            className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold ring-2 ring-background uppercase"
            title={email}
          >
            {email[0]}
          </div>
        ))}
        {activeUsers.length > 3 && (
          <div className="h-5 w-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-semibold ring-2 ring-background">
            +{activeUsers.length - 3}
          </div>
        )}
      </div>
      <span className="font-medium">{activeUsers.length} online</span>
    </div>
  )
}
