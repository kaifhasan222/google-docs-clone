'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const headerList = await headers()
  const host = headerList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const origin = `${protocol}://${host}`

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect('/signup?message=Passwords do not match')
  }

  const email = formData.get('email') as string
  
  const { error } = await supabase.auth.signUp({

    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
    },
  })

  if (error) {
    redirect('/signup?message=' + error.message)
  }

  // Since email validation is disabled, redirect directly to dashboard
  redirect('/dashboard')
}
