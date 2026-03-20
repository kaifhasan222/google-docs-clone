"use client"

import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"
import type { ComponentProps, ReactNode } from "react"
import { Button } from "@/components/ui/button"

type AuthSubmitButtonProps = ComponentProps<typeof Button> & {
  loadingText?: string
  children: ReactNode
}

export function AuthSubmitButton({
  loadingText = "Loading...",
  children,
  disabled,
  ...props
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button {...props} disabled={disabled || pending}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  )
}
