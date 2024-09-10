'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useServerAction } from 'zsa-react'

import githubIcon from '@/assets/github-icon.svg'
import { Button } from '@/components//ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { signInWithGithub } from '../actions'
import { signUpAction } from './actions'
export function SignUpForm() {
  const router = useRouter()

  const { executeFormAction, isPending, error, data } = useServerAction(
    signUpAction,
    {
      onSuccess: () => {
        router.push('/auth/sign-in')
      },
    },
  )

  const { executeFormAction: signInWithGithubAction } =
    useServerAction(signInWithGithub)
  return (
    <div className="space-y-4">
      <form action={executeFormAction} className="space-y-4">
        {data?.success === false && data.message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>
              <p>{data.message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input name="name" id="name" />
          {error?.fieldErrors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {error?.fieldErrors?.name[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" type="email" id="email" />
          {error?.fieldErrors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {error?.fieldErrors?.email[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" id="password" />
          {error?.fieldErrors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {error?.fieldErrors.password[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
            name="password_confirmation"
            type="password"
            id="password_confirmation"
          />
          {error?.fieldErrors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {error?.fieldErrors.password_confirmation[0]}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>
        <Button className="w-full" variant="link" size="sm" asChild>
          <Link href="/auth/sign-in"> Already registered? Sign in</Link>
        </Button>
      </form>

      <form action={signInWithGithubAction}>
        <Separator />
        <Button className="w-full" variant="outline" type="submit">
          <Image src={githubIcon} className="mr-2 size-4 dark:invert" alt="" />
          Sign up with github
        </Button>
      </form>
    </div>
  )
}
