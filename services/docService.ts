import { createClient } from '@/utils/supabase/client'
import type { Document, DocumentUpdate } from '@/types/document'

const supabase = createClient()

/**
 * Fetch all documents for the currently authenticated user.
 */
export async function getUserDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/**
 * Fetch a single document by ID.
 */
export async function getDocument(id: string): Promise<Document | null> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

/**
 * Update a document by ID.
 */
export async function updateDocument(id: string, updates: DocumentUpdate): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}
