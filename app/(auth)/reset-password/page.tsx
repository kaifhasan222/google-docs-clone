import { resetPassword } from '@/app/(auth)/reset-password/actions'
import { AuthShell } from '@/components/auth-shell'
import { AuthSubmitButton } from '@/components/auth-submit-button'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedParams = await searchParams;
  const message = resolvedParams?.message;

  return (
    <AuthShell
      eyebrow="Secure password reset"
      title="Create a new password."
      description="Use a strong password and return to your documents with the same clean workspace."
    >
      <div className="rounded-[1.5rem] border bg-card/90 p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Reset password</h2>
          <p className="text-sm text-muted-foreground">Choose a new password and confirm it below.</p>
        </div>
        <form className="mt-6 grid gap-4">
          {message && (
            <div
              className={`rounded-2xl border p-3 text-sm ${
                message.includes('successfully')
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'border-destructive/20 bg-destructive/10 text-destructive'
              }`}
            >
              {message}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="password">New password</Label>
            <PasswordInput id="password" name="password" required className="h-11 rounded-2xl bg-background/80" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <PasswordInput id="confirmPassword" name="confirmPassword" required className="h-11 rounded-2xl bg-background/80" />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <AuthSubmitButton formAction={resetPassword} className="h-11 rounded-2xl" type="submit" loadingText="Updating...">
              Update password
            </AuthSubmitButton>
          </div>
        </form>
      </div>
    </AuthShell>
  )
}
