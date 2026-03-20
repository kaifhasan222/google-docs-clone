import { forgotPassword } from '@/app/(auth)/forgot-password/actions'
import { AuthShell } from '@/components/auth-shell'
import { AuthSubmitButton } from '@/components/auth-submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedParams = await searchParams;
  const message = resolvedParams?.message;

  return (
    <AuthShell
      eyebrow="Password recovery"
      title="Reset access without leaving the workspace."
      description="Enter your email and we'll send a clean reset flow so you can return to editing quickly."
    >
      <div className="rounded-[1.5rem] border bg-card/90 p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Forgot password</h2>
          <p className="text-sm text-muted-foreground">We will send a reset link to your inbox.</p>
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

          <div className="flex flex-col gap-3 pt-2">
            <AuthSubmitButton formAction={forgotPassword} className="h-11 rounded-2xl" type="submit" loadingText="Sending...">
              Send reset link
            </AuthSubmitButton>
            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
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
