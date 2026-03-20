import Link from "next/link"
import { FileText, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

function getAvatarLabel(email?: string) {
  if (!email) return "U"

  return email.trim().charAt(0).toUpperCase() || "U"
}

export function Header({ userEmail }: { userEmail?: string }) {
  async function handleLogout() {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-full pr-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-background shadow-sm">
            <FileText className="h-5 w-5 text-primary" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold leading-none text-foreground">Mini Google Docs Clone</span>
            <span className="mt-1 block text-[11px] text-muted-foreground">Docs workspace</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground lg:flex">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Realtime sync enabled
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background text-xs font-semibold tracking-wide text-foreground shadow-sm transition-colors hover:bg-secondary cursor-pointer outline-none">
              {getAvatarLabel(userEmail)}
              <span className="sr-only">Toggle user menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 min-w-80 p-2">
              <div className="rounded-2xl border bg-muted/30 px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Signed in as
                </p>
                <p className="mt-1 break-all text-sm font-medium text-foreground">
                  {userEmail ?? "Unknown user"}
                </p>
              </div>
              <DropdownMenuSeparator />
              <form action={handleLogout}>
                <button type="submit" className="w-full text-left">
                  <DropdownMenuItem className="rounded-xl px-3 py-2">Logout</DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
