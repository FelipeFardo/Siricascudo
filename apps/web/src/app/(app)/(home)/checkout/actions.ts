'use server'

import { z } from 'zod'
import { createServerAction } from 'zsa'

const checkoutSchema = z.object({
  paymentMethod: z.enum(['credit', 'cash']),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/)
    .optional(),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .optional(),
  cardCvv: z
    .string()
    .regex(/^\d{3}$/)
    .optional(),
  cardName: z.string().min(3).optional(),
})

export const processOrder = createServerAction()
  .input(checkoutSchema, { type: 'formData' })
  .onInputParseError(async (error) => {
    const errors = error.flatten().fieldErrors

    return { success: false, message: null, errors }
  })
  .handler(async () => {
    return {
      success: true,
      message: 'Successfully saved the organization.',
      errors: null,
    }
  })
