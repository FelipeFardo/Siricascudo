'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { createServerAction } from 'zsa'

import { signInWithPassword } from '@/http/auth/sign-in-with-password'
import { acceptInvite } from '@/http/invites/accept-invite'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail addresss.' }),
  password: z.string().min(1, { message: 'Please, provide your password.' }),
})

export const signInWithEmailAndPassword = createServerAction()
  .input(signInSchema, { type: 'formData' })
  .onInputParseError(async (error) => {
    const errors = error.flatten().fieldErrors
    return { success: false, message: null, errors }
  })
  .handler(async ({ input }) => {
    const { email, password } = input
    try {
      const { token } = await signInWithPassword({
        email,
        password,
      })

      cookies().set('token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      const inviteId = cookies().get('inviteId')?.value

      if (inviteId) {
        try {
          await acceptInvite(inviteId)
          cookies().delete('inviteId')
        } catch {}
      }
    } catch (err) {
      if (err instanceof HTTPError) {
        const { message } = await err.response.json()

        return { success: false, message, errors: null }
      }

      console.log(err)
      return {
        success: false,
        message: 'Unexpected error, try again in a few minutes.',
        errors: null,
      }
    }

    return {
      success: true,
      message: null,
      errors: null,
    }
  })
