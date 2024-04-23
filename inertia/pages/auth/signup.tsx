import { Link, useForm } from '@inertiajs/react'

import { Icons } from '@/components/icons'
import PasswordField from '@/components/password_field'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useError from '@/hooks/ues_error'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const signupForm = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signupForm.post('/auth/signup')
  }

  const error = useError('auth')

  return (
    <div className="container grid flex-col items-center justify-center w-screen h-screen lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="w-6 h-6 mx-auto" />
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <Label>First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={signupForm.processing}
                  value={signupForm.data.firstName}
                  onChange={(e) => signupForm.setData('firstName', e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={signupForm.processing}
                  value={signupForm.data.lastName}
                  onChange={(e) => signupForm.setData('lastName', e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>Email Address</Label>
                <Input
                  id="email"
                  placeholder="john.doe@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={signupForm.processing}
                  value={signupForm.data.email}
                  onChange={(e) => signupForm.setData('email', e.target.value)}
                />
              </div>
              <PasswordField
                divClassName="grid gap-1"
                id="password"
                name="password"
                label="Password"
                disabled={signupForm.processing}
                value={signupForm.data.password}
                onChange={(e) => signupForm.setData('password', e.target.value)}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button loading={signupForm.processing} type="submit">
                Sign Up
              </Button>
            </div>
          </form>
          <p className="px-8 text-sm text-center text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-brand underline-offset-4">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-brand underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
