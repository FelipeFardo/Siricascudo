import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, reservations } from '@/db/connection'
import { eq } from 'drizzle-orm'

export async function arrivedReservation(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/organizations/:slug/reservations/:reservationId/arrived',
    {
      schema: {
        tags: ['reservations'],
        summary: 'Update reservation',
        params: z.object({
          slug: z.string(),
          reservationId: z.string().uuid(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const reservationId = request.params.reservationId

      await db
        .update(reservations)
        .set({
          hasArrived: true,
        })
        .where(eq(reservations.id, reservationId))

      return reply.status(201).send()
    }
  )
}
