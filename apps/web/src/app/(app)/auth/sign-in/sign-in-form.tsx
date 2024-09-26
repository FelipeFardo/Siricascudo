'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useServerAction } from 'zsa-react'

import githubIcon from '@/assets/github-icon.svg'
import { Button } from '@/components//ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { signInWithGithub } from '../actions'
import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { executeFormAction, isPending, error, data } = useServerAction(
    signInWithEmailAndPassword,
    {
      onSuccess: ({ data }) => {
        if (data.success) router.push('/')
      },
    },
  )

  const { executeFormAction: executeFormActionSignInWithGithub } =
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
          <Label htmlFor="email">E-mail</Label>
          <Input
            name="email"
            type="email"
            id="email"
            defaultValue={searchParams.get('email') ?? ''}
          />
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
              {error?.fieldErrors?.password[0]}
            </p>
          )}
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-foreground hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Sign in with e-mail'
          )}
        </Button>

        <Button className="w-full" variant="link" size="sm" asChild>
          <Link href="/auth/sign-up">Create new account</Link>
        </Button>
      </form>
      <Separator />
      <form action={executeFormActionSignInWithGithub}>
        <Button className="w-full" variant="outline" type="submit">
          <Image src={githubIcon} className="mr-2 size-4 dark:invert" alt="" />
          Sign in with github
        </Button>
      </form>
    </div>
  )
}
