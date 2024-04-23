import { Icons } from '@/components/icons'
import PasswordField from '@/components/password_field'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useError from '@/hooks/ues_error'
import { cn } from '@/lib/utils'
import { Link, useForm } from '@inertiajs/react'

export default function LoginPage() {
  const form = useForm({
    email: '',
    password: '',
  })
  const error = useError('auth')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let path = `/auth/login`
    if (window.location.search.includes('next=')) {
      path += window.location.search
    }
    form.post(path)
  }

  return (
    <div className="container flex flex-col items-center justify-center w-screen h-screen">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8'
        )}
      >
        <>
          <Icons.chevronLeft className="w-4 h-4 mr-2" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="w-6 h-6 mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label>Email Address</Label>
              <Input
                id="email"
                placeholder="john.doe@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={form.processing}
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value)}
              />
            </div>
            <PasswordField
              id="password"
              name="password"
              divClassName="grid gap-1"
              label="Password"
              disabled={form.processing}
              value={form.data.password}
              onChange={(e) => form.setData('password', e.target.value)}
            />
            <div className="flex justify-end text-sm">
              <Link className="link" href="/auth/forgot_password">
                Forgot your password?
              </Link>
            </div>
            {error && (
              <p className="text-sm text-red-500" id="auth-error">
                {error}
              </p>
            )}
            <Button loading={form.processing} type="submit">
              Sign In
            </Button>
          </div>
        </form>
        <p className="px-8 text-sm text-center text-muted-foreground">
          <Link href="/signup" className="underline hover:text-brand underline-offset-4">
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
