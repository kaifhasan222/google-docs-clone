import { login } from '@/app/(auth)/login/actions'
import { AuthShell } from '@/components/auth-shell'
import { AuthSubmitButton } from '@/components/auth-submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedParams = await searchParams;
  const message = resolvedParams?.message;

  return (
    <AuthShell
      eyebrow="Sign in to your document workspace"
      title="Welcome back."
      description="Open your docs, continue editing, and keep the workspace in sync across devices."
    >
      <div className="rounded-[1.5rem] border bg-card/90 p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Log in</h2>
          <p className="text-sm text-muted-foreground">Use your email and password to continue.</p>
        </div>
        <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Demo Credentials
          </p>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Email:</span> kaifhasan222@gamil.com
            </p>
            <p>
              <span className="font-medium text-foreground">Password:</span> 12345678
            </p>
          </div>
        </div>
        <form className="mt-6 grid gap-4">
          {message && (
            <div
              className={`rounded-2xl border p-3 text-sm ${
                message.includes('Check your email') || message.includes('successfully')
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'border-destructive/20 bg-destructive/10 text-destructive'
              }`}
            >
              {message}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              className="h-11 rounded-2xl bg-background/80"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-primary">
                Forgot password?
              </Link>
            </div>
            <PasswordInput id="password" name="password" required className="h-11 rounded-2xl bg-background/80" />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <AuthSubmitButton formAction={login} className="h-11 rounded-2xl" type="submit" loadingText="Logging in...">
              Log in
            </AuthSubmitButton>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AuthShell>
  )
}
