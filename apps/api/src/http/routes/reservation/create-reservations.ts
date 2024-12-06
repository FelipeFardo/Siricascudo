import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, reservations } from '@/db/connection'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createReservation(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations/:slug/reservations',
    {
      schema: {
        tags: ['reservations'],
        summary: 'Create a new reservation',
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          date: z.string().transform((dateString) => {
            const date = new Date(dateString)

            return date.toISOString().split('T')[0]
          }),
          time: z.string().min(1),
          guests: z.number(),
          name: z.string().min(1),
          email: z.string().email(),
          specialRequests: z.string().optional(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const orgSlug = request.params.slug

      const { date, email, guests, name, time, specialRequests } = request.body

      const organization = await db.query.organizations.findFirst({
        where(fields, { eq }) {
          return eq(fields.slug, orgSlug)
        },
      })

      if (!organization) {
        throw new BadRequestError('Organization not found')
      }

      await db
        .insert(reservations)
        .values({
          numberOfPeople: guests,
          customerEmail: email,
          customerName: name,
          reservationDate: date,
          reservationTime: time,
          organizationId: organization.id,
          description: specialRequests,
        })
        .returning()

      return reply.status(201).send()
    }
  )
}
