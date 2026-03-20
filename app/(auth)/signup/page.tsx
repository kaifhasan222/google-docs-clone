import { signup } from '@/app/(auth)/signup/actions'
import { AuthShell } from '@/components/auth-shell'
import { AuthSubmitButton } from '@/components/auth-submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import Link from 'next/link'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedParams = await searchParams;
  const message = resolvedParams?.message;

  return (
    <AuthShell
      eyebrow="Create a workspace for drafting and collaboration"
      title="Start a clean document space."
      description="Create your account, build documents, and open the editor with a calmer, more premium layout."
    >
      <div className="rounded-[1.5rem] border bg-card/90 p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Sign up</h2>
          <p className="text-sm text-muted-foreground">Pick an email and password to get started.</p>
        </div>
        <form className="mt-6 grid gap-4">
          {message && (
            <div
              className={`rounded-2xl border p-3 text-sm ${
                message.includes('Check your email')
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
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" name="password" required className="h-11 rounded-2xl bg-background/80" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <PasswordInput id="confirmPassword" name="confirmPassword" required className="h-11 rounded-2xl bg-background/80" />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <AuthSubmitButton formAction={signup} className="h-11 rounded-2xl" type="submit" loadingText="Creating account...">
              Create account
            </AuthSubmitButton>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AuthShell>
  )
}
