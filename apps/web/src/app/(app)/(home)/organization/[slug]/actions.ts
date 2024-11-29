'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'
import { createServerAction } from 'zsa'

// import { getCurrentOrg } from '@/auth/auth'

const reservationSchema = z.object({
  date: z.date({ required_error: 'Date is required' }),
  time: z.string().min(1, { message: 'Time is required' }),
  guests: z.string().min(1, { message: 'Number of guests is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  specialRequests: z.string().optional(),
})
export type ReservationData = z.infer<typeof reservationSchema>

export const createReservation = createServerAction()
  .input(reservationSchema, { type: 'formData' })
  .onInputParseError(async (error) => {
    const errors = error.flatten().fieldErrors

    return { success: false, message: null, errors }
  })
  .handler(async ({ input }) => {
    // const currentOrg = await getCurrentOrg()

    try {
      console.log(input)
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
      message: 'Successfully saved the organization.',
      errors: null,
    }
  })
