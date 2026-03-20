"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function createDocument() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        title: "Untitled Document",
        content: [{ type: "p", children: [{ text: "" }] }],
        user_id: user.id,
        is_public: false
      }
    ])
    .select("id")
    .single()

  if (error || !data) {
    console.error("Failed to create document:", error?.message, error?.details, error?.hint)
    throw new Error(`Failed to create document: ${error?.message || 'Unknown error'}`)
  }

  // Redirect to the newly created document using the App Router
  redirect(`/dashboard/doc/${data.id}`)
}

export async function deleteDocument(docId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", docId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Failed to delete document:", error)
    throw new Error("Failed to delete document")
  }

  revalidatePath("/dashboard")
}
