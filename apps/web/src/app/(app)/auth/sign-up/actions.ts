'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'
import { createServerAction } from 'zsa'

import { signUp } from '@/http/auth/sign-up'

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please, enter your full name',
    }),
    email: z
      .string()
      .email({ message: 'Please, provide a valid e-mail addresss.' }),
    password: z
      .string()
      .min(6, { message: 'Password should have at least 6 characters.' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password confirmation  does not match',
    path: [`password_confirmation`],
  })

export const signUpAction = createServerAction()
  .input(signUpSchema, {
    type: 'formData',
  })
  .onInputParseError(async (error) => {
    const errors = error.flatten().fieldErrors
    return { success: false, message: null, errors }
  })
  .handler(async ({ input }) => {
    const { name, email, password } = input

    try {
      await signUp({
        name,
        email,
        password,
      })
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
