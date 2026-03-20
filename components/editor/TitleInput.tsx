'use client'

import { useEffect, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'
import { createClient } from '@/utils/supabase/client'

export function TitleInput({ documentId, initialTitle }: { documentId: string; initialTitle: string }) {
  const [title, setTitle] = useState(initialTitle)
  const supabase = createClient()

  const saveTitle = useMemo(
    () =>
      debounce(async (newTitle: string) => {
        await supabase
          .from('documents')
          .update({ title: newTitle, updated_at: new Date().toISOString() })
          .eq('id', documentId)
      }, 1000),
    [documentId, supabase]
  )

  useEffect(() => {
    return () => {
      saveTitle.cancel()
    }
  }, [saveTitle])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    saveTitle(e.target.value)
  }

  return (
    <div className="group w-full">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Document title
      </div>
      <input
        type="text"
        value={title}
        onChange={handleChange}
        className="w-full rounded-2xl border border-transparent bg-background/70 px-4 py-3 text-2xl font-semibold tracking-tight text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/20 focus:bg-background focus:ring-2 focus:ring-primary/10 sm:text-3xl"
        placeholder="Untitled document"
      />
    </div>
  )
}
